Ext.define('WEGIS.ux.map.Toolbar', {
    extend: 'Ext.toolbar.Toolbar',
    alias: 'widget.wx_mapToolbar',
    
    layout: {
        overflowHandler: 'Scroller'
    },
    
    config: {
        map: null,
        baseLayers: []
    },

    navigationBtn: null,
    
    initComponent : function(){
        var me = this;

        me.olMap = me.map.map;
        var ctrl, toolbarItems = [], actions = {}, action;

        // 臺灣全圖
        action = Ext.create('GeoExt.Action', {
            control: new OpenLayers.Control.ZoomToMaxExtent(),
            map: me.olMap,
            iconCls: 'toolbar_ZoomTaiwan',
            overflowText: '臺灣全圖',
            tooltip: '臺灣全圖'
        });
        actions["max_extent"] = action;
        toolbarItems.push(Ext.create('Ext.button.Button', action));
        
        // 框選放大
        action = Ext.create('GeoExt.Action', {
            control: new OpenLayers.Control.ZoomBox(),
            map: me.olMap,
            iconCls: 'toolbar_ZoomBox',
            overflowText: '框選放大',
            tooltip: '框選放大',
            // button options
            toggleGroup: "mapToolbarButtons",
            allowDepress: false
        });        
        actions["zoom_box"] = action;
        toolbarItems.push(Ext.create('Ext.button.Button', action));
        
        // 放大
        action = Ext.create('GeoExt.Action', {
            control: new OpenLayers.Control.ZoomIn(),
            map: me.olMap,
            iconCls: 'toolbar_ZoomIn',
            overflowText: '放大',
            tooltip: '放大'
        });
        actions["zoom_in"] = action;
        toolbarItems.push(Ext.create('Ext.button.Button', action));
        
        // 縮小
        action = Ext.create('GeoExt.Action', {
            control: new OpenLayers.Control.ZoomOut(),
            map: me.olMap,
            iconCls: 'toolbar_ZoomOut',
            overflowText: '縮小',
            tooltip: '縮小'
        });
        actions["zoom_out"] = action;
        toolbarItems.push(Ext.create('Ext.button.Button', action));
        
        // 平移
        me.navigationBtn = Ext.create('Ext.button.Button', {
            iconCls: 'toolbar_ZoomPan',
            overflowText: '平移',
            tooltip: '平移',
            // button options
            toggleGroup: "mapToolbarButtons",
            allowDepress: false,
            pressed: true
        });
        toolbarItems.push(me.navigationBtn);
        toolbarItems.push("-");
        
        // Navigation history - two "button" controls
        ctrl = new OpenLayers.Control.NavigationHistory();
        me.olMap.addControl(ctrl);
        
        // Previous
        action = Ext.create('GeoExt.Action', {
            control: ctrl.previous,
            iconCls: 'toolbar_Previous',
            overflowText: '上一個地圖畫面',
            tooltip: '上一個地圖畫面',
            disabled: true
        });
        actions["previous"] = action;
        toolbarItems.push(Ext.create('Ext.button.Button', action));
        
        // Next
        action = Ext.create('GeoExt.Action', {
            control: ctrl.next,
            iconCls: 'toolbar_Next',
            overflowText: '下一個地圖畫面',
            tooltip: '下一個地圖畫面',
            disabled: true
        });
        actions["next"] = action;
        toolbarItems.push(Ext.create('Ext.button.Button', action));
        toolbarItems.push("-");
        
        // 距離測量
        action = Ext.create('GeoExt.Action', {
            control: new OpenLayers.Control.DynamicMeasure(OpenLayers.Handler.Path),
            iconCls: 'toolbar_MeasureLength',
            map: me.olMap,
            overflowText: '距離測量',
            tooltip: '距離測量',
            // button options
            toggleGroup: "mapToolbarButtons",
            allowDepress: false
        });
        actions["measureLength"] = action;
        toolbarItems.push(Ext.create('Ext.button.Button', action));
        
        // 面積測量
        action = Ext.create('GeoExt.Action', {
            control: new OpenLayers.Control.DynamicMeasure(OpenLayers.Handler.Polygon),
            iconCls: 'toolbar_MeasureArea',
            map: me.olMap,
            overflowText: '面積測量',
            tooltip: '面積測量',
            // button options
            toggleGroup: "mapToolbarButtons",
            allowDepress: false
        });
        actions["measureLength"] = action;
        toolbarItems.push(Ext.create('Ext.button.Button', action));
        toolbarItems.push("-");

        // 清除
        //var clearButton = Ext.create('Ext.button.Button', {
        //    itemId: 'mapToolbar_ClearAll',
        //    action: 'ClearAll',
        //    iconCls: 'toolbar_Erase',
        //    overflowText: '清除',
        //    tooltip: '清除所有圖台上的標示'
        //});
        //toolbarItems.push(clearButton);
        
        // 地理位置定位
        if(Ext.supports.GeoLocation){
            var enable = true;

            // Chrome在版本50後，需要在https下才能使用地理定位。
            if(window.location.hostname === "localhost");
            if(Ext.browser.is("Chrome") && Ext.browser.version.major >= 50 && window.location.protocol != "https:"){
                enable = false;
            }

            if(enable){
                var geolocateButton = Ext.create('Ext.button.Button', {
                    itemId: 'mapToolbar_Geolocate',
                    action: 'geolocate',
                    iconCls: 'toolbar_Geolocate',
                    overflowText: '地理位置定位',
                    tooltip: '地理位置定位'
                });
                toolbarItems.push(geolocateButton);
            }
        }

        // 全螢幕
        if (screenfull.enabled) {
            var fullScreenButton = Ext.create('Ext.button.Button', {
                itemId: 'mapToolbar_FullScreen',
                iconCls: 'toolbar_FullScreen',
                overflowText: '全螢幕',
                tooltip: '全螢幕',
                handler: function(){
                    screenfull.request();
                }
            });
            toolbarItems.push(fullScreenButton);
        }
        
        //
        //var geolocateButton = Ext.create('Ext.button.Button', {
        //    itemId: 'mapToolbar_Buffer',
        //    action: 'buffer',
        //    //iconCls: 'toolbar_Geolocate',
        //    text: '環域分析工具',
        //    tooltip: '環域分析工具',
        //    handler: function(){
        //        if(!me.bufferTools){
        //            me.bufferTools = Ext.create('Ext.window.Window', {
        //                width: 740,
        //                height: 80,
        //                y: 100,
        //                title: '環域分析工具',
        //                constrainHeader: true,
        //                closeAction: 'hide',
        //                items: [{
        //                    xtype: 'wx_bufferToolbar',
        //                    olMap: WEGIS.map.Map.map,
        //                    bufferMarkLayer: WEGIS.map.Map.bufferMarkLayer,
        //                    border: false
        //                }]
        //            });
        //        }
        //
        //        me.bufferTools.show();
        //    }
        //});
        //toolbarItems.push(geolocateButton);

        // 按鈕靠右
        toolbarItems.push('->');

        // 環域工具
        var bufferToolButton = Ext.create('Ext.button.Button', {
            itemId: 'mapToolbar_BufferTool',
            iconCls: 'toolbar_Toolbox',
            text: '環域工具',
            tooltip: '環域工具',
            arrowAlign: 'right',
            iconAlign: 'left',
            menu: me.createBufferTool(me.map)
        });
        toolbarItems.push(bufferToolButton);
        
        // 變更地圖
        var changeBaseLayerButton = Ext.create('Ext.button.Button', {
            itemId: 'mapToolbar_ChangeBaseLayer',
            action: 'changeBaseLayer',
            iconCls: 'toolbar_BaseLayers',
            text: '地圖',            
            tooltip: '地圖',            
            arrowAlign: 'right',
            iconAlign: 'left',
            menu: me.createBaseLayerMenu()
        });
        toolbarItems.push(changeBaseLayerButton);
        
        // 圖層管理
        action = Ext.create('GeoExt.Action', {
            itemId: 'mapToolbar_OLWin',
            iconCls: 'toolbar_Layers',
            overflowText: '圖層管理',
            tooltip: '圖層管理'
        });
        actions["olWin"] = action;
        toolbarItems.push(Ext.create('Ext.button.Button', action));
        
        me.items = toolbarItems;        
        me.callParent(arguments);
    },
           
    /*
     * private
     */
    bindBaseLayer: function(menuItem, layer){
        layer.events.register('visibilitychanged', layer, function(e){
            menuItem.setChecked(e.object.getVisibility());
        });
    },
    
    activateNavigation: function(){
        var me = this;
        me.navigationBtn.toggle();
    },

    /*
     * private
     */
    createBaseLayerMenu: function(){
        var me = this;

        var buttonGroup = {
            xtype: 'buttongroup',
            title: '地圖切換',
            columns: 3,
            padding: 2,
            defaults: {
                width: 85,
                height: 75,
                margin: 2,
                iconAlign: 'top',
                buttonAlign: 'center',
                allowDepress: false,
                toggleGroup: 'baseLayer'
            },
            items: []
        };

        for(var i=0 ; i<me.baseLayers.length ; i++){
            var layer = me.baseLayers[i];
            var layerName = layer.shortName || layer.name;
            var button = {
                iconCls: "baseLayer_" + layer.type,
                layer: layer,
                html:'<span class="baseLayerBtn">' + layerName + '</span>',
                tooltip: layer.qtip,
                pressed: layer.getVisibility()
            };
            buttonGroup.items.push(button);
        }

        var menu = {
            plain: true,
            items: buttonGroup
        };

        return menu;
    },
    /*
     * private
     */
    createBufferTool: function(map){
        var me = this;
        var action;
        var olMap = map.map;

        var bufferControls = {
            point: new OpenLayers.Control.DrawFeature(map.bufferMarkLayer, OpenLayers.Handler.Point),
            circle: new OpenLayers.Control.DrawFeature(map.bufferMarkLayer, OpenLayers.Handler.RegularPolygon, {
                handlerOptions: {
                    sides: 40, irregular: false
                }
            }),
            line: new OpenLayers.Control.DrawFeature(map.bufferMarkLayer, OpenLayers.Handler.Path),
            rectangle: new OpenLayers.Control.DrawFeature(map.bufferMarkLayer, OpenLayers.Handler.RegularPolygon, {
                handlerOptions: {
                    sides: 4, irregular: true
                }
            }),
            polygon: new OpenLayers.Control.DrawFeature(map.bufferMarkLayer, OpenLayers.Handler.Polygon),
            drag: new OpenLayers.Control.DragFeature(map.bufferMarkLayer),
            select: new OpenLayers.Control.SelectFeature(map.bufferMarkLayer,{
                clickout: false,
                toggle: true,
                multiple: true,
                hover: false,
                box: true
                //toggleKey: "ctrlKey", // ctrl key removes from selection
                //multipleKey: "shiftKey" // shift key adds to selection
            })
        };

        var buttonGroup = {
            xtype: 'buttongroup',
            title: '環域分析工具',
            columns: 5,
            padding: 2,
            defaults: {
                width: 60,
                margin: 2,
                allowDepress: false
            },
            items: []
        };

        // Select Feature
        action = Ext.create('GeoExt.Action', {
            control: bufferControls.select,
            iconCls: "toolbar_EnvSelect",
            map: olMap,
            text: "選取",
            tooltip: "選取環域圖徵",
            // button options
            toggleGroup: "mapToolbarButtons",
            allowDepress: false
        });
        buttonGroup.items.push(Ext.create('Ext.button.Button', action));

        // Drag Feature
        action = Ext.create('GeoExt.Action', {
            control: bufferControls.drag,
            iconCls: "toolbar_EnvDrag",
            map: olMap,
            text: "拖曳",
            tooltip: "拖曳環域圖徵",
            // button options
            toggleGroup: "mapToolbarButtons",
            allowDepress: false
        });
        buttonGroup.items.push(Ext.create('Ext.button.Button', action));

        // delete Feature
        action = Ext.create('GeoExt.Action', {
            iconCls: "toolbar_EnvDelete",
            map: olMap,
            text: "刪除",
            tooltip: "刪除所選取的環域圖徵",
            // button options
            allowDepress: false,
            handler: function(){
                if(map.bufferMarkLayer.selectedFeatures.length > 0){
                    map.bufferMarkLayer.destroyFeatures(map.bufferMarkLayer.selectedFeatures);
                }
            }
        });
        buttonGroup.items.push(Ext.create('Ext.button.Button', action));

        // 畫點
        action = Ext.create('GeoExt.Action', {
            control: bufferControls.point,
            iconCls: "toolbar_EnvDrawPoint",
            map: olMap,
            text: "點",
            tooltip: "畫點狀環域圖徵",
            // button options
            toggleGroup: "mapToolbarButtons",
            allowDepress: false
        });
        buttonGroup.items.push(Ext.create('Ext.button.Button', action));

        // 畫圓
        action = Ext.create('GeoExt.Action', {
            control: bufferControls.circle,
            iconCls: "toolbar_EnvDrawCircle",
            map: olMap,
            text: "圓",
            tooltip: "畫圓環域圖徵",
            // button options
            toggleGroup: "mapToolbarButtons",
            allowDepress: false
        });
        buttonGroup.items.push(Ext.create('Ext.button.Button', action));

        // 畫線
        action = Ext.create('GeoExt.Action', {
            control: bufferControls.line,
            iconCls: "toolbar_EnvDrawPolyline",
            map: olMap,
            text: "線",
            tooltip: "畫線狀環域圖徵",
            // button options
            toggleGroup: "mapToolbarButtons",
            allowDepress: false
        });
        buttonGroup.items.push(Ext.create('Ext.button.Button', action));

        // 矩形
        action = Ext.create('GeoExt.Action', {
            control: bufferControls.rectangle,
            iconCls: "toolbar_EnvDrawRectangle",
            map: olMap,
            text: "矩形",
            tooltip: "畫矩形環域圖徵",
            // button options
            toggleGroup: "mapToolbarButtons",
            allowDepress: false
        });
        buttonGroup.items.push(Ext.create('Ext.button.Button', action));

        // 畫多邊形
        action = Ext.create('GeoExt.Action', {
            control: bufferControls.polygon,
            iconCls: "toolbar_EnvDrawPolygon",
            map: olMap,
            text: "面",
            tooltip: "畫面狀環域圖徵",
            // button options
            toggleGroup: "mapToolbarButtons",
            allowDepress: false
        });
        buttonGroup.items.push(Ext.create('Ext.button.Button', action));

        // 清除
        action = Ext.create('GeoExt.Action', {
            iconCls: "toolbar_EnvEraser",
            map: olMap,
            text: "清除",
            tooltip: "清除所有環域圖徵",
            // button options
            allowDepress: false,
            handler: function(){
                map.clearBufferMark();
                map.clearBuffer();
            }
        });
        buttonGroup.items.push(Ext.create('Ext.button.Button', action));

        var menu = {
            plain: true,
            items: buttonGroup
        };

        return menu;
    }
});