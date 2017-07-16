Ext.define('WEGIS.controller.Map', {
    extend: 'Ext.app.Controller',
    
    requires: [
        'WEGIS.ux.map.ContextMenu'
    ],
    
    views:[
        'map.MapPanel'
    ],
    
    refs: [
        { ref: 'mapToolbar', selector: 'wx_mapToolbar' },
        { ref: 'mapBbar', selector: 'wx_mapPanel toolbar[dock=bottom]' },
        { ref: 'scaleText', selector: 'wx_mapPanel toolbar[dock=bottom] tbtext[id=scaleText]' },
        { ref: 'mousePositionTWD97', selector: 'wx_mapPanel toolbar[dock=bottom] tbtext[id=mousePositionTWD97]' },
        { ref: 'mousePositionWGS84', selector: 'wx_mapPanel toolbar[dock=bottom] tbtext[id=mousePositionWGS84]' }
    ],
    
    map: null,
    olMap: null,
    tgos: null,
    mapContextMenu: null,
    
    init: function() {
        var me = this;
        
        me.map = WEGIS.map.Map;
        me.olMap = me.map.map;
        me.tgos = WEGIS.map.Tgos;
        
        me.control({
            'wx_mapPanel': {
                afterrender: me.onMapPanelAfterrender
            },
            'wx_mapToolbar button[action]': {
                click: me.onMapToolbarButtonClick
            },
            'wx_mapToolbar button[itemId=mapToolbar_OLWin]': {
                click: me.toggleOverlayLayerWindow
            },
            'wx_mapToolbar button[itemId=mapToolbar_ChangeBaseLayer]': {
                afterrender: me.onMapToolbarBaseLayerButtonAfterrender
            },
            'wx_mapToolbar buttongroup button': {
                toggle: me.onMapToolbarChangeBaseLayerButtonToggle
            },
            'wx_mapContextMenu menuitem': {
                click: me.onMapPanelContextMenuItemClick
            }
            //'wx_mapMainMenu button, button[id$="-menu-trigger"] > menuitem': {
            //    click: me.onMainMenuButtonClick
            //}
        });
        
        me.bindMap();
    },
            
    /**
     * 
     *
     * @private
     */
    bindMap: function() {
        var me = this;
        
        // map context menu
        me.mapContextMenu = Ext.widget('wx_mapContextMenu');
        
        me.olMap.getViewport().addEventListener('contextmenu', function (e) { 
            e.preventDefault();

            if(Ext.isIE){
                me.mapContextMenu.setMouseX(e.x);
                me.mapContextMenu.setMouseY(e.y);
            }
            else{
                me.mapContextMenu.setMouseX(e.offsetX);
                me.mapContextMenu.setMouseY(e.offsetY);
            }
            
            me.mapContextMenu.showAt(e.clientX, e.clientY);
        });
        
        me.olMap.getViewport().addEventListener('mousedown', function (e) { 
            var btnCode = e.button;            
            if(btnCode !== 2 && !me.mapContextMenu.isHidden()){
                me.mapContextMenu.hide();
            }
        });
    },
    
    onMapPanelAfterrender: function(component, eOpts){
        var me = this;
        
        // 顯示地圖比例
        me.olMap.events.register('moveend', this, function(){            
            var scale = me.olMap.getScale();
            if (scale >= 9500 && scale <= 950000) {
                scale = Math.round(scale / 1000) + "K";
            } else if (scale >= 950000) {
                scale = Math.round(scale / 1000000) + "M";
            } else {
                scale = Math.round(scale);
            }  

            var scaleStr = OpenLayers.i18n('<b><span style=" color: blue;">地圖比例：</span> 1 : ${scaleDenom}</b>', {'scaleDenom': scale});
            
            Ext.suspendLayouts();
            var scaleText = me.getScaleText();
            scaleText.update(scaleStr);
            Ext.resumeLayouts(true);
        });
        
        // 顯示滑鼠座標位置
        var mpc = new OpenLayers.Control.MousePosition({
            formatOutput: function (lonLat) { 
                var WGS84Lon = lonLat.lon;
                var WGS84Lat = lonLat.lat;
                lonLat.transform(WEGIS.map.Projection.WGS84, WEGIS.map.Projection.TWD97);

                // OpenLayers.i18n('<b><span style=" color: blue;">地圖比例：</span> 1 : ${scaleDenom}</b>', {'scaleDenom': scale});
                var TWD97Output = OpenLayers.i18n('<b><span style=" color: blue;">TWD97座標：</span> ${TWD97X},&nbsp;${TWD97Y}</b>', {
                    'TWD97X': lonLat.lon.toFixed(3),
                    'TWD97Y': lonLat.lat.toFixed(3)
                });

                Ext.suspendLayouts();

                var WGS84Output = OpenLayers.i18n('<b><span style=" color: blue;">經緯座標：</span>${WGS84Lon}&deg;,&nbsp;${WGS84Lat}&deg;</b>', {
                    'WGS84Lon': WGS84Lon.toFixed(5),
                    'WGS84Lat': WGS84Lat.toFixed(5)
                });

                me.getMousePositionTWD97().update(TWD97Output);
                me.getMousePositionWGS84().update(WGS84Output);

                Ext.resumeLayouts(true); // true=run layouts if 0 suspend count  
                return '';
            }
        });
        
        me.olMap.addControl(mpc);
    },
    
    toggleOverlayLayerWindow: function(button, e, eOpts){
        var me = this;
        me.fireEvent('mapToggleOverlayLayerWindow', button);
    },

    onMapPanelContextMenuItemClick: function(item, e, eOpts){
        var me = this;  
        
        var pixel = new OpenLayers.Pixel(me.mapContextMenu.getMouseX(), me.mapContextMenu.getMouseY());
        var lonLat = me.olMap.getLonLatFromPixel(pixel);

        switch(item.action){
            case 'setRoutingOrigin':
                me.map.addRoutingPoint(lonLat.lon, lonLat.lat, 1);
                break;
            case 'setRoutingWay':
                me.map.addRoutingPoint(lonLat.lon, lonLat.lat, 3);
                break;
            //case 'setRoutingBlock':
            //    me.map.addRoutingPoint(lonLat.lon, lonLat.lat, 4);
            //    break;
            case 'setRoutingDestination':
                me.map.addRoutingPoint(lonLat.lon, lonLat.lat, 2);
                break;
            case 'getCoordinate':
                me.getCoordinate(lonLat);
                break;
            case 'clearRoutingMark':
                me.map.deleteAllRoutingFeature();
                break;
            case 'clearBufferMark':
                me.map.clearBufferMark();
                me.map.clearBuffer();
                break;
        }
    },
            
    getCoordinate: function(lonLat){
        var me = this;
        
        //var info = 'X座標：' + lonLat.lon.toFixed(5) + '<br/>' + 'Y座標：' + lonLat.lat.toFixed(5);
        var twd97 = lonLat.clone();
        var wgs84 = lonLat.transform(WEGIS.map.Projection.TWD97, WEGIS.map.Projection.WGS84);
        console.log(twd97);
        console.log(wgs84);
        var info = me.createCoordinatePopupInfo(twd97.lon.toFixed(5), twd97.lat.toFixed(5), wgs84.lon.toFixed(5), wgs84.lat.toFixed(5));
        me.map.removeLocMark();
        me.map.addLocMarker(twd97.lon, twd97.lat, info);
    },

    createCoordinatePopupInfo: function(twd97X, twd97Y, wgs84Lon, wgs84Lat){
        var me = this;

        var info = '';
        info += '<div class="ui raised segment">' +
        '<div class="red ui top attached label">座標資訊</div>' +
        '<div>' + '經度：' + wgs84Lon + '<br/>' + '緯度：' + wgs84Lat + '<br/>' +
        'TWD97 X座標：' + twd97X + '<br/>' + 'TWD97 Y座標：' + twd97Y + '</div>' + '<br/>' +
        me.map.createPopupLocToolbar(twd97X, twd97Y) +
        '</div>';
        return info;
    },
            
    onMapToolbarButtonClick: function(button, e, eOpts){
        var me = this;

        switch(button.action){
            case 'geolocate':
                me.geolocate();
                break;
        }
    },
    
    geolocate: function(){
        var me = this;

        me.map.geolocate();
    },
            
    onMapToolbarBaseLayerButtonAfterrender: function(component, eOpts){
        var me = this;
        
        for(var i=0 ; i<me.map.baseLayers.length ; i++){
            var layer = me.map.baseLayers[i];
            if(layer.getVisibility()){
                component.setText(layer.shortName || layer.name);
                break;
            }         
        }
    },
            
    onMapToolbarChangeBaseLayerButtonToggle: function(button, pressed, eOpts){
        var me = this;

        if(pressed && button.layer){
            var layer = button.layer;
            var mapButton = button.up('button');
            mapButton.setText(layer.shortName || layer.name);
            me.olMap.setBaseLayer(layer);
        }
    }
});