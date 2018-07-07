
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


// d3.queue()
// .defer(d3.json, "/data/country")
// .defer(d3.json, "/data/country_gdp")
// .defer(d3.json, "/data/scatter/" + year + '/' + gender)
// .defer(d3.json, "data/monthly_loan_summary/")
// .defer(d3.json, "data/year_month/")
// .await(function(error, countryData, gdpData, loanSummaryData,monthlyLoanSummary, yearData) {
// 	//if (error) throw error;
// 	if(error) console.log(error);
// d3.json("../data/loanSummary.json", function (error, loanSummaryData){



d3.queue()
.defer(d3.json, "/data/scatter/2016/f")
.defer(d3.json, "/data/scatter/2015/f")
.await(analyze);
  
function analyze(error, year2016, year2015) {
    if(error) { console.log(error); }
  
    console.log(year2016[0]);
    console.log(year2015[0]);
// d3.json("/data/scatter/2016/f", function (error, loanSummaryData){
	//d3.csv("")
	if (error) throw error;

	console.log(loanSummaryData);

// Various scales. These domains make assumptions of data, naturally.
//var xScale = d3.scaleLinear().domain([d3.min(d => d.gdp),d3.max(d => d.gdp)]).range([0, width]), //.log().domain([100000, 40000000]).range([0, width]),
    var xScale = d3.scaleLinear().domain([0, 60000]).range([0, width]),
    yScale = d3.scaleLinear().domain([0, 8500]).range([height, 0]),
    //yScale = d3.scaleLinear().domain([d3.min(d => (+d.loan_amount/+d.loan_count)),d3.max(d => (+d.loan_amount/+d.loan_count))]).range([height, 0]),
    colorScale = d3.scaleOrdinal(d3.schemeCategory10);

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


//	// Add the year label; the value is set on transition.
//	var label = svg.append("text")
//					.attr("class", "year label")
//					.attr("text-anchor", "end")
//					.attr("y", height - 24)
//					.attr("x", width)
//					.text(1950);

	var bisect = d3.bisector(function(d) { return d[0]; });

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
            .style("opacity", 0.8)      // set the element opacity
            .style("stroke", "black")    // set the line color
            .style("fill", "orange")
            .call(position);

	// Add a label for each dot.
	var dotlabel = svg.append("g")
					.attr("class", "dotlabels")
			.selectAll(".dotlabel")
					//.data(interpolateData(2012))
			.enter().append("text")
					.attr("class", "dotlabel")
					.attr("id", function(d) { return d.country_name; })
					.attr("text-anchor", "end")
					//.text(function(d) { return d.country_name; })
					.text(function(d) { return d.country_name; })
					.call(positionlabel);

	// Add a title.
	dot.append("title")
				//.text(function(d) { return (d.loan_amount/d.loan_count); });
				//.text(function(d){return d.gdp;});
				.text(function(d) { return `loan average: ${(+d.loan_amount/+d.loan_count)} GDP: ${(d.gdp)}`});
				//.text(function(d) { `loan average: <br>${(+d.loan_amount/+d.loan_count)}<br>GDP: <br>${d.gdp}`})

	document.getElementById("updateButton").onclick = function () {
					alert("I am here!");
			
					loanSummaryData.forEach(function(d){
						console.log(d.year);
					});
					var dot = svg.append("g")
						.selectAll(".dot")
						.transition()
						.duration(500)
						//.data(interpolateData(2012))
						.data(loanSummaryData)
						.enter()
						.append("circle")
						.attr("class", "dot")
						.attr("id", function(d){ return d.country_name; })
						//.style("fill", function(d) { return colorScale(color(d)); })
						.style("opacity", 0.8)      // set the element opacity
						.style("stroke", "black")    // set the line color
						.style("fill", "orange")
						.call(position);
			
				// Add a label for each dot.
				var dotlabel = svg.append("g")
								.attr("class", "dotlabels")
						.selectAll(".dotlabel")
								//.data(interpolateData(2012))
						.enter().append("text")
								.attr("class", "dotlabel")
								.attr("id", function(d) { return d.country_name; })
								.attr("text-anchor", "end")
								//.text(function(d) { return d.country_name; })
								.text(function(d) { return d.country_name; })
								.call(positionlabel);
			
				// Add a title.
				dot.append("title")
			
					.text(function(d) { return `loan average: ${(+d.loan_amount/+d.loan_count)} GDP: ${(d.gdp)}`});
	}
	// Add an overlay for the year label.
	//var box = label.node().getBBox();

	/*var overlay = svg.append("rect")
				.attr("class", "overlay")
				.attr("x", box.x)
				.attr("y", box.y)
				.attr("width", box.width)
				.attr("height", box.height)
				.on("mouseover", enableInteraction);*/
/////////

	// var startingTranstion =	svg.transition()
	// 				.delay(500)
	// 				.duration(6000)
	// 				.ease("easePolyOut")
	// 				.tween("year", tweenYear)
	// 				.each("end", enableInteraction);

    //Added below for V4:
    var startingTranstion = svg.transition() //d3.transition()
            .ease(d3.easeLinear)
			.duration(6000)
			//.tween("year", tweenYear)
			//.each("end", enableInteraction);

	// Positions the dots based on data.
	function position(dot) {

			dot.attr("cx", function(d) {
			    //console.log(d )
			    return xScale(x(d));
			    })
				.attr("cy", function(d) { return yScale(y(d)); })
			.attr("r",  7)

	}

	function positionlabel(dot) {
			dot.attr("x", function(d) { return xScale(x(d)); })
						.attr("y", function(d) { return yScale(y(d)); })
						.attr("dx", -5 )
						.attr("dy", 4 );
	}
	

	// After the transition finishes, you can mouseover to change the year.
	// function enableInteraction() {

	// 	var yearScale = d3.scale.linear()
	// 					.domain([2012,2016])
	// 					.range([box.x + 10, box.x + box.width - 10])
	// 					.clamp(true);

	// 		// Cancel the current transition, if any.
	// 		svg.transition().duration(0);

	// 		overlay
	// 						.on("mouseover", mouseover)
	// 						.on("mouseout", mouseout)
	// 						.on("mousemove", mousemove)
	// 						.on("touchmove", mousemove);

	// 		function mouseover() {
	// 				label.classed("active", true);
	// 		}

	// 		function mouseout() {
	// 				label.classed("active", false);
	// 		}

	// 		function mousemove() {
	// 				displayYear(Math.round(yearScale.invert(d3.mouse(this)[0])/10)*10);
	// 		}
	// }


	// On click, update with new data
function nextYear(year) {

	var numValues = d3.selectAll('circle').data().length;
	dataset = d3.json()
    // Get original dataset's length
    // var maxRange = Math.random() * 1000; // Get max range of new values
    // dataset = []; // Initialize empty array
    // for (var i = 0; i < numValues; i++) {
    //     var newNumber1 = Math.random() * 1.0; // Random # for x
	// 	var newNumber2 = Math.random() * 1.0; // Random # for y
		
    //     dataset.push([newNumber1, newNumber2]); // Add new numbers to array */
    // }

    // Update circles
    svg.selectAll("circle")
        .data(dataset) // Update with new data
        .transition()
        .duration(1000)
        .attr("fill", "red") // Change color
        .attr("r", 7) // Change size
        .ease(d3.easeBounce)
        .attr("cx", function(d) {
            return xScale(d.gdp); // Circle's X
        })
        .attr("cy", function(d) {
            return yScale(d.loan_amount/d.loan_count); // Circle's Y
        })
        .on("end", function() {
            d3.select(this)
                .attr("fill", "purple")
                .attr("r", 7);
        });

}
	// Tweens the entire chart by first tweening the year, and then the data.
	// For the interpolated data, the dots and label are redrawn.
	function tweenYear() {
			var year = d3.interpolateNumber(2012,2016);
			return function(t) { displayYear(year(t)); };
	}

	// Updates the display to show the specified year.
	function displayYear(year) {
			dot.data(interpolateData(year), key).call(position);
			dotlabel.data(interpolateData(year), key).call(positionlabel);
			label.text(Math.round(year/10) * 10);
	}

	// Interpolates the dataset for the given (fractional) year.
	function interpolateData(year) {

			loanSummaryData.map(function(d) {
					return {
							gdp: +d.gdp, //interpolateValues(+d.gdp, year),
							country_name: d.country_name,
							gender: d.gender,
							loan_amount: +d.loan_amount,
							loan_count: +d.loan_count,
							loan_avg: (+d.loan_amount / +d.loan_count, year)//interpolateValues(+d.loan_amount / +d.loan_count, year)
					};
			});
	}

	// Finds (and possibly interpolates) the value for the specified year.
	function interpolateValues(values, year) {
			var i = bisect.left(values, year, 0, values.length - 1),
							a = values[i];
			if (i > 0) {
					var b = values[i - 1],
									t = (year - a[0]) / (b[0] - a[0]);
					return a[1] * (1 - t) + b[1] * t;
			}
			return a[1];
	}
});