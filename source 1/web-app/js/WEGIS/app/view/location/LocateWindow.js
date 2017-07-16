Ext.define('WEGIS.view.location.LocateWindow', {
    extend: 'Ext.window.Window',
    alias: 'widget.wx_locateWindow',
    id: 'locateWindow',

    requires: [
        'WEGIS.view.location.Address',
        'WEGIS.view.location.Coordinate',
        'WEGIS.view.location.District',
        'WEGIS.view.location.Poi',
        'WEGIS.view.location.Road'
    ],

    title: '定位工具',
    layout: 'fit',
    glyph: 0xf041,
    border: false,
    collapsible: true,
    minimizable: true,
    constrainHeader: true,
    resizable: true,
    width: 370,
    height: 550,
    minWidth: 370,
    minHeight: 550,

    config: {
        originWidth: null
    },

    initComponent : function(){
        var me = this;

        me.map = WEGIS.map.Map;

        var locDistrict = {
            xtype: 'wx_locDistrict'
        };

        var locAddress = {
            xtype: 'wx_locAddress'
        };

        var locRoad = {
            xtype: 'wx_locRoad'
        };

        var locPoi = {
            xtype: 'wx_locPoi'
        };

        var locCoodinate = {
            xtype: 'wx_locCoordinate'
        };

        var tabPanel = {
            xtype: 'tabpanel',
            layout: 'fit',
            defaults: {
                bodyPadding: 8
            },
            items: [
                locDistrict,
                locAddress,
                locRoad,
                locPoi,
                locCoodinate
            ]
        };

        var removeBtn = {
            xtype: 'button',
            itemId: 'winBtnClearLocate',
            action: 'removeLocateMark',
            text: '清除定位標示',
            glyph: 0xf12d
        };

        var closeBtn = {
            xtype: 'button',
            itemId: 'winBtnClose',
            action: 'close',
            text: '關閉',
            glyph: 0xf00d
        };

        me.items = [tabPanel];
        me.buttons = [removeBtn, closeBtn];

        me.callParent(arguments);
    }

});