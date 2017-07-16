Ext.define('WEGIS.view.org.MainWindow', {
    extend: 'Ext.window.Window',
    alias: 'widget.wx_orgMainWindow',
    id: 'orgMainWindow',

    requires: [
        'WEGIS.view.org.Query'
    ],

    title: '單位查詢',
    layout: 'fit',
    glyph: 0xf0f7,
    border: false,
    collapsible: true,
    minimizable: true,
    constrainHeader: true,
    resizable: true,
    width: 330,
    height: 550,
    minWidth: 330,
    minHeight: 550,

    config: {
        originWidth: null
    },

    initComponent : function(){
        var me = this;

        me.map = WEGIS.map.Map;

        var query = {
            xtype: 'wx_orgQuery'
        };

        //var tabPanel = {
        //    xtype: 'tabpanel',
        //    layout: 'fit',
        //    defaults: {
        //        bodyPadding: 5
        //    },
        //    items: [
        //        query, buffer
        //    ]
        //};

        var removeBtn = {
            xtype: 'button',
            itemId: 'winBtnClear',
            action: 'clear',
            text: '清除查詢結果',
            glyph: 0xf12d
        };

        var closeBtn = {
            xtype: 'button',
            itemId: 'winBtnClose',
            action: 'close',
            text: '關閉',
            glyph: 0xf00d
        };

        me.items = [query];
        me.buttons = [removeBtn, closeBtn];

        me.callParent(arguments);
    }

});