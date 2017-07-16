var colorBase = 37;
var colorParam = 0.4;
var height = 600;
var data = {};
var topodata2 = {};

var width = $('.bar.column').width();
if (width > 600)
    width = 600;

d3.json("./homepage/data/city.json", function (resTopodata2) {
    d3.csv("./homepage/data/npList.csv", function (resData) {
        data = resData;
        topodata2 = resTopodata2;
        bar(data);
        var red = d3.rgb(249, 168, 37);
        //console.log(red.hsl());

        var features = topojson.feature(topodata2, topodata2.objects["city"]).features;
        // 這裡要注意的是 topodata.objects["county"] 中的 "county" 為原本 shp 的檔名}
        var projection = d3.geo.mercator().center([122, 24]).scale(7000); // 座標變換函式
        var path = d3.geo.path().projection(projection);
        var svg = d3.select('#map');

        svg.attr('width', width)
                .attr('height', width / 600 * 650)
                .attr("viewBox", "0 0 600 650");
        var g = svg.append("g");
        var npList = getSelectedNp();
        var arr = [];
        for (var i = 0; i < npList.length; i++)
            arr.push(npList[i].values);
        var max = d3.max(arr);
        g.selectAll("path").data(features).enter().append("path")
                .attr("class", function (d) {
                    return d.properties.C_Name;
                }).attr("d", path)
                .attr("fill", function (d, i) {
                    var name = d.properties.C_Name;
                    var value = -50;
                    for (var j = 0; j < npList.length; j++)
                    {
                        if (npList[j].key == name) {
                            value = npList[j].values;
                            break;
                        }
                    }
                    var color = 0.9 - value / max * colorParam;
                    return  d3.hsl(colorBase, color, color);
                })
                .classed("city", true)
                .on("mouseover", mouse).on("click", click).append("title")
                .text(function (d) {
                    return d.properties.C_Name;
                });
        function mouse(d) {
            d3.select(this).classed("mouse", true).on("mouseleave", leave);
            var Cname = d.properties.C_Name;
            d3.selectAll("." + Cname).classed("mouse", true);
            function leave() {
                d3.select(this).classed("mouse", false);
                d3.selectAll("." + Cname).classed("mouse", false);
            }
        }
        function click(d) {
            cnpList(d);
            var b = path.bounds(d);
            d3.select(this).on("click", reset).mouse;
        }
        function reset() {
            $("#taiNptype").attr("disabled", false);
            $("#cityName")[0].innerHTML = '';
            taiOnchange();
            $('select').show();
            //	g.transition().duration(750).attr("transform","");
            d3.selectAll("path").classed("click", false).on("click", click);
        }
    });
});


function setScoreLinear(max,type){
    $("#taiScore").empty();
    var scoreLeft;
    if(type=="long"){
        scoreLeft = 110;
    }else{
        scoreLeft = 200;
    }
    var score = d3.select('#taiScore');
    score.attr({
        'width': width,
        'height': '40'
    }).style({
        //'border': '1px dotted #aaa'
    });

    var scaleX = d3.scale.linear()
            .range([0, width-scoreLeft-2])
            .domain([0, max]);

    var axisX = d3.svg.axis()
            .scale(scaleX)
            .orient("bottom")
            .ticks(6)
            .tickFormat(function (d) {
                return d;
            });
    // Axis 
    score.append('g')
            .call(axisX)
            .attr({
                'fill': 'none',
                'stroke': '#000',
                'transform': 'translate('+scoreLeft+',15)'
            }).selectAll('text')
            .attr({
                'fill': '#000',
                'stroke': 'none',
            }).style({
        'font-size': '14px'
    });
}

function bar(data) {
    var npList = getSelectedNp();
    var arr = [];
    for (var i = 0; i < npList.length; i++)
        arr.push(npList[i].values);
    var max = d3.max(arr);
    var Xscale = d3.scale.linear().domain([0, max]).range([0, width - 110]);
    var Yscale = d3.scale.linear().domain([0, 21]).range([0, height]);
    setScoreLinear(max, 'long');
    var svg = d3.select("#bar");
    svg.attr('width', width)
            .attr('height', 650)
            .attr("viewBox", "0 0 " + width + " 600");
    var barg = svg.append("g");

    var bar = barg.selectAll("rect").data(npList);
    var labels = barg.selectAll("text").data(npList);
    bar.enter().append("rect");
    labels.enter().append("text");
    bar.attr("class", function (d) {
        return d.key;
    }).sort(function (a, b) {
        return b.values - a.values;
    })
            .attr("x", 110)
            .attr("y", function (d, i) {
                return Yscale(i);
            })
            .attr("width", function (d) {
                return Xscale(d.values);
            })
            .attr("height", 20)
            .attr("fill", function (d) {
                var color = 0.9 - d.values / max * colorParam;
                return  d3.hsl(colorBase, color, color);
            })
            .on("mouseover", mouse);
    d3.select("#map").select("g").selectAll("rect").sort(function (a, b) {
        return b.values - a.values;
    }).transition();
    labels.attr("class", "labels").sort(function (a, b) {
        return b.values - a.values;
    })
            .attr("x", 0)
            .attr("y", function (d, i) {
                return Yscale(i) + 14;
            })
            .text(function (d) {
                if (d.key == "")
                    return "不詳 " + d.values;
                else
                    return d.key + " " + d.values;
            });
    function mouse(d) {
        d3.select(this).classed("mouse", true).on("mouseleave", leave);
        var Cname = d.key;
        d3.selectAll("." + Cname).classed("mouse", true);
        function leave() {
            d3.select(this).classed("mouse", false);
            d3.selectAll("." + Cname).classed("mouse", false);
        }
    }
}
function taiOnchange() {
    var npList = getSelectedNp();
    var arr = [];
    for (var i = 0; i < npList.length; i++)
        arr.push(npList[i].values);
    var max = d3.max(arr);
    var Xscale = d3.scale.linear().domain([0, max]).range([0, width - 110]);
    var Yscale = d3.scale.linear().domain([0, 21]).range([0, height]);
    var bar = d3.select("#bar").select("g").selectAll("rect").data(npList, function (d) {
        return d.key;
    });
    setScoreLinear(max,'long');
    var labels = d3.select("#bar").select("g").selectAll("text").data(npList);
    var g = d3.select("#map").select("g").selectAll("path");
    bar.exit().remove();
    labels.exit().remove();
    bar.enter().append("rect").on("mouseover", mouse);
    labels.enter().append("text");
    bar.sort(function (a, b) {
        return b.values - a.values;
    })
            .attr("fill", "#fff")
            .attr("width", 0)
            .transition().duration(750).attr("class", function (d) {
        return d.key;
    })
            .attr("x", 110)
            .attr("y", function (d, i) {
                return Yscale(i);
            })
            .attr("width", function (d) {
                return Xscale(d.values);
            })
            .attr("height", 20)
            .attr("fill", function (d) {
                var color = 0.9 - d.values / max * colorParam;
                return  d3.hsl(colorBase, color, color);
            })
    labels.sort(function (a, b) {
        return b.values - a.values;
    }).transition().duration(750).attr("class", "labels")
            .attr("x", 0)
            .attr("y", function (d, i) {
                return Yscale(i) + 14;
            })
            .text(function (d) {
                return d.key + " " + d.values;
            });
    g.transition().duration(750)
            .attr("fill", function (d, i) {
                var name = d.properties.C_Name;
                var value = -100;
                for (var j = 0; j < npList.length; j++)
                {
                    if (npList[j].key == name) {
                        value = npList[j].values;
                        break;
                    }
                }
                var color = 0.9 - value / max * colorParam;
                return  d3.hsl(colorBase, color, color);
            });
    function mouse(d) {
        d3.select(this).classed("mouse", true).on("mouseleave", leave);
        var Cname = d.key;
        d3.selectAll("." + Cname).classed("mouse", true);
        function leave() {
            d3.select(this).classed("mouse", false);
            d3.selectAll("." + Cname).classed("mouse", false);
        }
    }
}
    //縣市為主
function cnpList(d) {
    if(!d.properties){
        return;
    }
    var value = d.properties.C_Name;
    $("#taiNptype").attr("disabled", true);
    $("#cityName")[0].innerHTML = value;
    $('select').hide();
    var allnpList = d3.nest()
            .key(function (d) {
                return d.縣市.substring(0, 3);
            })
            .key(function (d) {
                return d.團體類別;
            })
            .rollup(function (d) {
                return d.length;
            })
            .entries(data);
    var rank = d3.nest()
            .key(function (d) {
                return d.團體類別;
            })
            .key(function (d) {
                return d.縣市.substring(0, 3);
            })
            .rollup(function (d) {
                return d.length;
            })
            .entries(data);
    var npList;
    $.each(allnpList, function (key, row) {
        if (value == row.key) {
            npList = row.values;
        }
    });
    var arr = [];
    for (var i = 0; i < npList.length; i++)
        arr.push(npList[i].values);
    var max = d3.max(arr);
    var Xscale = d3.scale.linear().domain([0, max]).range([0, width - 200]);
    var Yscale = d3.scale.linear().domain([0, 21]).range([0, height]);
    var bar = d3.select("#bar").select("g").selectAll("rect").data(npList);
    setScoreLinear(max,'short');
    var labels = d3.select("#bar").select("g").selectAll("text").data(npList);
    bar.exit().remove();
    labels.exit().remove();
    bar.enter().append("rect");
    labels.enter().append("text");
    bar.sort(function (a, b) {
        return b.values - a.values;
    })
            .attr("fill", "#fff")
            .transition().duration(750).attr("class", function (d) {
        return d.key;
    })
            .attr("x", 200)
            .attr("y", function (d, i) {
                return Yscale(i);
            })
            .attr("width", function (d) {
                return Xscale(d.values);
            })
            .attr("height", 20)
            .attr("fill", function (d) {
                var color = 0.9 - d.values / max * colorParam;
                return  d3.hsl(colorBase, color, color);
            })
    labels.sort(function (a, b) {
        return b.values - a.values;
    }).transition().duration(750).attr("class", "labels")
            .attr("x", 0)
            .attr("y", function (d, i) {
                return Yscale(i) + 14;
            })
            .text(function (d) {
                var rankarr = [];
                for (i = 0; i < rank.length; i++) {
                    if (rank[i].key == d.key)
                        break;
                }
                for (var j = 0; j < rank[i].values.length; j++) {
                    rankarr.push(rank[i].values[j].values);
                }
                rankarr.sort(function (a, b) {
                    return b - a;
                });
                var num = rankarr.indexOf(d.values);
                return d.key + "\t\t" + d.values + "(NO." + (num + 1) + ")";
            });

}
function getSelectedNp() {
    var nplist = [];
    var nptype = $("#taiNptype").val();
    var allNplsit = d3.nest()
            .key(function (d) {
                return d.團體類別;
            })
            .key(function (d) {
                return d.縣市.substring(0, 3);
            })
            .rollup(function (d) {
                return d.length;
            })
            .entries(data);
    $.each(allNplsit, function (key, row) {
        if (row.key == nptype) {
            nplist = row.values
        }
    });
    return nplist;
}