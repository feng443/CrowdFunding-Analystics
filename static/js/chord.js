/*

TODO: Fix tooltip position (Still hard-coded)
TODO: Add pecentage
TODO: Deploy to heroku (optional)


Future TODO:
Add Percentage
Make responsive
Add animation or play by each year

Reference:

D3V4: http://projects.delimited.io/experiments/chord-diagrams/uber.html
Transition:
1) https://stackoverflow.com/questions/21813723/change-and-transition-dataset-in-chord-diagram-with-d3
2) https://gist.github.com/databayou/c7ac49a23c275f0dd7548669595b8017

*/
var initYear = 2016
var currentYear = initYear
var currentLoanOrLender = 'lender'
var yearURL = 'data/year'
var regionURL = 'data/region'
var dataURL = 'data/chord/'

var colors = d3.scaleOrdinal(d3.schemeSet1)
var years
var regions
var last_layout
var chordTotal // Use to compute percentage on the fly

var arc
var ribbon
var svg

var w = 980,
    h = 800,
    r1 = h / 2,
    r0 = r1 - 110;

//d3.json(dataURL, function(error, data) {
if (years === undefined) {
    d3.json(yearURL, function(error, data) {
        years = data

        d3.select('#year-selector')
            .on('change', function(d) {
                currentYear = d3.select('#year-list').node().value
                refreshChords()
            })
            .append('select')
            .attr("id", "year-list")
            .selectAll()
            .data(data)
            .enter()
            .append('option')
            //.attr('type', 'radio')
            .text(d => d)
            .attr('value', d => d)
            .property('selected', d => {
                return d == initYear;
            })

    })
}

if (regions == undefined) {
    d3.json(regionURL, function(error, data) {
        regions = data

    //set up legend
    d3.select('#legend').select('ul')
        .selectAll('li')
        .data(regions)
        .enter()
        .append('li')
        .html( (d, i) => {
            color = colors(i)
            return  '<li><span style="background-color: ' + color + '">&nbsp;&nbsp;&nbsp;&nbsp;</span> ' + d + '</li>'
        })
        //.style('color', (d, i) => invertColor(colors(i)))
        //.style('background-color', (d, i) => colors(i))
    })
}

initChords()
refreshChords()
//refreshChords() // TODO: Fix this hack

function refreshChords() {
    d3.json(dataURL + currentYear, function(error, data) {
        mpr = chordMpr(data);

        d3.select('#subtitle').text(currentLoanOrLender + ' counts (' + currentYear + ')' )

        mpr
            .addValuesToMap('lender_region')
            .addValuesToMap('loan_region')
            .setFilter(function(row, a, b) {
                if (currentLoanOrLender === 'lender') {
                    return (row.lender_region === a.name && row.loan_region === b.name)
                } else {
                    return (row.lender_region === b.name && row.loan_region === a.name)
                }
            })
            .setAccessor(function(recs, a, b) {
                if (!recs[0]) return 0;
                return +recs[0].count;
            });
        drawChords(mpr);
    });
}

function initChords() {
    chord = d3.chord()
        .padAngle(0.05)
        .sortSubgroups(d3.descending)
        .sortChords(d3.descending);

    arc = d3.arc()
        .innerRadius(r0)
        .outerRadius(r0 + 20);

    ribbon = d3.ribbon().radius(r0);

    svg = d3.select("#chord").append("svg:svg")
        .attr("width", w)
        .attr("height", h)
        .append("svg:g")
        .attr("id", "circle")
        .attr("transform", "translate(" + w / 2 + "," + h / 2 + ")")

    svg.append("circle").attr("r", r0 + 20);

}

//function drawChords(matrix, mmap) {
function drawChords(mpr) {
    matrix = mpr.getMatrix()
    mmap = mpr.getMap();

    layout = chord(matrix)
    svg.datum(layout)

    var mapReader = chordRdr(matrix, mmap);

    var groupG = svg.selectAll("g.group")
        .data( chord(matrix).groups, d => d.index
            /* function(chords) { return chords.groups; }*/ )

    newGroups = groupG.enter().append("svg:g")
        .attr("class", "group")
        .on('mouseover', mouseoverGroup)
        .on("mouseout", mouseoutGroup)

    // This condition handle initial loading
    if (last_layout === undefined ) {
        groupG = newGroups
    } else {
        groupG.exit().transition()
        .duration(1500)
        .attr('opacity', 0)
        .remove(); // remove after transition are complete
     }

    newGroups.append("svg:path")
        .attr('id', d => { return 'group' + d.index })
        .style("stroke", "grey")
        .style("fill", d => { return colors(d.index) })

    groupG.select("path")
            .transition()
            .duration(1500)
            .attrTween("d", arcTween(last_layout))

    //last_layout = layout; return;
    newGroups.append("svg:text")
        .each( d => { d.angle = (d.startAngle + d.endAngle) / 2; })
        .attr("dy", ".35em")
        .text( d => mapReader(d).gname )
        .style("font-family", "helvetica, arial, sans-serif")
        .style("font-size", "9px")

    groupG.select('text')
        .transition()
        .duration(1500)
        .attr("text-anchor", function(d) {
            return (d.startAngle + d.endAngle) > Math.PI * 2 ? "end" : null;
        })
        .attr("transform", transformText)

    function transformText(d) {
        d.angle = (d.startAngle + d.endAngle) / 2;
        return "rotate(" + (d.angle * 180 / Math.PI - 90) + ")" +
            "translate(" + (r0 + 26) + ")" +
            (d.angle > Math.PI ? "rotate(180)" : "");
    }

    //return
    var chordPaths = svg.selectAll("path.chord")
        .data(
            layout, chordKey
            /*
                function(chords) {
                    return chords;
            }*/
        )

    var newChords = chordPaths.enter()
        .append("svg:path")
        .attr("class", "chord")

    // Handle initial loading
    if (last_layout === undefined ) {
         chordPaths = newChords
    } else {
    chordPaths.exit().transition()
        .duration(1500)
        //.attr('opacity', 0)
        .remove()
    }
    chordPaths.transition()
        .duration(1500)
        //.attr('opacity', 0.5)
        .style("stroke", "grey")
        .style("fill", function(d, i) {
            return colors(d.source.index)
        })
        //.attr("d", ribbon.radius(r0))
        .attrTween('d', chordTween(last_layout))

    newChords
        .on("mouseover", mouseoverChord)
        .on("mouseout", hideTooltip)

    last_layout = layout

    // Helper functions
    function hideTooltip(d) {
        d3.select("#tooltip").style("visibility", "hidden")
    }

    function mouseoverChord(d, i, j) {
        d3.select("#tooltip")
            .style("visibility", "visible")
            .html(chordTip(mapReader(d)))
            .style("top", function() {
                return (d3.event.pageY - 100) + "px"
            })
            .style("left", function() {
                return (d3.event.pageX - 450) + "px";
            })
    }

    function chordTip(d) {
        var p = d3.format(",d"),
            q = d3.format(",.2r")
        return "Lender -> Borrower:<br/>" +
            d.sname + " → " + d.tname +
            ": " + p(d.svalue) + "<br/>" +
            d.tname + " → " + d.sname +
            ": " + p(d.tvalue) + "<br/>";
    }

    function groupTip(d) {
        var p = d3.format(",d"),
            q = d3.format(",.2r")
        return "Region Info:<br/>" +
            d.gname + " : " + p(d.gvalue) + "<br/>";
    }

    function mouseoverGroup(d, i) {
        d3.select("#tooltip")
            .style("visibility", "visible")
            .html(groupTip(mapReader(d)))
            .style("top", function() {
                return (d3.event.pageY - 80) + "px"
            })
            .style("left", function() {
                return (d3.event.pageX - 450) + "px";
            })

        newChords.classed("fade", function(p) {
            return p.source.index != i &&
                p.target.index != i;
        });
    }

    function mouseoutGroup(d, i) {
        hideTooltip()
        newChords.classed("fade", false)
    }
}

// Autoplay
function playYears() {
    currentYear = Math.min(...years) - 1
    var timer = setInterval( function() {
        if (currentYear === Math.max(...years)) {
            clearInterval(timer)
        } else {
            currentYear = currentYear + 1
        }
        refreshChords()
    }, 2000 )
}

function showSelfOnly() {
    chords =  svg.selectAll("path.chord")
    chords.classed('fade', p => p.source.index != p.target.index )
}

function showAll() {
    chords =  svg.selectAll("path.chord")
    chords.classed('fade', false)
}



function chordKey(data) {
    return (data.source.index < data.target.index) ?
        data.source.index + "-" + data.target.index :
        data.target.index + "-" + data.source.index;

    //create a key that will represent the relationship
    //between these two groups *regardless*
    //of which group is called 'source' and which 'target'
}

function chordTween(oldLayout) {
    //this function will be called once per update cycle

    //Create a key:value version of the old layout's chords array
    //so we can easily find the matching chord
    //(which may not have a matching index)

    var oldChords = {};
    if (oldLayout) {
        oldLayout.forEach(function(chordData) {
            oldChords[chordKey(chordData)] = chordData;
        });
    }

    return function(d, i) {
        //this function will be called for each active chord

        var tween;
        var old = oldChords[chordKey(d)];
        if (old) {
            //old is not undefined, i.e.
            //there is a matching old chord value

            //check whether source and target have been switched:
            if (d.source.index != old.source.index) {
                //swap source and target to match the new data
                old = {
                    source: old.target,
                    target: old.source
                };
            }

            tween = d3.interpolate(old, d);
        } else {
            //create a zero-width chord object
            ///////////////////////////////////////////////////////////in the copy ////////////////
            if (oldLayout) {
                var oldGroups = oldLayout.groups.filter(function(group) {
                    return ((group.index == d.source.index) ||
                        (group.index == d.target.index))
                });
                old = {
                    source: oldGroups[0],
                    target: oldGroups[1] || oldGroups[0]
                };
                //the OR in target is in case source and target are equal
                //in the data, in which case only one group will pass the
                //filter function

                if (d.source.index != old.source.index) {
                    //swap source and target to match the new data
                    old = {
                        source: old.target,
                        target: old.source
                    };
                }
            } else old = d;
            /////////////////////////////////////////////////////////////////
            var emptyChord = {
                source: {
                    startAngle: old.source.startAngle,
                    endAngle: old.source.startAngle
                },
                target: {
                    startAngle: old.target.startAngle,
                    endAngle: old.target.startAngle
                }
            };
            tween = d3.interpolate(emptyChord, d);
        }

        return function(t) {
            //this function calculates the intermediary shapes
            return ribbon(tween(t));
        };
    };
}

function arcTween(oldLayout) {
    //this function will be called once per update cycle

    //Create a key:value version of the old layout's groups array
    //so we can easily find the matching group
    //even if the group index values don't match the array index
    //(because of sorting)
    var oldGroups = {};
    if (oldLayout) {
        oldLayout.forEach(function(groupData) {
            oldGroups[groupData.index] = groupData;
        });
    }

    return function(d, i) {
        var tween;
        var old = oldGroups[d.index];
        if (old) { //there's a matching old group
            tween = d3.interpolate(old, d);
        } else {
            //create a zero-width arc object
            var emptyArc = {
                startAngle: d.startAngle,
                endAngle: d.startAngle
            };
            tween = d3.interpolate(emptyArc, d);
        }

        return function(t) {
            return arc(tween(t));
        };
    };
}

  function invertColor(hexTripletColor) {
        var color = hexTripletColor;
        color = color.substring(1); // remove #
        color = parseInt(color, 16); // convert to integer
        color = 0xFFFFFF ^ color; // invert three bytes
        color = color.toString(16); // convert to hex
        color = ("000000" + color).slice(-6); // pad with leading zeros
        color = "#" + color; // prepend #
        return color;
    }