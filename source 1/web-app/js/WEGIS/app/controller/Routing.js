Ext.define('WEGIS.controller.Routing', {
    extend: 'Ext.app.Controller',
    
    views:[
        'routing.MainWindow',
        'routing.ResultWindow',
        'Ext.ux.GMapPanel'
    ],
    
    refs: [
        { ref: 'routingWin', selector: 'wx_routingWindow' },
        { ref: 'tplp', selector: 'wx_routingWindow panel[itemId=tplp]' },
        { ref: 'routingResultWin', selector: 'wx_routingResultWindow', autoCreate: true, xtype: 'wx_routingResultWindow' },
        { ref: 'originCoordinate', selector: 'wx_routingWindow [itemId=originCoordinate]' },
        { ref: 'destinationCoordinate', selector: 'wx_routingWindow [itemId=destinationCoordinate]' }
    ],
    
    init: function() {
        var me = this;
        
        me.map = WEGIS.map.Map;
        me.routingLocLayer = me.map.routingLocLayer;

        me.isGMapReady = false;
        me.taskCount = 0;
        me.routingtask = {
            run: me.waitGMapReady,
            interval: 200,
            scope: me
        };

        me.RoutingDataTpl = me.createRoutingDataTpl();
        
        me.control({
            'wx_routingWindow': {
                afterrender: me.onRoutingWindowAfterrender
            },
            'wx_routingWindow button[itemId^=winBtn]': {
                click: me.onRoutingWindowButtonClick
            },
            'wx_routingToolbar button[action]': {
                click: me.onRoutingToolbarButtonClick
            },
            'wx_routingResultWindow gmappanel': {
                mapready: me.onGMapReady
            }
        });
        
        me.bindRoutingLocLayer();
    },
    
    bindRoutingLocLayer: function() {
        var me = this;
        
        me.routingLocLayer.events.on({
            featureadded: me.onRoutingLayerFeatureAdded,
            featuresremoved: me.onRoutingLayerFeatureMoved,
            scope: me
        });
    },

    onRoutingLayerFeatureAdded: function(evt) {
        var me = this;

        var layer = evt.object;
        var rtype = evt.feature.attributes.rtype;
        if(rtype === 3){
            var x = evt.feature.geometry.x;
            var y = evt.feature.geometry.y;
            var length = layer.features.length - 2;

            for(var i = length; i>=0 ; i--){
                // 檢查地點是否有重複
                if(x === layer.features[i].geometry.x && y === layer.features[i].geometry.y) {
                    this.removeFeatures(evt.feature);
                    var index = me.map.routingFeature.ways.indexOf(evt.feature);
                    if (index > -1) {
                        me.map.routingFeature.ways.splice(index, 1);
                    }
                    break;
                }
            }
        }

        evt.feature.attributes.index = me.map.routingFeature.ways.length;
        me.refreshRoutingDataView();
        layer.redraw();
    },

    onRoutingLayerFeatureMoved: function(evt){
        var me = this;

        var layer = evt.object;
        var count = me.map.routingFeature.ways.length;
        for(var i=0 ; i<count ; i++){
            var feature = me.map.routingFeature.ways[i];
            delete feature.attributes.index;
            feature.attributes.index = i+1;
        }

        layer.redraw();
        me.refreshRoutingDataView();
    },

    createRoutingDataTpl: function () {
        var tpl = new Ext.XTemplate(
            '<div class="ui horizontal divider">路徑規劃地點</div>',
            '<div class="ui small blue message">',
                '起點：&nbsp;<tpl if="origin !== null">',
                '<button class="ui mini blue compact icon button" onclick="WEGIS.map.Map.setCenter({origin.geometry.x},{origin.geometry.y})"><i class="marker icon"></i></button>',
                '<button class="ui mini blue compact icon button" onclick="WEGIS.map.Map.deleteRoutingOriginFeature();"><i class="remove icon"></i></button>',
                '</tpl>',
            '</div>',
            '<div class="ui small green message">',
                '終點：&nbsp;<tpl if="destination !== null">',
                '<button class="ui mini green compact icon button" onclick="WEGIS.map.Map.setCenter({destination.geometry.x},{destination.geometry.y})"><i class="marker icon"></i></button>',
                '<button class="ui mini green compact icon button" onclick="WEGIS.map.Map.deleteRoutingDestinationFeature();"><i class="remove icon"></i></button>',
                '</tpl>',
            '</div>',
            '<tpl for="ways">',
                '<div class="ui small pink message">',
                    '必經點{#}：&nbsp;',
                    '<button class="ui mini pink compact icon button" onclick="WEGIS.map.Map.setCenter({geometry.x},{geometry.y})"><i class="marker icon"></i></button>',
                    '<button class="ui mini pink compact icon button" onclick="WEGIS.map.Map.deleteRoutingWayFeaturesByIndex({#});"><i class="remove icon"></i></button>',
                '</div>',
            '</tpl>',
            {
                round: function(coor){
                    return coor.toFixed(2);
                }
            }
        );

        return tpl;
    },
            
    deleteSelectedRoutingFeature: function(){
        var me = this;
        me.map.deleteSelectedRoutingFeature();
    },
    
    deleteAllRoutingFeature: function(){
        var me = this;
        me.map.deleteAllRoutingFeature();
    },
            
    onRoutingWindowAfterrender: function(component, eOpts){
        var me = this;

        me.refreshRoutingDataView();
    },

    refreshRoutingDataView: function () {
        var me = this;

        var panel = me.getTplp();
        if(panel){
            me.RoutingDataTpl.overwrite(Ext.get("routingDataTplDiv"), me.map.routingFeature);
            panel.doLayout();
        }
    },
            
    onRoutingToolbarButtonClick: function(button, e, eOpts){
        var me = this;
        switch(button.action){
            case 'delete':
                me.deleteSelectedRoutingFeature();
                break;
            case 'deleteAll':
                me.deleteAllRoutingFeature();
                break;
        }
    },
            
    onRoutingWindowButtonClick: function(button, e, eOpts){
        var me = this;

        switch(button.action){
            case 'route':
                me.showResultWin();
                break;
            case 'clear':
                me.clearRoutingMark();
                break;
            case 'close':
                me.closeRoutingWindow();
                break;
        }
    },

    clearRoutingMark: function(){
        var me = this;

        me.map.deleteAllRoutingFeature();
    },
    
    closeRoutingWindow: function(){
        var me = this;
        var win = me.getRoutingWin();
        win.close();   
    },

    onGMapReady: function(panel, gmap){
        var me = this;

        me.isGMapReady = true;
        me.gmap = gmap;
        me.dirSvc = new google.maps.DirectionsService();
        me.dirDsp = new google.maps.DirectionsRenderer();
    },

    showResultWin: function(){
        var me = this;

        if(!me.checkRoutingPoints()){
            return;
        }

        var resultWin = me.getRoutingResultWin();
        resultWin.show();

        if(me.isGMapReady === false){
            me.taskCount = 0;
            me.runner = new Ext.util.TaskRunner();
            me.runner.start(me.routingtask);
        }
        else{
            me.route();
        }
    },

    checkRoutingPoints: function(){
        var me = this;

        // 起點
        if(!me.map.routingFeature.origin){
            Ext.MessageBox.show({
                title: '路徑規劃',
                msg: '請設定起點！',
                buttons: Ext.MessageBox.OK,
                icon: Ext.MessageBox.WARNING
            });
            return false;
        }

        // 終點
        if(!me.map.routingFeature.destination){
            Ext.MessageBox.show({
                title: '路徑規劃',
                msg: '請設定終點！',
                buttons: Ext.MessageBox.OK,
                icon: Ext.MessageBox.WARNING
            });
            return false;
        }

        // 必經點，上限為8個
        if(me.map.routingFeature.ways.length > 8){
            Ext.MessageBox.show({
                title: '路徑規劃',
                msg: '必經點數量上限為8個！',
                buttons: Ext.MessageBox.OK,
                icon: Ext.MessageBox.WARNING
            });
            return false;
        }

        return true;
    },

    waitGMapReady: function(){
        var me = this;

        if(me.gmap){
            me.runner.stop(me.routingtask);
            me.route();
        }
        else{
            me.taskCount++;
            if(me.taskCount === 150){
                me.runner.stop(me.routingtask);
            }
        }
    },

    route: function(){
        var me = this;
        var waypts = [];

        // 清除路徑規劃結果
        me.dirDsp.setMap(null);
        me.dirDsp.setPanel(null);

        // 座標轉換
        var origin = me.map.routingFeature.origin;
        var destination = me.map.routingFeature.destination;

        var startLonLat = me.map.transformToWGS84(origin.geometry.x, origin.geometry.y);
        var endLonLat = me.map.transformToWGS84(destination.geometry.x, destination.geometry.y);

        var start = new google.maps.LatLng(startLonLat.lat, startLonLat.lon);
        var end = new google.maps.LatLng(endLonLat.lat, endLonLat.lon);

        for(var i=0 ; i<me.map.routingFeature.ways.length ; i++){
            var watpt = me.map.routingFeature.ways[i];
            var watptLonLat = me.map.transformToWGS84(watpt.geometry.x, watpt.geometry.y);
            waypts.push({
                location: new google.maps.LatLng(watptLonLat.lat, watptLonLat.lon),
                stopover: true
            });
        }

        var rWin = me.getRoutingWin();
        var form = rWin.down('form');
        var valid = form.isValid();

        if(valid){
            var values = form.getValues();

            // 交通模式
            var travelMode = google.maps.TravelMode.DRIVING;
            if(values.travelMode === 3){
                travelMode = google.maps.TravelMode.TRANSIT;
            }
            else if(values.travelMode === 4){
                travelMode = google.maps.TravelMode.WALKING;
            }

            // 路徑規劃模式
            var optimizeWaypoints = false;
            if(values.optWaypoints === 1){
                optimizeWaypoints = true;
            }

            var request = {
                origin: start,
                destination: end,
                waypoints: waypts,
                optimizeWaypoints: optimizeWaypoints,
                travelMode: travelMode,
                unitSystem: google.maps.UnitSystem.METRIC
            };

            me.dirSvc.route(request, function(response, status) {
                if (status === google.maps.DirectionsStatus.OK) {
                    me.dirDsp.setMap(me.gmap);
                    me.dirDsp.setPanel($('#directions_results')[0]);
                    me.dirDsp.setDirections(response);
                }
                else if(status === google.maps.DirectionsStatus.NOT_FOUND){
                    me.showRoutingResultMsg('起點、必經點或終點無法路經規劃！');
                }
                else if(status === google.maps.DirectionsStatus.ZERO_RESULTS) {
                    me.showRoutingResultMsg('無路徑規劃結果！');
                }
                else if(status === google.maps.DirectionsStatus.MAX_WAYPOINTS_EXCEEDED){
                    me.showRoutingResultMsg('必經點數量超過上限(8個)！');
                }
                else if(status === google.maps.DirectionsStatus.INVALID_REQUEST){
                    me.showRoutingResultMsg('無效的路徑規劃要求！');
                }
                else if(status === google.maps.DirectionsStatus.OVER_QUERY_LIMIT) {
                    me.showRoutingResultMsg('使用路經規劃服務次數超過限制！');
                }
                else if(status === google.maps.DirectionsStatus.REQUEST_DENIED) {
                    me.showRoutingResultMsg('無使用路徑規劃服務權限！');
                }
                else if(status === google.maps.DirectionsStatus.UNKNOWN_ERROR) {
                    me.showRoutingResultMsg('未知錯誤！');
                }
            });
        }
    },

    showRoutingResultMsg: function(msg){
        Ext.MessageBox.show({
            title: '路經規劃',
            msg: msg,
            buttons: Ext.MessageBox.OK,
            icon: Ext.MessageBox.ERROR
        });
    }
});