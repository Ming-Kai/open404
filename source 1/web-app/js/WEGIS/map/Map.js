Ext.define('WEGIS.map.Map', {
    extend: 'Ext.util.Observable',
    
    requires: [
        'WEGIS.map.Google',
        'WEGIS.map.Icon',
        'WEGIS.map.Layer',
        'WEGIS.map.Projection',
        'WEGIS.map.Style',
        'WEGIS.map.Tgos'
    ],

    singleton: true,
    
    map: null,
    projections: null,
    google: null,
    tgos: null,
    icons: null,
    layer: null,
    
    baseLayers: [],
    overlayLayers: [],
    orgLayers: [],

    locVecLayer: null,
    markerLayer: null,
    routingLocLayer: null,
    bufferMarkLayer: null,
    bufferLayer: null,
    orgVecLayer: null,

    locMarker: null,
    orgMarkers: [],
    
    chiayiMaxExtent: new OpenLayers.Bounds(187613.455807, 2593069.975622, 199880.460107, 2601790.478022),
    geolocateCtrl: null,
    currentPopup: null,

    geolocateCntcode: null,

    popupType: {
        ALL: 0,
        LOCATE: 1,
        SOCQUERY: 2,
        ORGQUERY: 3,
        PEOPLESTAT: 4,
        SOCSTAT: 5
    },

    jstsFunc: {
        UNION: 1,
        INTERSECTION: 2,
        SYMDIFFERENCE: 3
    },
    
    config: {
        routingFeature: {
            origin: null,
            destination: null,
            ways: []
            //blocks: []
        },
        windowX: 45,
        windowY: 120
    },
    
    constructor : function(config){
        var me = this;
        
        me.addEvents('overlayLayerChanged');
        
        me.projections = WEGIS.map.Projection;
        me.google = WEGIS.map.Google;
        me.tgos = WEGIS.map.Tgos;
        me.icons = WEGIS.map.Icon;
        me.layer = WEGIS.map.Layer;
        
        OpenLayers.INCHES_PER_UNIT['公里'] = OpenLayers.INCHES_PER_UNIT['km'];  
        OpenLayers.INCHES_PER_UNIT['公尺'] = OpenLayers.INCHES_PER_UNIT['m'];  
        OpenLayers.INCHES_PER_UNIT['英里'] = OpenLayers.INCHES_PER_UNIT['mi'];  
        OpenLayers.INCHES_PER_UNIT['英尺'] = OpenLayers.INCHES_PER_UNIT['ft'];
        
        // Geolocate control
        me.geolocateCtrl = me.createGeolocateControl();
        
        // Map controls
        var mapControls = [
            new OpenLayers.Control.Navigation({
                mouseWheelOptions: {interval: 100}
            }),
            new OpenLayers.Control.PanZoomBar({zoomWorldIcon: false}),
            new OpenLayers.Control.ScaleLine({
                maxWidth: 150,
                topOutUnits: "公里",
                topInUnits: "公尺",
                bottomOutUnits: "英里",
                bottomInUnits: "英尺" 
            }),
            new OpenLayers.Control.LTOverviewMap({
                autoPan: true,
                maximized: false,
                size: new OpenLayers.Size(250,200)
            }),
            new OpenLayers.Control.LoadingPanel(),
            me.geolocateCtrl
        ];
        
        // Map options
        //OpenLayers.ProxyHost = "proxy?url=";
        //OpenLayers.DOTS_PER_INCH = 25.4 / 0.28;
        var options = {
            fallThrough: true,
            allOverlays: false,
            controls: mapControls,
            projection: me.projections.TWD97,
            displayProjection: me.projections.WGS84,            
            maxExtent: new OpenLayers.Bounds(-65000, 2397000, 641000, 2946000),
            units: "m"
        };

        // 宣告地圖
        me.map = new OpenLayers.Map('map', options);

        // locate
        me.locVecLayer = me.layer.createLocVectorLayer();        
        me.markerLayer = me.layer.createLocMarkerLayer();
        
        // routing
        me.routingLocLayer = me.layer.createRoutingLocateLayer();
        
        // buffer
        me.bufferMarkLayer = me.layer.createBufferMarkLayer();
        me.bufferLayer = me.layer.createBufferLayer();

        // org vector
        me.orgVecLayer = me.layer.createOrgVectorLayer();

        // 縣市界
        var countyLayer = me.layer.createCountyLayer();

        // 鄉鎮市區界
        var townshipLayer = me.layer.createTownshipLayer();

        // 村里界
        var villageLayer = me.layer.createVillageLayer();

        // 主題圖層
        if(me.tgos.isDefined()) me.baseLayers = me.baseLayers.concat(me.tgos.baseLayers);
        me.overlayLayers.push(countyLayer, townshipLayer, villageLayer);

        // 機構圖層
        for(var i=0 ; i<WEGIS.app.Config.orgTypes.data.length ; i++){
            var orgType = WEGIS.app.Config.orgTypes.data[i];
            var orgLayer = me.layer.createOrgWMSLayer(orgType.value, orgType.text);
            me.orgLayers.push(orgLayer);
        }

        // 加入底圖
        if(me.tgos.isDefined()) me.map.addLayers(me.tgos.baseLayers);
        me.map.setBaseLayer(me.baseLayers[0]);
        
        // 加入定位圖層，Marker layer需再最上層，不然click事件會失效
        me.map.addLayers([me.locVecLayer, me.bufferLayer, me.orgVecLayer, me.bufferMarkLayer, me.routingLocLayer, me.markerLayer]);

        // 取得目前使用者的所在縣市
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function(position) {
                var lonLat = new OpenLayers.LonLat(position.coords.longitude, position.coords.latitude).transform(me.projections.WGS84, me.projections.TWD97);

                me.tgos.nearestAddress(lonLat.lon, lonLat.lat);

            }, function() {
                //handleLocationError(true, infoWindow, map.getCenter());
            });
        }

        me.initConfig(config);
        me.callParent(arguments);
    },
    addBufferPoint: function(x, y){
        var me = this;
               
        var feature =  new OpenLayers.Feature.Vector(new OpenLayers.Geometry.Point(x, y));
        me.bufferMarkLayer.addFeatures(feature);
    },
    addChoroplethPeopleFeature: function(feature){
        var me = this;

        me.choroplethPeopleMapsLayer.addFeatures(feature);
    },
    addChoroplethSocFeature: function(feature){
        var me = this;

        me.choroplethSocMapsLayer.addFeatures(feature);
    },
    addLayer: function(layer, index){
        var me = this;
        index = (typeof index !== 'undefined') ? index : -1;      
        
        me.map.addLayer(layer);
        
        if(index !== -1){
            me.map.setLayerIndex(layer, index);
        }
    },
    addLocFeature: function(feature){
        var me = this;
        
        // 行政區定位標示
        me.locVecLayer.addFeatures(feature);
    },
    addLocMarker: function(x, y, info){
        var me = this;
        
        // 標示定位marker
        var icon = me.icons.location.clone();
        var marker = new OpenLayers.Marker(new OpenLayers.LonLat(x, y), icon);
        me.locMarker = marker;
        
        function onMarkerClick (evt) {
            me.addLocPopup(x, y, info);
            OpenLayers.Event.stop(evt);
        }     

        marker.events.register("click", marker, onMarkerClick);
        me.markerLayer.addMarker(marker);
        
        // 顯示popup
        me.addLocPopup(x, y, info);
    },
    addControl: function(ctrl){
        var me = this;

        if(!me.map.getControl(ctrl.id)){
            me.map.addControl(ctrl);
        }
    },
    addOrgMarker: function(x, y, iconType, info){
        var me = this;

        // 標示定位marker
        var icon = me.icons.getOrgIcon(iconType);
        var marker = new OpenLayers.Marker(new OpenLayers.LonLat(x, y), icon);

        function onMarkerClick (evt) {
            me.addOrgPopup(x, y, info);
            OpenLayers.Event.stop(evt);
        }

        marker.events.register("click", marker, onMarkerClick);
        me.markerLayer.addMarker(marker);

        me.orgMarkers.push(marker);
    },
    addPopup : function(x, y, info, type){
        var me = this;

        // 1.移除目前的popup        
        me.removePopup();

        var popup = new OpenLayers.Popup.FramedCloud("popup",
            new OpenLayers.LonLat(x, y),
            null,
            info,
            null,
            true
        );
        popup.type = type;

        // 3.將popup顯示在地圖上    
        me.map.addPopup(popup);
        me.currentPopup = popup;
    },
    addLocPopup: function(x, y, info){
        var me = this;
        me.addPopup(x, y, info, me.popupType.LOCATE);
    },
    addOrgPopup: function(x, y, info){
        var me = this;
        me.addPopup(x, y, info, me.popupType.ORGQUERY);
    },
    addPeopleStatPopup: function(x, y, info){
        var me = this;
        me.addPopup(x, y, info, me.popupType.PEOPLESTAT);
    },
    addSocStatPopup: function(x, y, info){
        var me = this;
        me.addPopup(x, y, info, me.popupType.SOCSTAT);
    },
    addRoutingPoint: function(x, y, rtype){
        var me = this;
               
        var feature =  new OpenLayers.Feature.Vector(new OpenLayers.Geometry.Point(x, y),{
            rtype: rtype
        });
        
        switch(rtype){
            case 1:
                me.setRoutingOriginFeature(feature);
                break;
            case 2:
                me.setRoutingDestinationFeature(feature);
                break;
            case 3:
                me.addRoutingWayFeature(feature);
                break;
            //case 4:
            //    me.addRoutingBlockFeature(feature);
            //    break;
        }
    },
    addRoutingBlockFeature: function(feature){
        var me = this;
        
        me.routingFeature.blocks.push(feature);
        me.routingLocLayer.addFeatures([feature]);
    },
    addRoutingWayFeature: function(feature){
        var me = this;

        if(me.routingFeature.ways.length < 8){
            me.routingFeature.ways.push(feature);
            me.routingLocLayer.addFeatures([feature]);
        }
        else{
            Ext.MessageBox.show({
                title: '路徑規劃',
                msg: '必經點數量上限為8個！',
                buttons: Ext.MessageBox.OK,
                icon: Ext.MessageBox.WARNING
            });
        }

    }, 
    clearBuffer: function(){
        var me = this;
        
        me.bufferLayer.removeAllFeatures();
    },
    clearBufferMark: function(){
        var me = this;

        me.bufferMarkLayer.removeAllFeatures();
    },
    createGeolocateControl: function(){
        var me = this;

        var geolocateCtrl = new OpenLayers.Control.Geolocate({
            bind: false,
            geolocationOptions: {
                enableHighAccuracy: false,
                maximumAge: 0,
                timeout: 7000
            }
        });
        
        geolocateCtrl.events.register("locationupdated", me.geolocateCtrl, function(e) {
            var info = 'X座標：' + e.point.x.toFixed(3) + '<br/>' + 'Y座標：' + e.point.y.toFixed(3);
                    
            me.removeLocMark();            
            me.addLocMarker(e.point.x, e.point.y, info);      
            me.setCenter(e.point.x, e.point.y, 11);            
        });
        
        geolocateCtrl.events.register("locationfailed", this, function() {
            Ext.example.msg('地理位置定位', '<span style="color:red"><i class="fa fa-exclamation-triangle fa-lg"></i> 地理位置定位失敗！</span>');
        });
        
        return geolocateCtrl;
    },
    createPopupLocToolbar: function(x, y){
        var html = '';
        html += '<div>' +
                    Ext.String.format('<button class="blue ui icon button" onclick="WEGIS.map.Map.addRoutingPoint({0}, {1}, 1);">起</button>', x, y) +
                    Ext.String.format('<button class="pink ui icon button" onclick="WEGIS.map.Map.addRoutingPoint({0}, {1}, 3);">經</button>', x, y) +
                    Ext.String.format('<button class="green ui icon button" onclick="WEGIS.map.Map.addRoutingPoint({0}, {1}, 2);">終</button>', x, y) +
                    Ext.String.format('<button class="orange ui icon button" onclick="WEGIS.map.Map.addBufferPoint({0}, {1});">環</button>', x, y) +
                '</div>';
        return html;
    },
    deleteAllRoutingFeature: function(){
        var me = this;
        
        //me.deleteRoutingBlockFeatures();
        me.deleteRoutingDestinationFeature();
        me.deleteRoutingOriginFeature();
        me.deleteRoutingWayFeatures();
    },
    //deleteRoutingBlockFeatures: function(){
    //    var me = this;
    //
    //    if(me.routingFeature.blocks.length > 0){
    //        me.routingLocLayer.destroyFeatures(me.routingFeature.blocks);
    //        me.routingFeature.blocks = [];
    //    }
    //},
    deleteRoutingDestinationFeature: function(){
        var me = this;
        
        if(me.routingFeature.destination){
            var feature = me.routingFeature.destination;
            me.routingFeature.destination= null;
            me.routingLocLayer.destroyFeatures(feature);
        }
    },
    deleteRoutingOriginFeature: function(){
        var me = this;
        
        if(me.routingFeature.origin){
            var feature = me.routingFeature.origin;
            me.routingFeature.origin = null;
            me.routingLocLayer.destroyFeatures(feature);

        }
    },
    deleteRoutingWayFeatures: function(){
        var me = this;
        
        if(me.routingFeature.ways.length > 0){
            var ways = me.routingFeature.ways;
            me.routingFeature.ways = [];
            me.routingLocLayer.destroyFeatures(ways);
        }
    },
    deleteRoutingWayFeaturesByIndex: function(index){
        var me = this;

        index = index - 1;
        var count = me.routingFeature.ways.length;
        if(count > 0 && count > index){
            var feature = me.routingFeature.ways[index];
            me.routingFeature.ways.splice(index, 1);
            me.routingLocLayer.destroyFeatures(feature);
        }
    },
    deleteSelectedRoutingFeature: function(){
        var me = this;
        
        var count = me.routingLocLayer.selectedFeatures.length;
        if(count > 0){
            for(var i=count-1 ; i>=0 ; i-- ){
                var feature = me.routingLocLayer.selectedFeatures[i];
                var rtype = feature.attributes.rtype;
                
                switch(rtype){
                    case 1:
                        me.routingFeature.origin = null;
                        break;
                    case 2:
                        me.routingFeature.destination= null;
                        break;
                    case 3:
                        var index = me.routingFeature.ways.indexOf(feature);
                        if (index > -1) {
                            me.routingFeature.ways.splice(index, 1);
                        }
                        break;
                    //case 4:
                    //    var index = me.routingFeature.blocks.indexOf(feature);
                    //    if (index > -1) {
                    //        me.routingFeature.blocks.splice(index, 1);
                    //    }
                    //    break;
                }
            }
            
            me.routingLocLayer.destroyFeatures(me.routingLocLayer.selectedFeatures);
        }
    },
//    drawBuffer: function(geometry, distance){
//        var me = this;
//
//        // JSTS
//        var parser = new jsts.io.OpenLayersParser();
//        var input = parser.read(geometry);
//
//        // Buffer
//        var buffer = input.buffer(distance);
//        buffer = parser.write(buffer);
//
//        // Create buffer vector
//        var feature = new OpenLayers.Feature.Vector(buffer);
//        me.bufferLayer.addFeatures(feature);
//    },
    drawBuffer: function(geoms, distance, jstsFunc){
        var me = this;

        if(geoms.length > 0){
            var parser = new jsts.io.OpenLayersParser();
            var gc = parser.read(geoms[0]).buffer(distance);
            for(var i=1; i< geoms.length ; i++){
                var g = parser.read(geoms[i]);

                if(jstsFunc === me.jstsFunc.UNION)
                    gc = gc.union(g.buffer(distance));
                else if(jstsFunc === me.jstsFunc.INTERSECTION)
                    gc = gc.intersection(g.buffer(distance));
                else if(jstsFunc === me.jstsFunc.SYMDIFFERENCE)
                    gc = gc.symDifference(g.buffer(distance));
                else
                    gc = gc.union(g.buffer(distance));
            }

            // Buffer
            var buffer = parser.write(gc);

            // Create buffer vector
            var feature = new OpenLayers.Feature.Vector(buffer);
            me.bufferLayer.addFeatures(feature);
        }
    },
    getBufferMark: function(){
        var me = this;
        
        // 取得環域圖徵
        var geoms = [];
        for(var i=0; i< me.bufferMarkLayer.features.length ; i++){
            geoms.push(me.bufferMarkLayer.features[i].geometry);
        }
        
        return geoms;
    },
    getWKTBuffer: function(){
        var me = this;

        // 取得環域圖徵
        var geoms = [];
        var wktParser = new OpenLayers.Format.WKT();
        for(var i=0; i< me.bufferLayer.features.length ; i++){
            geoms.push(wktParser.write(me.bufferLayer.features[i]));
        }

        return geoms;
    },
    // 地理位置定位
    geolocate: function(){
        var me = this;
        me.geolocateCtrl.deactivate();
        me.geolocateCtrl.activate();
    },
    // 取得地圖目前的中心點座標
    getCenter: function(){
        var me = this;
        return me.map.getCenter();
    },
    // 取得地圖目前的extent
    getExtent: function(){
        var me = this;
        return me.map.getExtent();
    },
    // 根據圖層ID取得圖層
    getLayerByID: function(layerID){
        var me = this;
        return me.map.getLayer(layerID);
    },
    // 取得地圖目前的zoom level
    getZoomLevel: function(){
        var me = this;
        return me.map.getZoom();
    },
    hasBufferMark: function(){
        var me = this;

        return me.bufferMarkLayer.features.length > 0;
    },
    keepAlive: function(){
        Ext.Ajax.request({
            url: 'keepAlive',
            method: "POST",
            success: function (response, options) {
                console.log('o');
            },
            failure: function (response, options) {
                console.log('x');
            },
            callback: function (options, success, response) {
            }
        });
    },
    removeChoroplethPeopleFeature: function(){
        var me = this;

        me.removePopup(me.popupType.PEOPLESTAT);
        if(me.choroplethPeopleMapsLayer.features.length > 0){
            me.choroplethPeopleMapsLayer.removeAllFeatures();
        }
    },
    removeChoroplethSocFeature: function(){
        var me = this;

        me.removePopup(me.popupType.SOCSTAT);
        if(me.choroplethSocMapsLayer.features.length > 0){
            me.choroplethSocMapsLayer.removeAllFeatures();
        }
    },
    removeLayer: function(layer){
        var me = this;
        return me.map.removeLayer(layer);
    },
    //removeLayerMarkers: function(markerLayer){
    //    var i = markerLayer.markers.length - 1;
    //    for(; i >= 0 ; i--){
    //        var marker = markerLayer.markers[i];
    //        markerLayer.removeMarker(marker);
    //        marker.destroy();
    //    }
    //},
    removeLocFeature: function(){
        var me = this;
        
        if(me.locVecLayer.features.length > 0){
            me.locVecLayer.removeAllFeatures();
        }
    },
    removeLocMark: function(){
        var me = this;
        
        me.removePopup(me.popupType.LOCATE);

        // 移除marker
        if(me.locMarker){
            me.markerLayer.removeMarker(me.locMarker);
            me.locMarker.destroy();
            me.locMarker = null;
        }

        me.removeLocFeature();
    },
    removeOrgMarkers: function(){
        var me = this;

        me.removePopup(me.popupType.ORGQUERY);
//        var i = me.orgMarkers.length - 1;
//        for(; i >= 0 ; i--){
//            var marker = me.orgMarkers[i];
//            me.markerLayer.removeMarker(marker);
//            marker.destroy();
//        }
//        me.orgMarkers = [];

        me.orgVecLayer.removeAllFeatures();
    },
    removePopup: function(type){
        var me = this;

        if(me.currentPopup && (type === undefined || me.currentPopup.type === type)){
            me.map.removePopup(me.currentPopup);
            me.currentPopup.destroy();
            me.currentPopup = null;
        }
    },    
    //route: function(){
    //    var me = this;
    //
    //    //if(!me.tgos.isDefined()){
    //    //    me.tgos.showRefErrorMsg();
    //    //    return;
    //    //}
    //
    //    if(!me.routingFeature.origin){
    //        Ext.MessageBox.show({
    //            title: '路徑規劃',
    //            msg: '請設定起點！',
    //            buttons: Ext.MessageBox.OK,
    //            icon: Ext.MessageBox.WARNING
    //        });
    //        return;
    //    }
    //
    //    if(!me.routingFeature.destination){
    //        Ext.MessageBox.show({
    //            title: '路徑規劃',
    //            msg: '請設定終點！',
    //            buttons: Ext.MessageBox.OK,
    //            icon: Ext.MessageBox.WARNING
    //        });
    //        return;
    //    }
    //
    //    var callback = function(){
    //
    //    };
    //
    //    //me.tgos.route(me.routingFeature, callback);
    //},
    setCenter : function(x, y, zoomLevel){
        var me = this;
        me.map.setCenter(new OpenLayers.LonLat(x, y), zoomLevel);
    },
    setChoroplethPeopleMapsLayerStyle: function(style){
        var me = this;

        me.choroplethPeopleMapsLayer.styleMap = style;
    },
    setChoroplethSocMapsLayerStyle: function(style){
        var me = this;

        me.choroplethSocMapsLayer.styleMap = style;
    },
    //setCenterByTWD67: function(x, y){
    //    var me = this;
    //    var GOOGLE = new OpenLayers.LonLat(x, y).transform(me.projections.TWD67, me.projections.GOOGLE);
    //    me.setCenter(GOOGLE.lon, GOOGLE.lat);
    //},
    //setCenterByTWD97: function(x, y){
    //    var me = this;
    //    var GOOGLE = new OpenLayers.LonLat(x, y).transform(me.projections.TWD97, me.projections.GOOGLE);
    //    me.setCenter(GOOGLE.lon, GOOGLE.lat);
    //},
    //setCenterByWGS84: function(lon, lat){
    //    var me = this;
    //    var GOOGLE = new OpenLayers.LonLat(lon, lat).transform(me.projections.WGS84, me.projections.GOOGLE);
    //    me.setCenter(GOOGLE.lon, GOOGLE.lat);
    //},
    setLayerScale: function(layer, minScale, maxScale){
        layer.setVisibility(false);

        if(minScale){
            layer.options.minScale = minScale;
        }

        if(maxScale){
            layer.options.maxScale = maxScale;
        }

        layer.initResolutions();
        layer.setVisibility(true);
    },
    setGeolocateCounty: function(countyName){
        var me = this;
        Ext.Ajax.request({
            url: '../map/getCntcode',
            method: "POST",
            timeout : 30000,
            params: {
                countyName: countyName
            },
            success : function(response, options){
                var result = Ext.JSON.decode(response.responseText);
                if(result.success && result.data !== null){
                    me.geolocateCntcode = result.data.cntcode;
                }
            }
        });
    },
    setRoutingDestinationFeature: function(feature){
        var me = this;
        
        me.deleteRoutingDestinationFeature();        
        me.routingFeature.destination = feature;
        me.routingLocLayer.addFeatures([feature]);
    },
    setRoutingOriginFeature: function(feature){
        var me = this;
        
        me.deleteRoutingOriginFeature();
        me.routingFeature.origin = feature;
        me.routingLocLayer.addFeatures([feature]);
    },
    //setupNavigationControl: function(){
    //    var me = this;
    //
    //    var navCtrl = me.map.getControlsByClass("OpenLayers.Control.Navigation")[0];
    //    if(navCtrl){
    //        navCtrl.handlers.wheel.interval = 100;
    //    }
    //},
    transformToWGS84: function(x, y){
        var me = this;
        var lonLat = new OpenLayers.LonLat(x, y).transform(me.projections.TWD97, me.projections.WGS84);
        return lonLat;
    },
    transTgosFeatureToOLFeature: function(tgosFeature){
        var me = this;
        var geojson_format = new OpenLayers.Format.GeoJSON();
        var tgosGeojson = tgosFeature.geometry.geometry.toGeoJson();
        var olFeature = geojson_format.read(tgosGeojson)[0];
        return olFeature;
    },
    zoomToBounds : function(bounds){
        var me = this;
        me.map.zoomToExtent(bounds);       
    },
    zoomToChiayi: function(){
        var me = this;        
        me.map.zoomToExtent(me.chiayiMaxExtent);
    },
    zoomToExtent : function(minX, minY, maxX, maxY){
        var me = this;
        me.map.zoomToExtent(new OpenLayers.Bounds(minX, minY, maxX, maxY));       
    },
    zoomToExtentBox : function(box){
        var me = this;

        box = box.substr(4,box.length - 5);
        var extent = box.split(",");
        var min = extent[0].split(" ");
        var max = extent[1].split(" ");
        me.zoomToExtent(min[0], min[1], max[0], max[1]);
    },
    zoomToExtentBox2 : function(box){
        var me = this;

        var extent = box.split(",");
        me.zoomToExtent(extent[0], extent[1], extent[2], extent[3]);
    },
    zoomToExtentTWD97 : function(minX, minY, maxX, maxY){
        var me = this;
        var bound = new OpenLayers.Bounds(minX, minY, maxX, maxY);
        var trnsBound = bound.transform(me.projections.TWD97, me.projections.GOOGLE);
        me.zoomToBounds(trnsBound);       
    },
    zoomToLevel : function(level){
        var me = this;
        me.map.zoomTo(level);
    },
    
    /*
     * 測試功能
     */
     
     printLayers: function(){
         var me = this;
         for(var i=0 ; i < me.map.layers.length ; i++){
             var layer = me.map.layers[i];
             console.log(layer.renderer);
         }
     }
     
});