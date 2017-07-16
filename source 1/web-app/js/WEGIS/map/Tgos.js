Ext.define('WEGIS.map.Tgos', {
    singleton: true,
    SERVICE: "//api.tgos.tw/TileAgent/",       // 設定圖磚代理服務位址
    SERVICE97: "//api.tgos.tw/Agent/TWD97/",   // 設定圖磚代理服務位址
    TGOSMAP: "TGOSMAP_W.aspx",                          // TGOS電子地圖，numZoomLevels:20  
    TGOSMAP97: "Agent_TGOSMAP3826.aspx",                // TGOS電子地圖，numZoomLevels:14
    NLSCMAP: "NLSCMAP_W.aspx",                          // 通用版電子地圖，numZoomLevels:20
    NLSCMAP97: "Agent_NLSCMAP3826.aspx",                // 通用版電子地圖，numZoomLevels:
    F2IMAGE: "F2IMAGE_W.aspx",          		// 福衛二號影像，numZoomLevels:18
    F2IMAGE97: "Agent_F2IMAGE3826.aspx",          	// 福衛二號影像，numZoomLevels:
    ROADMAP: "ROADMAP_W.aspx",                          // 福衛二號混合圖，numZoomLevels:18
    ROADMAP97: "Agent_ROADMAP3826.aspx",                // 福衛二號混合圖，numZoomLevels:12
    HILLSHADE: "HILLSHADE_W.aspx",			// 地形暈渲圖，numZoomLevels:14
    HILLSHADE97: "Agent_HILLSHADE3826.aspx",		// 地形暈渲圖，numZoomLevels:
    HILLSHADEMIX: "HILLSHADEMIX_W.aspx",                // 地形暈渲混合圖，numZoomLevels:14
    HILLSHADEMIX97: "Agent_HILLSHADEMIX3826.aspx",                // 地形暈渲混合圖，numZoomLevels:
    TGOSMAP_SERVER_RESOLUTIONS: [0.298582141727292, 0.597164283481042, 1.19432856696208, 2.38865713392417, 4.77731426782187, 9.55462853564375, 19.1092570712875, 38.2185141426015, 76.4370282851765, 152.874056570353, 305.748113140706, 611.496226281412, 1222.99245256282, 2445.98490512565, 4891.96981025127, 9783.93962050256, 19567.8792410051, 39135.7584820103, 78271.5169640206, 156543.033928041],
    TGOSMAP97_SERVER_RESOLUTIONS: [0.264583333333333, 0.661458333333333, 1.32291666666667, 2.64583333333333, 6.61458333333333, 13.2291666666667, 26.4583333333333, 66.1458333333333, 132.291666666667, 264.583333333333, 661.458333333333, 1322.91666666667, 2645.83333333333, 3307.29166666667],
    NLSCMAP_SERVER_RESOLUTIONS: [0.298582141727292, 0.597164283481042, 1.19432856696208, 2.38865713392417, 4.77731426782187, 9.55462853564375, 19.1092570712875, 38.2185141426015, 76.4370282851765, 152.874056570353, 305.748113140706, 611.496226281412, 1222.99245256282, 2445.98490512565, 4891.96981025127, 9783.93962050256, 19567.8792410051, 39135.7584820103, 78271.5169640206, 156543.033928041],
    NLSCMAP97_SERVER_RESOLUTIONS: [0.264583333333333, 0.661458333333333, 1.32291666666667, 2.64583333333333, 6.61458333333333, 13.2291666666667, 26.4583333333333, 66.1458333333333, 132.291666666667, 264.583333333333, 661.458333333333, 1322.91666666667, 2645.83333333333, 3307.29166666667],
    F2IMAGE_SERVER_RESOLUTIONS: [1.19432856696208, 2.38865713392417, 4.77731426782187, 9.55462853564375, 19.1092570712875, 38.2185141426015, 76.4370282851765, 152.874056570353, 305.748113140706, 611.496226281412, 1222.99245256282, 2445.98490512565, 4891.96981025127, 9783.93962050256, 19567.8792410051, 39135.7584820103, 78271.5169640206, 156543.033928041],
    F2IMAGE97_SERVER_RESOLUTIONS: [1.32291666666667, 2.64583333333333, 6.61458333333333, 13.2291666666667, 26.4583333333333, 66.1458333333333, 132.291666666667, 264.583333333333, 661.458333333333, 1322.91666666667, 2645.83333333333, 3307.29166666667],
    ROADMAP_SERVER_RESOLUTIONS: [1.19432856696208, 2.38865713392417, 4.77731426782187, 9.55462853564375, 19.1092570712875, 38.2185141426015, 76.4370282851765, 152.874056570353, 305.748113140706, 611.496226281412, 1222.99245256282, 2445.98490512565, 4891.96981025127, 9783.93962050256, 19567.8792410051, 39135.7584820103, 78271.5169640206, 156543.033928041],
    ROADMAP97_SERVER_RESOLUTIONS: [1.32291666666667, 2.64583333333333, 6.61458333333333, 13.2291666666667, 26.4583333333333, 66.1458333333333, 132.291666666667, 264.583333333333, 661.458333333333, 1322.91666666667, 2645.83333333333, 3307.29166666667],
    HILLSHADE_SERVER_RESOLUTIONS: [19.1092570712875, 38.2185141426015, 76.4370282851765, 152.874056570353, 305.748113140706, 611.496226281412, 1222.99245256282, 2445.98490512565, 4891.96981025127, 9783.93962050256, 19567.8792410051, 39135.7584820103, 78271.5169640206, 156543.033928041],
    HILLSHADEMIX_SERVER_RESOLUTIONS: [19.1092570712875, 38.2185141426015, 76.4370282851765, 152.874056570353, 305.748113140706, 611.496226281412, 1222.99245256282, 2445.98490512565, 4891.96981025127, 9783.93962050256, 19567.8792410051, 39135.7584820103, 78271.5169640206, 156543.033928041],
    IMG_WIDTH: 256,
    IMG_HEIGHT: 256,
    DCLEFT: -20037508.342789,
    DCLEFT97: 50000,
    DCLOWER: 20037508.342789,
    DCLOWER97: 3000000,
    dCacheLeft97: -65000,
    dCacheTop97: 2946000,
    dCacheRight97: 641000,
    dCacheBottom97: 2397000,
    appid: 'crjQ6ObTtVyWJgllDpwbvtrcZSP5iOyOA23wC0j0WquJszOQh0OBTA==',
    apikey: 'cGEErDNy5yN/1fQ0vyTOZrghjE+jIU6uSdcCyZjL+rWFlHvaqbat47gq98bcKuSVLhr/ZIyJXSHK0f6ZNt/2ux2g6K1r5RDt/N21OSX9+PzTkcNzs4LIYvGqe5eAZWJNi94QgyEWfOEuJFbtGsPkvWhBN0IHX2YYpHg2BqUkmkm2wQzAvLnQc9cXOixFCqDd3XvkbHbrpITyTnl4LArmRdP69XkMIGWOhX5arXfmp05rDCTrEezD4u6Rt3fvCbjeAsLWUqJCmgSqvpDu7AYMAHEDx/L8c0EG8yUrWzOoY+37SQs2gcU1ODR3gBwDjvo8KwcjKcNL/ZnqsrB5iPNQUDxhHz8G9d6YWwxE1X1WBAUZA4QjfTI3hP9tRCMBr7grfwe4qu9s1NGvw6NoprT9vZyOs7iNqWsnSrvFiVye8WP6ZxRyUGgaWPjnq+5SVN7LgiprIBQZrfXibesQ0fvPddClGaQKqgpAQ0RGmhiJFsPNHd1YlrZznw+WddAX708k',
    baseLayers: [],
    lsService: null,
    addrLocate: null,
    routeAnalysis: null,
    constructor : function(config){
        var me = this;
        
        if(me.isDefined()){
            //me.baseLayers.push(tgosMap, roadMap);
            var urlTail = '/GetCacheImage?APPID=' + me.appid + '&APIKEY=' + me.apikey + '&L=0&S=${z}&X=${x}&Y=${y}';
            
            var tgosMap97Url = me.SERVICE97 + me.TGOSMAP97 + urlTail;
            var tgosMap97 = new OpenLayers.Layer.XYZ.SuperGISServer("TGOS電子地圖", tgosMap97Url,
                {
                    type: 'TGOSMAP97',
                    shortName: 'TGOS地圖',
                    //serverResolutions: me.TGOSMAP97_SERVER_RESOLUTIONS,
                    resolutions: me.TGOSMAP97_SERVER_RESOLUTIONS,
                    maxExtent: new OpenLayers.Bounds(-65000, 2397000, 641000, 2946000),
                    tileSize: new OpenLayers.Size(me.IMG_WIDTH, me.IMG_HEIGHT),       //指定圖磚的寬高大小
                    tileOrigin: new OpenLayers.LonLat(me.DCLEFT97, me.DCLOWER97),         //指定服務的左下角原點
                    isBaseLayer: true,
                    visibility: false,
                    alwaysInRange: true,
                    numZoomLevels: 14,
                    buffer: 0,
                    transitionEffect: 'resize'
                }
            );
            tgosMap97.id = 'TGOSMAP97';
                
            var roadMap97Url = me.SERVICE97 + me.ROADMAP97 + urlTail;
            var roadMap97 = new OpenLayers.Layer.XYZ.SuperGISServer("福衛二號混合圖", roadMap97Url,
                {
                    type: 'ROADMAP97',
                    shortName: '福衛混合圖',
                    resolutions: me.ROADMAP97_SERVER_RESOLUTIONS,
                    maxExtent: new OpenLayers.Bounds(50000, 2360000, 356000, 3000000),
                    tileSize: new OpenLayers.Size(me.IMG_WIDTH, me.IMG_HEIGHT),       //指定圖磚的寬高大小
                    tileOrigin: new OpenLayers.LonLat(me.DCLEFT97, me.DCLOWER97),         //指定服務的左下角原點
                    isBaseLayer: true,
                    visibility: false,
                    alwaysInRange: true,
                    numZoomLevels: 12,
                    buffer: 0,
                    transitionEffect: 'resize'
                }
            );
                
            var f2Image97Url = me.SERVICE97 + me.F2IMAGE97 + urlTail;
            var f2Image97 = new OpenLayers.Layer.XYZ.SuperGISServer("福衛二號影像圖", f2Image97Url,
                {
                    type: 'F2IMAGE97',
                    shortName: '福衛影像圖',
                    resolutions: me.F2IMAGE97_SERVER_RESOLUTIONS,
                    maxExtent: new OpenLayers.Bounds(50000, 2360000, 356000, 3000000),
                    tileSize: new OpenLayers.Size(me.IMG_WIDTH, me.IMG_HEIGHT),       //指定圖磚的寬高大小
                    tileOrigin: new OpenLayers.LonLat(me.DCLEFT97, me.DCLOWER97),         //指定服務的左下角原點
                    isBaseLayer: true,
                    visibility: false,
                    alwaysInRange: true,
                    numZoomLevels: 12,
                    buffer: 0,
                    transitionEffect: 'resize'
                }
            );
                
            var nlscMap97Url = me.SERVICE97 + me.NLSCMAP97 + urlTail;
            var nlscMap97 = new OpenLayers.Layer.XYZ.SuperGISServer("通用版電子地圖", nlscMap97Url,
                {
                    type: 'NLSCMAP97',
                    shortName: '通用版地圖',
                    resolutions: me.NLSCMAP97_SERVER_RESOLUTIONS,
                    maxExtent: new OpenLayers.Bounds(-65000, 2397000, 641000, 2946000),
                    tileSize: new OpenLayers.Size(me.IMG_WIDTH, me.IMG_HEIGHT),       //指定圖磚的寬高大小
                    tileOrigin: new OpenLayers.LonLat(me.DCLEFT97, me.DCLOWER97),         //指定服務的左下角原點
                    isBaseLayer: true,
                    visibility: false,
                    alwaysInRange: true,
                    numZoomLevels: 14,
                    buffer: 0,
                    transitionEffect: 'resize'
                }
            );
                
            me.baseLayers.push(tgosMap97, roadMap97, f2Image97, nlscMap97);
            
            // 定位服務
            me.lsService = new TGOS.TGLocateService();
            
            // 座標查詢最鄰近地址
            me.addrLocate = new TGOS.TGAddress();
        }
        
        me.initConfig(config);
        me.callParent(arguments);
    },
    isDefined: function(){
        return (typeof(TGOS) !== 'undefined');
    },
    locateTWD97: function(request, callback){
        var me = this;
        me.lsService.locateTWD97(request, callback);
    },
    nearestAddress: function(px, py){
        var me = this;

        var addrpt = new TGOS.TGPoint(px, py);
        me.addrLocate.nearestAddress(addrpt, TGOS.TGCoordSys.EPSG3826,  //利用滑鼠點擊位置查詢最鄰近地址
            function(result, status){
                if (status !== TGOS.TGLocatorStatus.OK) {
                    return;
                }

                WEGIS.map.Map.setGeolocateCounty(result.addressComponents.county);
            }
        );
    },
    queryAddress: function(address, callback){
        var me = this;
        
        var request = {
            address : address 
        };

        me.locateTWD97(request, callback);
    },
    queryDistrict: function(district, callback){
        var me = this;
        
        var request = {
            district : district 
        };

        me.locateTWD97(request, callback);
    },
    queryRoad: function(roadName, pageNumber, callback){
        var me = this;
        
        var request = {
            roadLocation : roadName,
            pageNumber: pageNumber
        };

        me.locateTWD97(request, callback);
    },
    queryPoi: function(poiName, pageNumber, callback){
        var me = this;

        var request = {
            poi: poiName,
            pageNumber: pageNumber
        };

        me.locateTWD97(request, callback);
    },
    queryNearestAddressByCoordinate: function(x, y, callback){
        var me = this;
        
        var addrpt = new TGOS.TGPoint(x, y); 
        me.addrLocate.nearestAddress(addrpt, TGOS.TGCoordSys.EPSG3826, callback);
    },
    route: function(routingFeature, callback){
        var me = this;
        
        if(!me.routeAnalysis){
            me.routeAnalysis = new TGOS.TGRoutes();
        }
        
        console.log(routingFeature.origin);
    },
    showRefErrorMsg: function(){
        Ext.MessageBox.show({
            title: 'TGOS',
            msg: 'TGOS參照發生錯誤！',
            buttons: Ext.MessageBox.OK,
            icon: Ext.MessageBox.ERROR
        });
    }
});