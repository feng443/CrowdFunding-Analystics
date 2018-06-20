

function x(d) { return +d.gdp; }
function y(d) { return (+d.loan_amount/+d.loan_count);  } ///d.loan_count; }
function color(d) { return d.gender; }
function key(d) { return d.country_name; }
function year(d) { return d.year; }

var years = d3.range(2012, 2016 + 1)
var interval = 500

// Chart dimensions.
var margin = {top: 19.5, right: 4, bottom: 19.5, left: 42},
    width = 645 - margin.right - margin.left,
    height = 420 - margin.top - margin.bottom;

//// Various scales. These domains make assumptions of data, naturally.
//var xScale = d3.scaleLinear().domain([d3.min(d => d.loan_amount),d3.max(d => d.loan_amount)]).range([0, width]), //.log().domain([100000, 40000000]).range([0, width]),
//    yScale = d3.scaleLinear().domain([0, 100]).range([height, 0]),
//    colorScale = d3.scaleOrdinal(d3.schemeCategory10);

maxLoanAvg = 1000
maxGDP = 40000
year = 2016
gender = 'f'


d3.queue()
.defer(d3.json, "/data/scatter/2016/m")
.defer(d3.json, "/data/scatter/2015/m")
.await(analyze);
  
function analyze(error, loanSummaryData, year2015) {
    if(error) { console.log(error); }
  
    //alert(loanSummaryData[0])
    console.log(loanSummaryData[0]);
    console.log(year2015[0]);
// d3.json("/data/scatter/2016/f", function (error, loanSummaryData){
	//d3.csv("")
	if (error) throw error;

	console.log(loanSummaryData);

// Various scales. These domains make assumptions of data, naturally.
var xScale = d3.scaleLinear().domain([d3.min(loanSummaryData, d => x(d)) * 0.5,
      d3.max(loanSummaryData, d => x(d)) * .6
    ]).range([0, width]), //.log().domain([100000, 40000000]).range([0, width]),
//xScale = d3.scaleLinear().domain([0, 60000]).range([0, width]),
//yScale = d3.scaleLinear().domain([0, 8500]).range([height, 0])
    yScale = d3.scaleLinear().domain([d3.min(loanSummaryData,d => (+d.loan_amount/+d.loan_count))* 0.5,d3.max(loanSummaryData, d => (+d.loan_amount/+d.loan_count))* 0.6]).range([height, 0])
    //colorScale = d3.scaleOrdinal(d3.schemeCategory10);

	// Create the SVG container and set the origin.
	var svg = d3.select("#scatter").append("svg")
					.attr("width", width + margin.left + margin.right)
					.attr("height", height + margin.top + margin.bottom)
			.append("g")
					.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var xValue = function(d) { return +d.gdp;}, // data -> value

    xMap = function(d) {return xScale(xValue(d));}, // data -> display
    xAxis = d3.axisBottom(xScale);

   // alert(xValue)

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

	// var bisect = d3.bisector(function(d) { return d[0]; });

	// Add a dot per state. Initialize the data at 2012, and set the colors.
	var dot = svg.append("g")
			.selectAll(".dot")
			//.data(interpolateData(2012))
			.data(loanSummaryData)
			.enter()
			.append("circle")
            .attr("class", "dot")
            .attr("id", function(d){ return d.country_name; })
            //.style("fill", function(d) { return colorScale(color(d)); })
            .style("opacity", 0.6)      // set the element opacity
            .style("stroke", "grey")    // set the line color
            .style("fill", "steelblue")
            .call(position);

            dot = updateToolTip(dot);
                    

	// Add a title.
	dot.append("title")
				.text(function(d) { return `loan average: ${(+d.loan_amount/+d.loan_count)} GDP: ${(d.gdp)}`});
				
	document.getElementById("updateButton").onclick = function () {
        //alert("I am here!");
                    
        //Set the year background text to the selected year:
        yearLabel.text("2015")
        // Update circles
        dot = svg.selectAll(".dot")
            .data(year2015) // Update with new data
            .transition()
            .duration(1000)
            .attr("fill", "red") // Change color
            .attr("r", 7) // Change size
            .ease(d3.easeBounce)
            .call(position)
            .on("end", function() {
                console.log("purple")
                d3.select(this)
                .style("fill", "steelblue")
            });

            


            dot = updateToolTip(dot);
            // Add a label(tooltip) for each dot.
    // var dotlabel = svg.append("g")
            d3.selectAll('.dotlabels')
                .attr("class", "dotlabels")
                //.selectAll(".dotlabel")
                //.data(year2015)
                .transition()
                .duration(1000)
                .enter().append("text")
                .attr("class", "dotlabel")
                .attr("id", function(d) { return d.country_name; })
                //.attr("text-anchor", "end")
                //.text(function(d) { return d.country_name; })
                //.text(function(d) { return d.country_name; })
                //.call(positionlabel)
                //.call(updateToolTip)


            

	}

	// Positions the dots based on data.
	function position(dot) {

			dot.attr("cx", function(d) {
			    //console.log(d )
			    return xScale(x(d));
			    })
				.attr("cy", function(d) { return yScale(y(d)); })
			.attr("r",  8)

	}

	function positionlabel(dot) {
			dot.attr("x", function(d) { return xScale(x(d)); })
						.attr("y", function(d) { return yScale(y(d)); })
						.attr("dx", -5 )
						.attr("dy", 4 );
	}

    function updateToolTip(dot){


        var toolTip = d3.tip()
            .attr("class", "tooltip")
            .offset([60, 160])
            .html(function (d) {
            return (`Country: ${d.country_name}</br>loan average: ${(+d.loan_amount/+d.loan_count)} GDP: ${(d.gdp)}`);
            });
            // dot.append("title")
            // .text(function(d) { return `loan average: ${(+d.loan_amount/+d.loan_count)} GDP: ${(d.gdp)}`});
    

        dot.call(toolTip);

        dot.on("mouseover", function (data) {
            console.log(data)
                toolTip.show(data);
            })
            // onmouseout event
            .on("mouseout", function (data, index) {
                toolTip.hide(data);
            });
        return dot;
    }
	
}