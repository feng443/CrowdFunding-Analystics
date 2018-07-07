

function x(d) { return +d.gdp; }
function y(d) { return (+d.loan_amount/+d.loan_count);  } ///d.loan_count; }
function color(d) { return d.gender; }
function key(d) { return d.country_name; }
function year(d) { return d.year; }

// Chart dimensions.
const margin = {top: 19.5, right: 4, bottom: 19.5, left: 42},
    width = 645 - margin.right - margin.left,
    height = 420 - margin.top - margin.bottom;

let svg;
let xScale;
let yScale;

let dot, dotlabel;


// let maxLoanAvg = 1000
// let maxGDP = 40000
// let year = 2016
// let gender = 'f'

d3.json("/data/scatter/2016/f", function (error, loanSummaryData){
    
  
	if (error) throw error;

    console.log(loanSummaryData);
    
    xScale = d3.scaleLinear().domain([0, 60000]).range([0, width]),
    yScale = d3.scaleLinear().domain([0, 8500]).range([height, 0]),
    colorScale = d3.scaleOrdinal(d3.schemeCategory10);

	// Create the SVG container and set the origin.
	 svg = d3.select("#scatter").append("svg")
					.attr("width", width + margin.left + margin.right)
					.attr("height", height + margin.top + margin.bottom)
			.append("g")
					.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var xValue = function(d) { return +d.gdp;}, // data -> value

    xMap = function(d) {return xScale(xValue(d));}, // data -> display
    xAxis = d3.axisBottom(xScale);

    // setup y
    var yValue = function(d) { return (+d.loan_amount/+d.loan_count);}, // data -> value
    //yScale = d3.scale.linear().range([height, 0]), // value -> display
    yMap = function(d) { return yScale(yValue(d));}, // data -> display
    yAxis = d3.axisLeft(yScale);

    //alert(yValue)
    // Add the x-axis.
    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

    // Add the y-axis.
    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis);

    // Add an x-axis label.
    svg.append("text")
        .attr("class", "x label")
        .attr("class", "x label")
        .attr("text-anchor", "end")
        .attr("x", width)
        .attr("y", height - 6)
        .text("GDP");

    // Add a y-axis label.
    svg.append("text")
        .attr("class", "y label")
        .attr("text-anchor", "end")
        .attr("y", 6)
        .attr("dy", ".75em")
        .attr("transform", "rotate(-90)")
        .text("Average loan amount");


    var yearLabel = svg.append('text')
        .attr('class', 'year')
        .attr('x', width / 2)
        .attr('y', height / 2)
        .attr('dy', '.28em')
        .style('font-size', width / 3)
        .style('text-anchor', 'middle')
        .style('font-weight', 'bold')
        .style('opacity', 0.2)
        .text('2016')

    // Add a dot per country. Initialize the data at 2012, and set the colors.
    dot = svg.append("g")
        .selectAll(".dot")
        //.data(interpolateData(2012))
        .data(loanSummaryData)
        .enter()
        .append("circle")
        .attr("class", "dot")
        .attr("id", function(d){ return d.country_name; })
        .style("opacity", 0.8)      // set the element opacity
        .style("stroke", "black")    // set the line color
        .style("fill", "orange")
        .call(position);

    // Add a label for each dot.
    dotlabel = svg.append("g")
        .attr("class", "dotlabels")
        .selectAll(".dotlabel")
        //.data(interpolateData(2012))
        .enter()
        .append("text")
        .attr("class", "dotlabel")
        .attr("id", function(d) { return d.country_name; })
        .attr("text-anchor", "end")
        //.text(function(d) { return d.country_name; })
        .text(function(d) { return d.country_name; })
        .call(positionlabel);

    // Add a title.
    dot.append("title")
        .text(function(d) { return `loan average: ${(+d.loan_amount/+d.loan_count)} GDP: ${(d.gdp)}`});
        
    // Positions the dots based on data.
    

  

});


document.getElementById("updateButton").onclick = 
function nextYear() {
    //alert("I am here!");
    console.log('set year')
    d3.json("/data/scatter/2015/f", function (error, loanSummaryData){
        console.log(loanSummaryData)
        if (error) throw error;
        d3.select('.year')
        //.transition()
        //.delay(500)
        //.duration(6000)
        .attr('class', 'year')
        .attr('x', width / 2)
        .attr('y', height / 2)
        .attr('dy', '.28em')
        .style('font-size', width / 3)
        .style('text-anchor', 'middle')
        .style('font-weight', 'bold')
        .style('opacity', 0.2)
        .text('2015')


        //svg.selectAll('circle')
        svg.selectAll('.dot')//.transition()
            //.duration(1000)
            .data(loanSummaryData)
            .enter()
            // .transition()
            //.delay(500)
            //.duration(1000)
            //.append("circle")
            //.attr("class", "dot")
            //.attr("id", function(d){ return d.country_name; })
            //.style("opacity", 0.8)      // set the element opacity
            //.style("stroke", "black")    // set the line color
            //.style("fill", "orange")
            // .attr("cx", d => xScale(x(d)))
            // .attr("cy", function(d) { return yScale(y(d)); })
            // .attr("r",  7)
            .call(position)
        
        
        // Positions the dots based on data.
        // function position(dot) {
        //     console.log('each dot')
        //     dot.attr("cx", function(d) {
        //         //console.log(d )
        //         return xScale(x(d));
        //         })
        //         .attr("cy", function(d) { return yScale(y(d)); })
        //     .attr("r",  7)

    })

    // function positionlabel(dot) {
    //         dot.attr("x", function(d) { return xScale(x(d)); })
    //                     .attr("y", function(d) { return yScale(y(d)); })
    //                     .attr("dx", -5 )
    //                     .attr("dy", 4 );
    // }
    //     console.log('done')
    // });

}

function position(dot) {

    dot.attr("cx", (d) => xScale(x(d)) )
        .attr("cy", function(d) { return yScale(y(d)); })
        .attr("r",  7)

}

function positionlabel(dot) {
        dot.attr("x", function(d) { return xScale(x(d)); })
        .attr("y", function(d) { return yScale(y(d)); })
        .attr("dx", -5 )
        .attr("dy", 4 );
}

    


