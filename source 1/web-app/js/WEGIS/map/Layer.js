Ext.define('WEGIS.map.Layer', {
    singleton: true,

    requires: [
        'WEGIS.app.Config'
    ],

    geoserverAddress: null,

    constructor : function(config){
        var me = this;

        me.geoserverAddress = WEGIS.app.Config.geoserverAddress;

        me.initConfig(config);
        me.callParent(arguments);
    },

    //createBlankMap: function(){
    //    var blankMap = new OpenLayers.Layer("空白地圖",
    //        {
    //            type: 'BLANKMAP',
    //            isBaseLayer: true,
    //            numZoomLevels: 14,
    //            displayInLayerSwitcher: false,
    //            alwaysInRange: true
    //        }
    //    );
    //
    //    return blankMap;
    //},
            
    createBufferMarkLayer: function(){
        var default_style = new OpenLayers.Style({
            pointRadius: 7,
            fillColor: "#FF0000",
            fillOpacity: 0.1,
            strokeColor: "#000000",
            strokeOpacity: 0.4,
            strokeWidth: 2,
            label: "${index}",
            fontColor: "#000000",
            fontWeight: "bold",
            fontSize: "12px",
            labelOutlineColor: "white",
            labelOutlineWidth: 2
        });

        var select_style = new OpenLayers.Style({
            fillColor: "#0000FF",
            strokeColor: "#0000FF"
        });

        var style_map = new OpenLayers.StyleMap({
            default: default_style,
            select: select_style
        });

        var layer = new OpenLayers.Layer.Vector("Buffer Analysis Layer", {
            styleMap: style_map,
            //renderers: ['Canvas', 'SVG', 'VML'],
            displayInLayerSwitcher: false
        });
        
        return layer;        
    },
            
    createBufferLayer: function(){
        var style = OpenLayers.Util.applyDefaults({
            fillOpacity: 0.2
        }, OpenLayers.Feature.Vector.style['default']);

        var layer = new OpenLayers.Layer.Vector("Buffer Layer", {
            style: style,
            //renderers: ['Canvas', 'SVG', 'VML'],
            displayInLayerSwitcher: false
        });
        
        return layer;
    },

    createCountyLayer: function(){
        var me = this;
        var layer = new OpenLayers.Layer.WMS(
            '縣市界 <i class="fa fa-eye"></i>', me.geoserverAddress + "/geoserver/npomgis/wms",
            {
                LAYERS: "npomgis:county",
                format: "image/png",
                transparent: true,
                tiled: true
            },
            {
                GEOTYPE: 'polygon',
                toggleTreeNode: true,
                minScale: 2100000,
                qtip: "最小可視比例：2M",
                buffer: 0,
                isBaseLayer: false,
                visibility: false,
                tiled: true,
                maxExtent: new OpenLayers.Bounds(-41955.9138093187, 2422004.77310209, 606875.552098552, 2919551.29675441),
                transitionEffect: 'resize'
            }
        );

        return layer;
    },

    createChoroplethMapsLayer: function(){
        var layer = new OpenLayers.Layer.Vector("ChoroplethMapsLayer", {
            displayInLayerSwitcher: false
        });

        return layer;
    },

    createLocMarkerLayer: function(){
        var locMarkerLayer = new OpenLayers.Layer.Markers("LocMarkerLayer", {
            visibility: true,
            displayInLayerSwitcher: false
        });
        
        return locMarkerLayer;
    },
    
    createLocVectorLayer: function(){
        var style = OpenLayers.Util.applyDefaults({
            fillOpacity: 0.2,
            strokeWidth: 5,
            strokeOpacity: 1
        }, OpenLayers.Feature.Vector.style['default']);
    
        var locVecLayer = new OpenLayers.Layer.Vector("LocVecLayer", {
            style: style,
            visibility: true,
            displayInLayerSwitcher: false
        });
        
        return locVecLayer;
    },

    createOrgVectorLayer: function(){
        var defaultStyle = new OpenLayers.Style({
            graphicWidth: 20,
            graphicHeight: 27,
            graphicXOffset: -10,
            graphicYOffset: -27,
            graphicOpacity: 1,
            graphicZIndex: 10
        });

        var styleMap = new OpenLayers.StyleMap({
            default: defaultStyle
        });

        var lookup = {};
        var nptypes = ['NP100-1', 'NP100-2', 'NP100-3', 'NP200', 'NP300', 'NP400', 'NP500', 'NP600', 'NP700'];
        for(var i = 0 ; i<nptypes.length ; i++){
            var nptype = nptypes[i];
            var nptype_hover = nptype + '_hover';
            lookup[nptype] = {externalGraphic: '../images/WEGIS/OrgIcon/' + nptype +'.png'};
            lookup[nptype_hover] = {
                graphicWidth: 30,
                graphicHeight: 42,
                graphicXOffset: -15,
                graphicYOffset: -42,
                graphicZIndex: 15,
                externalGraphic: '../images/WEGIS/OrgIcon/' + nptype_hover + '.png'
            };
        }

        styleMap.addUniqueValueRules("default", "nptype", lookup);

        var orgVecLayer = new OpenLayers.Layer.Vector("OrgVecLayer", {
            styleMap: styleMap,
            visibility: true,
            displayInLayerSwitcher: false,
            rendererOptions: {zIndexing: true}
        });

        return orgVecLayer;
    },

    createOrgWMSLayer: function(nptype, nptypeName){
        var me = this;
        var layer = new OpenLayers.Layer.WMS(
            nptypeName, me.geoserverAddress + "/geoserver/npomgis/wms",
            {
                LAYERS: "npomgis:npv",
                cql_filter: "nptype ='" + nptype +"'",
                styles: nptype,
                format: "image/png",
                transparent: true,
                tiled: true
            },
            {
                GEOTYPE: 'point',
                ICONCLS: 'layer_' + nptype,
                toggleTreeNode: false,
                buffer: 0,
                isBaseLayer: false,
                visibility: false,
                tiled: true,
                maxExtent: new OpenLayers.Bounds(-41955.9138093187, 2422004.77310209, 606875.552098552, 2919551.29675441),
                transitionEffect: 'resize'
            }
        );

        return layer;
    },
            
    createRoutingLocateLayer: function(){
        var default_style = new OpenLayers.Style({
            graphicWidth: 46,
            graphicHeight: 60,
            graphicXOffset: -22,
            graphicYOffset: -60,
            graphicOpacity: 1
        });

        var originRule = new OpenLayers.Rule({
            filter: new OpenLayers.Filter.Comparison({
                type: OpenLayers.Filter.Comparison.EQUAL_TO,
                property: 'rtype',
                value: 1
            }),
            symbolizer: {
                externalGraphic: "../images/WEGIS/MapIcon/origin.png"
            }
        });

        var destinationRule = new OpenLayers.Rule({
            filter: new OpenLayers.Filter.Comparison({
                type: OpenLayers.Filter.Comparison.EQUAL_TO,
                property: 'rtype',
                value: 2
            }),
            symbolizer: {
                externalGraphic: "../images/WEGIS/MapIcon/destination.png"
            }
        });
        
        var wayRule = new OpenLayers.Rule({
            filter: new OpenLayers.Filter.Comparison({
                type: OpenLayers.Filter.Comparison.EQUAL_TO,
                property: 'rtype',
                value: 3
            }),
            symbolizer: {
                externalGraphic: "../images/WEGIS/MapIcon/way_${index}.png"
            }
        });
        
        var blockRule = new OpenLayers.Rule({
            filter: new OpenLayers.Filter.Comparison({
                type: OpenLayers.Filter.Comparison.EQUAL_TO,
                property: 'rtype',
                value: 4
            }),
            symbolizer: {
                externalGraphic: "../images/WEGIS/MapIcon/block.png"
            }
        });

        default_style.addRules([originRule, destinationRule, wayRule, blockRule]);
        
        var select_style = new OpenLayers.Style({
            graphicWidth: 46,
            graphicHeight: 60,
            graphicXOffset: -22,
            graphicYOffset: -60,
            graphicOpacity: 1
        });
        
        var originSelectedRule = new OpenLayers.Rule({
            filter: new OpenLayers.Filter.Comparison({
                type: OpenLayers.Filter.Comparison.EQUAL_TO,
                property: 'rtype',
                value: 1
            }),
            symbolizer: {
                externalGraphic: "../images/WEGIS/MapIcon/originSelected.png"
            }
        });

        var destinationSelectedRule = new OpenLayers.Rule({
            filter: new OpenLayers.Filter.Comparison({
                type: OpenLayers.Filter.Comparison.EQUAL_TO,
                property: 'rtype',
                value: 2
            }),
            symbolizer: {
                externalGraphic: "../images/WEGIS/MapIcon/destinationSelected.png"
            }
        });
        
        var waySelectedRule = new OpenLayers.Rule({
            filter: new OpenLayers.Filter.Comparison({
                type: OpenLayers.Filter.Comparison.EQUAL_TO,
                property: 'rtype',
                value: 3
            }),
            symbolizer: {
                externalGraphic: "../images/WEGIS/MapIcon/waySelected_${index}.png"
            }
        });
        
        var blockSelectedRule = new OpenLayers.Rule({
            filter: new OpenLayers.Filter.Comparison({
                type: OpenLayers.Filter.Comparison.EQUAL_TO,
                property: 'rtype',
                value: 4
            }),
            symbolizer: {
                externalGraphic: "../images/WEGIS/MapIcon/blockSelected.png"
            }
        });
        
        select_style.addRules([originSelectedRule, destinationSelectedRule, waySelectedRule, blockSelectedRule]);

        var style_map = new OpenLayers.StyleMap({
            default: default_style,
            select: select_style
        });

        // Create a vector layers
        var vector = new OpenLayers.Layer.Vector("路徑規劃標示圖層", {
            styleMap: style_map,
            isBaseLayer: false,
            visibility: true,
            displayInLayerSwitcher: false
        });
        vector.id = "RoutingLocateLayer";

        return vector;
    },

    createTownshipLayer: function(){
        var me = this;
        var layer = new OpenLayers.Layer.WMS(
            '鄉鎮市區界 <i class="fa fa-eye"></i>', me.geoserverAddress + "/geoserver/npomgis/wms",
            {
                LAYERS: "npomgis:township",
                format: "image/png",
                transparent: true,
                tiled: true
            },
            {
                GEOTYPE: 'polygon',
                toggleTreeNode: true,
                minScale: 380000,
                qtip: "最小可視比例：375K",
                buffer: 0,
                isBaseLayer: false,
                visibility: false,
                tiled: true,
                maxExtent: new OpenLayers.Bounds(-41955.9138093187, 2422004.77310209, 606875.552098552, 2919551.29675441),
                transitionEffect: 'resize'
            }
        );

        return layer;
    },

    createVillageLayer: function(){
        var me = this;
        var layer = new OpenLayers.Layer.WMS(
            '村里界 <i class="fa fa-eye"></i>', me.geoserverAddress + "/geoserver/npomgis/wms",
            {
                LAYERS: "npomgis:village",
                format: "image/png",
                transparent: true,
                tiled: true
            },
            {
                GEOTYPE: 'polygon',
                toggleTreeNode: true,
                minScale: 80000,
                qtip: "最小可視比例：75K",
                buffer: 0,
                isBaseLayer: false,
                visibility: false,
                tiled: true,
                maxExtent: new OpenLayers.Bounds(-41955.9138093187, 2422004.77310209, 606875.552098552, 2919551.29675441),
                transitionEffect: 'resize'
            }
        );

        return layer;
    }
});