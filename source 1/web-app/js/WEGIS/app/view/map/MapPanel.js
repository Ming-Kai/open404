Ext.define('WEGIS.view.map.MapPanel', {
    extend: 'GeoExt.panel.Map',
    alias: 'widget.wx_mapPanel',
    
    requires: [
        'GeoExt.panel.Map',
        'WEGIS.ux.map.Toolbar'
    ],
    
    id: 'mapPanel',
    itemId: 'mapPanel',
    margins: '0 2 2 2',

    config: {
        wMap: null,
        map: null
    },
    
    initComponent : function(){
        var me = this;
        
        var bottomBar = {
            id: 'mapBbar',
            xtype: 'toolbar',
            dock: 'bottom',
            height: 25,
            items: [
                {id: "scaleText", xtype:"tbtext", text: ""},
                '->', 
                {id: "mousePositionWGS84", xtype:"tbtext", text: ""}, 
                {id: "mousePositionTWD97", xtype:"tbtext", text: ""}
            ]
        };

        var baseLayers = WEGIS.map.Map.baseLayers;
        var topBar = {
            xtype: 'wx_mapToolbar',
            dock: 'top',
            map: me.wMap,
            baseLayers: baseLayers
        };

        me.dockedItems = [
            topBar, bottomBar
        ];
        
        me.callParent(arguments);
    }
});