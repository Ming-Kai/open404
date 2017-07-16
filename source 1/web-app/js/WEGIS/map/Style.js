Ext.define('WEGIS.map.Style', {
    singleton: true,

    createStatStyleMap: function(params){
        var me = this;
        var context;
        var rules = [];
        var context = {};
        //var map = WEGIS.map.Map.map;

        var property = params.property;
        var colors = me.createColors(params.level, params.sColor, params.eColor)
        var chartColors = d3.scale.category20();
        var opacity = params.opacity;
        var strokeWidth = params.strokeWidth;
        var symbol = params.symbol;
        var statInfo = params.result.statInfo;
        var statShowType = params.result.statShowType;

        if([1, 4].indexOf(statShowType) !== -1){
            var geo = new Geometry('circle', 15, statInfo.max);

            var count = statInfo.groups.length;
            for(var i=0 ; i < count ; i++){
                var group = statInfo.groups[i];
                var rule = me.createStatRule(statShowType, property, opacity, colors(i+1), group.min, group.max, strokeWidth, symbol);
                rules.push(rule);
            }

            if(statShowType === 4){
                context = {
                    getSymbolSize: function(feature) {
                        return 5 + Math.round(geo.getSize(feature.attributes["count"]));
                        //return 20 + Math.round(geo.getSize(feature.attributes["count"]) * (2 * map.getZoom()));
                    }
                };
            }
        }
        else if([2, 3].indexOf(statShowType) !== -1){
            var items = params.result.items;
            var rule = me.createStatChartRule(statShowType, opacity);
            rules.push(rule);

            if(statShowType === 2){
                context = {
                    getChartURL: function(feature) {
                        //'http://chart.apis.google.com/chart?cht=bvg&chd=t:5,5,5|10,10,10|15,15,15&chs=96x96';
                        var url = 'http://chart.apis.google.com/chart?cht=bvg';
                        var valueURL = '&chd=t:';
                        var colorURL = '&chco=';

                        var items = feature.attributes.items;
                        if(items.length > 0){
                            var size = 32 * items.length;
                            for(var i=0 ; i<items.length ; i++){
                                if(i !== 0) {
                                    valueURL += ',';
                                    colorURL += '|';
                                }

                                valueURL += items[i].count;
                                colorURL += chartColors(i+1).substr(1, 6);
                            }
                        }

                        url += valueURL;
                        url += colorURL;
                        url += '&chs=' + size + 'x' + size;
                        return url;
                    }
                };
            }
            else if(statShowType === 3){
                context = {
                    getChartURL: function(feature) {
                        //'http://chart.apis.google.com/chart?cht=p&chd=t:33.3,59.5,7.2,40.3,22.2&chs=64x64&chf=bg,s,ffffff00';
                        var url = 'http://chart.apis.google.com/chart?cht=p';
                        var valueURL = '&chd=t:';
                        var colorURL = '&chco=';

                        var total = feature.attributes.total;
                        var items = feature.attributes.items;
                        if(items.length > 0){
                            for(var i=0 ; i<items.length ; i++){
                                if(i !== 0) {
                                    valueURL += ',';
                                    colorURL += ',';
                                }

                                valueURL += items[i].count / total;
                                colorURL += chartColors(i+1).substr(1, 6);
                            }
                        }

                        url += valueURL;
                        url += colorURL;
                        url += '&chs=64x64&chf=bg,s,ffffff00';
                        return url;
                    }
                };
            }
        }

        var defaultStyle = new OpenLayers.Style(null, {
            rules: rules,
            context: context
        });

        var selectStyle = new OpenLayers.Style({
            fillColor: "#66ccff",
            strokeColor: "#3399ff",
            graphicZIndex: 2
        });

        var styleMap = new OpenLayers.StyleMap({
            default: defaultStyle,
            select: selectStyle
        });

        function Geometry(symbol, maxSize, maxValue){
            this.symbol = symbol;
            this.maxSize = maxSize;
            this.maxValue = maxValue;

            this.getSize = function(value){
                switch(this.symbol) {
                    case 'circle': // Returns radius of the circle
                    case 'square': // Returns length of a side
                        return Math.sqrt(value/this.maxValue) * this.maxSize;
                    case 'bar': // Returns height of the bar
                        return (value/this.maxValue)*this.maxSize;
                    case 'sphere': // Returns radius of the sphere
                    case 'cube': // Returns length of a side
                        return Math.pow(value/this.maxValue, 1/3) * this.maxSize;
                }
            }
        }

        return styleMap;
    },

    /*
     * private
     */
    createColors: function(level, sColor, eColor){
        var colors = d3.scale
            .linear()
            .domain([1, level])
            .range([sColor, eColor]);

        return colors;
    },

    /*
     * private
     */
    createStatRule: function(statShowType, property, opacity, color, sValue, eValue, strokeWidth, symbol){
        var symbolizer = {
            fillColor: color,
            fillOpacity: opacity,
            strokeColor: "#000000",
            strokeWidth: strokeWidth
            //label: "${count}"
            //label: "${name}\n${count}人",
            //labelOutlineColor: "Black",
            //labelOutlineWidth: 2,
            //fontColor: "#ffffff",
            //fontOpacity: 1,
            //fontSize: "12px",
            //fontWeight: "bold"
        };

        if(statShowType === 4){
            symbolizer.graphicName = symbol;
            symbolizer.pointRadius = '${getSymbolSize}';
        }

        var rule = new OpenLayers.Rule({
            filter: new OpenLayers.Filter.Comparison({
                type: OpenLayers.Filter.Comparison.BETWEEN,
                property: property,
                lowerBoundary: sValue,
                upperBoundary: eValue
            }),
            symbolizer: symbolizer
        });

        //if(type === 1){
        //    rule = new OpenLayers.Rule({
        //        filter: new OpenLayers.Filter.Comparison({
        //            type: OpenLayers.Filter.Comparison.LESS_THAN_OR_EQUAL_TO,
        //            property: property,
        //            value: sValue
        //        }),
        //        symbolizer: symbolizer
        //    });
        //}
        //else if(type === 2){
        //    rule = new OpenLayers.Rule({
        //        filter: new OpenLayers.Filter.Comparison({
        //            type: OpenLayers.Filter.Comparison.BETWEEN,
        //            property: property,
        //            lowerBoundary: sValue,
        //            upperBoundary: eValue
        //        }),
        //        symbolizer: symbolizer
        //    });
        //}
        //else if(type === 3){
        //    rule = new OpenLayers.Rule({
        //        filter: new OpenLayers.Filter.Comparison({
        //            type: OpenLayers.Filter.Comparison.GREATER_THAN_OR_EQUAL_TO,
        //            property: property,
        //            value: sValue
        //        }),
        //        symbolizer: symbolizer
        //    });
        //}

        return rule;
    },

    createStatChartRule: function(statShowType, opacity){
        var symbolizer = {
            fillOpacity: 100,
            externalGraphic: '${chartURL}'
        };

        if(statShowType === 2){
            symbolizer.graphicWidth = 40;
            symbolizer.graphicHeight = 40;
        }
        else if(statShowType === 3){
            symbolizer.graphicWidth = 64;
            symbolizer.graphicHeight = 64;
        }

        var rule = new OpenLayers.Rule({
            symbolizer: symbolizer
        });

        return rule;
    }
});