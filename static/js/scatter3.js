

function x(d) { return +d.gdp; }
function y(d) { return (+d.loan_amount/+d.loan_count);  } ///d.loan_count; }
function color(d) { return d.gender; }
function key(d) { return d.country_name; }
function year(d) { return d.year; }

/* When the user clicks on the button, 
toggle between hiding and showing the dropdown content */
// function myFunction() {
//     document.getElementById("myDropdown").classList.toggle("show");
// }

// Close the dropdown if the user clicks outside of it
window.onclick = function(event) {
    if (!event.target.matches('.dropbtn')) {

        var dropdowns = document.getElementsByClassName("dropdown-content");
        var i;
        for (i = 0; i < dropdowns.length; i++) {
            var openDropdown = dropdowns[i];
            if (openDropdown.classList.contains('show')) {
                openDropdown.classList.remove('show');
            }
        }
    }
}
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
    .defer(d3.json, "/data/scatter/2014/m")
    .defer(d3.json, "/data/scatter/2013/m")
    .defer(d3.json, "/data/scatter/2012/m")
    .defer(d3.json, "/data/scatter/2011/m")
    .defer(d3.json, "/data/scatter/2010/m")
    .defer(d3.json, "/data/scatter/2009/m")
    .defer(d3.json, "/data/scatter/2008/m")
    .defer(d3.json, "/data/scatter/2007/m")
    .defer(d3.json, "/data/scatter/2016/f")
    .defer(d3.json, "/data/scatter/2015/f")
    .defer(d3.json, "/data/scatter/2014/f")
    .defer(d3.json, "/data/scatter/2013/f")
    .defer(d3.json, "/data/scatter/2012/f")
    .defer(d3.json, "/data/scatter/2011/f")
    .defer(d3.json, "/data/scatter/2010/f")
    .defer(d3.json, "/data/scatter/2009/f")
    .defer(d3.json, "/data/scatter/2008/f")
    .defer(d3.json, "/data/scatter/2007/f")
    .await(analyze);
  
function analyze(error, year2016_M, year2015_M, year2014_M, year2013_M, year2012_M, year2011_M, year2010_M, year2009_M, year2008_M, year2007_M, 
                year2016_F, year2015_F, year2014_F, year2013_F, year2012_F, year2011_F, year2010_F, year2009_F, year2008_F, year2007_F) {
    if (error) { 
        console.error(error); 
        throw error
    }

    // Various scales. These domains make assumptions of data, naturally.
    var xScale = d3.scaleLinear().domain([d3.min(year2016_M, d => x(d)) * 0.5,
        d3.max(year2016_M, d => x(d)) * .6
        ]).range([0, width]), //.log().domain([100000, 40000000]).range([0, width]),
    //xScale = d3.scaleLinear().domain([0, 60000]).range([0, width]),
    //yScale = d3.scaleLinear().domain([0, 8500]).range([height, 0])
        yScale = d3.scaleLinear().domain([d3.min(year2016_M,d => (+d.loan_amount/+d.loan_count))* 0.5,d3.max(year2016_M, d => (+d.loan_amount/+d.loan_count))* 0.6]).range([height, 0])
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

    // Add a dot per state. Initialize the data at 2012, and set the colors.
    var dot = svg.append("g")
            .selectAll(".dot")
            .data(year2016_M)
            .enter()
            .append("circle")
            .attr("class", (d) => `dot ${d.gender}`)
            .attr("id", function(d){ return d.country_name; })
            .style("opacity", 0.6)      // set the element opacity
            .style("stroke", "grey")    // set the line color
            .style("fill", "steelblue")
            .call(position);

                        

    // Add a title tooltip.
    addToolTip(dot);

    var menu = document.getElementById("yearDropdown");

    menu.addEventListener("change", getYearData);
    // menu.addEventListener("change", nextYear);




    function getYearData(){
        // const value = menu.value
        const { value = null } = menu
        if (value === "Select Year") return
        const year = value.substring(4, 8);
        const gender = value.substring(9, 10);
        const genderColor = gender ==='M'
            ? "steelblue"
            : '#db8387'
        
        yearLabel.text(year)
        switch(value){
            
            case 'year2016_M': 
                renderData(year2016_M, genderColor, gender)
                 break;
            case 'year2015_M': 
                renderData(year2015_M, genderColor, gender)
                 break;
            case 'year2014_M': 
                renderData(year2014_M, genderColor, gender)
                 break;
            case 'year2013_M': 
                renderData(year2013_M, genderColor, gender)
                 break;
            case 'year2012_M': 
                renderData(year2012_M, genderColor, gender)
                 break;
            case 'year2011_M': 
                renderData(year2011_M, genderColor, gender)
                 break;
            case 'year2010_M': 
                renderData(year2010_M, genderColor, gender)
                 break;
            case 'year2009_M': 
                renderData(year2009_M, genderColor, gender)
                 break;
            case 'year2008_M': 
                renderData(year2008_M, genderColor, gender)
                 break;
            case 'year2007_M': 
                renderData(year2007_M, genderColor, gender)
                 break;
            case 'year2016_F': 
                renderData(year2016_F, genderColor, gender)
                 break;
            case 'year2015_F': 
                renderData(year2015_F, genderColor, gender)
                 break;
            case 'year2014_F': 
                renderData(year2014_F, genderColor, gender)
                 break;
            case 'year2013_F': 
                renderData(year2013_F, genderColor, gender)
                 break;
            case 'year2012_F': 
                renderData(year2012_F, genderColor, gender)
                 break;
            case 'year2011_F': 
                renderData(year2011_F, genderColor, gender)
                 break;
            case 'year2010_F': 
                renderData(year2010_F, genderColor, gender)
                 break;
            case 'year2009_F': 
                renderData(year2009_F, genderColor, gender)
                 break;
            case 'year2008_F': 
                renderData(year2008_F, genderColor, gender)
                 break;
            case 'year2007_F': 
                renderData(year2007_F, genderColor, gender)
                 break;
        }
            // Update circles
  

    }

   
    function renderData(dataSet, color, gender){
        dot = svg.selectAll(".dot")
            .data(dataSet) // Update with new data
            .transition()
            .duration(1000)
            .attr("class", (d) => `dot ${d.gender}`)
            .style("fill", color) // Change color
            .attr("r", 7) // Change size
            .ease(d3.easeBounce)
            .call(position)
            .on("end", function() {
                const genderToRemove = gender.toLowerCase() === "m" ? "f" : "m"
                d3.selectAll(`.${genderToRemove}`).remove()
            });
    }

	// Positions the dots based on data.
	function position(dot) {
        dot.attr("cx", (d) => xScale(x(d)))
			.attr("cy", function(d) { return yScale(y(d)); })
			.attr("r",  7)

	}

	function positionlabel(dot) {
			dot.attr("x", function(d) { return xScale(x(d)); })
						.attr("y", function(d) { return yScale(y(d)); })
						.attr("dx", -5 )
						.attr("dy", 4 );
	}

    function addToolTip(dot){

        // Add a title.
        dot.append("title")
        .text((d) => { 
            return `YEAR: ${d.year || '\u2014'}`
            + `\n Country: ${d.country_name}`
            + `\n loan average: ${+d.loan_amount/+d.loan_count}`
            + `\n GDP: ${d.gdp}`
            + `\n Gender: ${d.gender.toUpperCase()}`
        });
    
    }

    
}
	
