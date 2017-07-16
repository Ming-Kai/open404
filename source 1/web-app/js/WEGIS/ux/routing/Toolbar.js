Ext.define('WEGIS.ux.routing.Toolbar', {
    extend: 'Ext.toolbar.Toolbar',
    alias: 'widget.wx_routingToolbar',
    
    config: {
        olMap: null,
        routingLocLayer: null
    },
    
    isActive: false,
      
    initComponent : function(){
        var me = this;
        
        var action, toolbarItems = [];
        var drawControls = {
            point: new OpenLayers.Control.DrawFeature(me.routingLocLayer, OpenLayers.Handler.Point),
            drag: new OpenLayers.Control.DragFeature(me.routingLocLayer, {
                onComplete: function(feature, pixel){
                    me.fireEvent('dragComplete', me.routingLocLayer, feature, pixel);
                }
            }),
            select: new OpenLayers.Control.SelectFeature(me.routingLocLayer, {
                clickout: false,
                toggle: true,
                multiple: true,
                hover: false,
                box: true
                //toggleKey: "ctrlKey", // ctrl key removes from selection
                //multipleKey: "shiftKey" // shift key adds to selection
            })
        };

        // Select Feature
        action = Ext.create('GeoExt.Action', {
            control: drawControls.select,
            //glyph: 0xf245,
            iconCls: "toolbar_EnvSelect",
            map: me.olMap,
            text: "選取",
            tooltip: "選取目的地",
            // button options
            toggleGroup: "mapToolbarButtons",
            allowDepress: false
        });
        toolbarItems.push(Ext.create('Ext.button.Button', action));
        //gActions.envSelectFeature = action;

        // Drag Feature
        action = Ext.create('GeoExt.Action', {
            control: drawControls.drag,
            //glyph: 0xf047,
            iconCls: "toolbar_EnvDrag",
            map: me.olMap,
            text: "拖曳",
            tooltip: "拖曳目的地",
            // button options
            toggleGroup: "mapToolbarButtons",
            allowDepress: false
        });
        toolbarItems.push(Ext.create('Ext.button.Button', action));
        //gActions.envDragFeature = action;

        // delete Feature
        action = Ext.create('GeoExt.Action', {
            action: 'delete',
            //glyph: 0xf1f8,
            iconCls: "toolbar_EnvDelete",
            map: me.olMap,
            text: "刪除",
            tooltip: "刪除所選取的目的地",
            // button options
            allowDepress: false,
            handler: function(){
                //gMap.ClearRoutingLocationLayerSelectedFeatures();            
                //RefreshGrid(gRoutingLocationLayer, grid);
            }
        });
        toolbarItems.push(Ext.create('Ext.button.Button', action));
        //gActions.envDeleteFeature = action;

        // 清除
        action = Ext.create('GeoExt.Action', {
            action: 'deleteAll',
            //glyph: 0xf12d,
            iconCls: "toolbar_EnvEraser",
            map: me.olMap,
            text: "清除",
            tooltip: "清除所有目的地",
            // button options
            allowDepress: false,
            handler: function(){
                //gMap.ClearRoutingLocationLayerFeatures();            
            }
        });
        toolbarItems.push(Ext.create('Ext.button.Button', action));
        //gActions.envClearFeature = action;
        
        me.items = toolbarItems;
        
        me.listeners = {
            beforedestroy: function(){                
                for (var k in drawControls){
                    if (drawControls.hasOwnProperty(k)) {
                        if(drawControls[k].active){
                            me.isActive = true;
                            drawControls[k].deactivate();
                            break;
                        }                        
                    }
                }
            }
        },
               
        me.callParent(arguments);
    }
});