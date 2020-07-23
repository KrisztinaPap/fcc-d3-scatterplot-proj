// Set variables

let url = 'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json';
let req = new XMLHttpRequest()

let values

let xScale
let yScale

let width = 800
let height = 600
let padding = 40

let svg = d3.select('svg')

// Set functions

// Draw canvas

let drawCanvas = () => {
    svg.attr('width', width)
    svg.attr('height', height)
}

// Generate scales

let generateScales = () => {

    xScale = d3.scaleLinear()
                .range([padding, (width - padding)])
                .domain([d3.min(values, (item) => {
                    return item['Year']
                }), d3.max(values, (item) => {
                    return item['Year']
                })])
    
    yScale = d3.scaleTime()
                .range([padding, (height - padding)])
                .domain([d3.min(values, (item) => {
                    return new Date(item['Seconds'] * 1000)
                }), d3.max(values, (item) => {
                    return new Date(item['Seconds'] * 1000)
                })])
}

// Draw circles

let drawCircles = () => {

    let tooltip = d3.select('body')
                    .append('div')
                    .attr('id', 'tooltip')
                    .style('visibility', 'hidden')
                    .style('width', 'auto')
                    .style('height', 'auto')

    svg.selectAll("circle")
        .data(values)
        .enter()
        .append("circle")
        .attr("class", "dot")
        .attr("cx", (item) => {
            return xScale(item['Year'])
        })
        .attr("cy", (item) => {
            return yScale(new Date(item['Seconds'] * 1000))
        })  
        .attr('r', '5')
        .attr('data-xvalue', (item) => {
            return item['Year']
        }) 
        .attr('data-yvalue', (item) => {
            return new Date(item['Seconds'] * 1000)
        })
        .on('mouseover', (item) => {
            tooltip.transition()
                .style('visibility', 'visible')
            
            tooltip.text(item["Name"] + ": " + item["Doping"])

            document.querySelector('#tooltip').setAttribute("data-year", item["Year"])

        })
        .on('mouseout', (item) => {
            tooltip.transition()
                .style('visibility', 'hidden')
        })
}

// Generate the axes

let generateAxes = () => {

    let xAxis = d3.axisBottom(xScale)
                    .tickFormat(d3.format('d'))

    svg.append('g')
        .call(xAxis)
        .attr('id', 'x-axis')
        .attr('transform', 'translate(0, ' + (height - padding) + ')')
    
    let yAxis = d3.axisLeft(yScale)
                    .tickFormat(d3.timeFormat('%M:%S'))

    svg.append('g')
        .call(yAxis)
        .attr('id', 'y-axis')
        .attr('transform', 'translate(' + padding + ', 0)')
}

// Set up JSON API and call functions

req.open('GET', url, true)
req.onload = () => {
    values = JSON.parse(req.responseText)
    console.log(values)
    drawCanvas()
    generateScales()
    drawCircles()
    generateAxes()
}
req.send()