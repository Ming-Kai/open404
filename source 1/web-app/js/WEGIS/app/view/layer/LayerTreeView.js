Ext.define('WEGIS.view.layer.LayerTreeView', {
    extend: 'GeoExt.tree.Panel',
    alias: 'widget.wx_layerTreeView',
    
    requires: [
        'GeoExt.tree.LayerContainer',
        'GeoExt.tree.OverlayLayerContainer',
        'GeoExt.tree.BaseLayerContainer',
        'GeoExt.data.LayerTreeModel'
    ],
        
    id: 'LayerTreeView',
    border: false,
    rootVisible: false,
    lines: false,

    initComponent : function(){
        var me = this;
        
        //var baseLayers = {
        //    text: "地圖",
        //    iconCls: "layer_BaseLayers",
        //    expanded: true,
        //    children: []
        //};
        
        var overlayLayers = {
            text: "行政區界圖",
            iconCls: "layer_OverlayLayers",
            expanded: true,
            children: []
        };

        var orgLayers = {
            text: "單位",
            iconCls: "layer_OverlayLayers",
            expanded: true,
            children: []
        };
        
        // 地圖
//        for(var i=0 ; i<WEGIS.map.Map.baseLayers.length ; i++){
//            var layer = WEGIS.map.Map.baseLayers[i];
//            baseLayers.children.push({
//                plugins: [{ptype: 'gx_layer'}],
//                iconCls: "layer_Map",
//                checkedGroup: 'baselayer',
//                layer: layer,
//                text: layer.name,
//                qtip: layer.qtip,
//                leaf: true
//            });
//        }
        
        // 主題圖層
        for(var i=0 ; i<WEGIS.map.Map.overlayLayers.length ; i++){
            var layer = WEGIS.map.Map.overlayLayers[i];
            overlayLayers.children.push({
                plugins: [{ptype: 'gx_layer'}],
                iconCls: me.getLayerIconCls(layer.GEOTYPE),
                layer: layer,
                text: layer.name,
                qtip: layer.qtip,
                leaf: true
            });
        }

        // 機構圖層
        for(var i=0 ; i<WEGIS.map.Map.orgLayers.length ; i++){
            var layer = WEGIS.map.Map.orgLayers[i];
            orgLayers.children.push({
                plugins: [{ptype: 'gx_layer'}],
                iconCls: layer.ICONCLS,
                layer: layer,
                text: layer.name,
                qtip: layer.qtip,
                leaf: true
            });
        }
        
        var store = Ext.create('Ext.data.TreeStore', {
            model: 'GeoExt.data.LayerTreeModel',
            root: {
                expanded: true,
                children: []
            }
        });
        
        //if(baseLayers.children.length > 0){
        //    store.getRootNode().appendChild(baseLayers);
        //}
        
        if(overlayLayers.children.length > 0){
            store.getRootNode().appendChild(overlayLayers);
        }

        if(orgLayers.children.length > 0){
            store.getRootNode().appendChild(orgLayers);
        }

        me.store = store;
        
        me.callParent(arguments);
    },

    getLayerIconCls: function(geotype){
        var iconCls = '';

        switch(geotype){
            case 'polygon':
                iconCls = 'layer_Polygon';
                break;
            case 'line':
                iconCls = 'layer_Line';
                break;
            case 'point':
                iconCls = 'layer_Point';
                break;
            case 'vector':
                break;
            case 'grid':
                break;
            default:
                break;
        }

        return iconCls;
    }
});