Ext.define('WEGIS.ux.app.MainMenu', {
    extend: 'Ext.toolbar.Toolbar',
    alias: 'widget.wx_mapMainMenu',
    
    layout: {
        overflowHandler: 'Scroller'
    },
    
    defaults: {
        scale: 'small',
        iconAlign: 'top'
    },

    permission: null,

    constructor : function(config){
        var me = this;

        me.initConfig(config);
        me.callParent(arguments);
    },
    
    initComponent : function(){
        var me = this;

        var layerBtn = {
            action: 'toggleLayerList',
            glyph: 0xf0c9,
            text: '圖層清單'
        };
        
        var addLayerBtn = {
            action: 'openAddLayerWindow',
            glyph: 0xf067,
            text: '加入圖層'
        };
        
        var locateBtn = {
            id: 'mainMenuLocateBtn',
            action: 'openLocateWindow',
            glyph: 0xf041,
            text: '定位工具'
        };
        
        var routingBtn = {
            action: 'openRoutingWindow',
            glyph: 0xf1b9,
            text: '路徑規劃'
        };

        var orgQueryBtn = {
            action: 'openOrgQueryWindow',
            glyph: 0xf0f7,
            text: '機構查詢'
        };
        
        me.items = [
            layerBtn, addLayerBtn, '-',
            locateBtn, routingBtn, '-',
            orgQueryBtn
        ];
        
        me.callParent(arguments);
    }
});