Ext.define('WEGIS.view.routing.ResultWindow', {
    extend: 'Ext.window.Window',
    alias: 'widget.wx_routingResultWindow',
    id: 'routingResultWindow',

    layout: 'border',
    title: '路徑規劃結果',
    glyph: 0xf018,
    border: false,
    closeAction: 'hide',
    width: 1000,
    height: 600,
    minWidth: 1000,
    minHeight: 600,
    maximizable: true,
    resizable: true,
    constrainHeader: true,
    modal: true,

    initComponent : function(){
        var me = this;

        var gmappanel = {
            region: 'center',
            xtype: 'gmappanel',
            center: {
                geoCodeAddr: '嘉義市'
            }
        };

        var resultPanel = {
            region: 'east',
            xtype: 'panel',
            width: 300,
            autoScroll: true,
            html: '<div id="directions_results" style="padding: 5px;"></div>'
        };

        me.items = [gmappanel, resultPanel];

        me.callParent(arguments);
    }

});