Ext.define('WEGIS.view.routing.MainWindow', {
    extend: 'Ext.window.Window',
    alias: 'widget.wx_routingWindow',
    id: 'routingWindow',
    
    requires: [
        'WEGIS.ux.routing.Toolbar'
    ],
    
    title: '路徑規劃',
    glyph: 0xf1b9,
    border: false,
    collapsible: true,
    minimizable: true,
    constrainHeader: true,
    resizable: true,
    width: 330,
    height: 600,
    minWidth: 330,
    minHeight: 600,
    bodyPadding: 5,

    layout: 'fit',
    
    config: {
        olMap: null,
        routingLocLayer: null
    },
    
    initComponent : function(){
        var me = this;

        var info = {
            xtype: 'container',
            html: '<div class="ui red message" style="margin-bottom: 5px;">' +
            '<ul class="list">' +
            '<li>路徑規劃功能由Google map api提供。</li>' +
            '<li>必經點數量上限為8個。</li>' +
            '</ul>' +
            '</div>'
        };

        var optWaypointsStore = Ext.create('Ext.data.Store', {
            autoDestroy: true,
            fields: [
                {type: 'string', name: 'text'},
                {type: 'int', name: 'value'}
            ],
            data: [
                {text: "最佳路徑", value: 1},
                {text: "最短路徑", value: 2}
            ]
        });

        var comboOptWaypoints = {
            xtype : 'combo',
            name: 'optWaypoints',
            fieldLabel : '路徑規劃模式',
            allowBlank: false,
            matchFieldWidth: true,
            store: optWaypointsStore,
            queryMode: 'local',
            displayField: 'text',
            valueField: 'value',
            editable: false,
            emptyText: '請選擇路徑規劃模式',
            value: 1
        };

        var travelModeStore = Ext.create('Ext.data.Store', {
            autoDestroy: true,
            fields: [
                {type: 'string', name: 'text'},
                {type: 'int', name: 'value'}
            ],
            data: [
                {text: "開車", value: 1},
                {text: "大眾運輸", value: 3},
                {text: "步行", value: 4}
            ]
        });

        var comboTravelMode = {
            xtype : 'combo',
            name: 'travelMode',
            fieldLabel : '交通模式',
            allowBlank: false,
            matchFieldWidth: true,
            store: travelModeStore,
            queryMode: 'local',
            displayField: 'text',
            valueField: 'value',
            editable: false,
            emptyText: '請選擇交通模式',
            value: 1
        };

        var routeBtn = {
            text: '路徑規劃',
            itemId: 'winBtnRoute',
            action: 'route',
            glyph: 0xf1b9
        };

        var tplPanel = {
            xtype: 'panel',
            itemId: 'tplp',
            anchor: '100%',
            border: false,
            html: '<div id="routingDataTplDiv" style="padding: 5px;"></div>'
        };

        var form = {
            xtype: 'form',
            autoScroll: true,
            border: false,
            bodyBorder: false,
            defaults: {
                anchor: '100%',
                labelWidth: 85,
                labelAlign : 'right'
            },
            items: [info, comboTravelMode, comboOptWaypoints, tplPanel],
            bbar: ['->', routeBtn]
        };

        me.tbar = {
            xtype: 'wx_routingToolbar',
            olMap: me.olMap,
            routingLocLayer: me.routingLocLayer
        };

        var clearBtn = {
            text: '清除路徑規劃',
            itemId: 'winBtnClear',
            action: 'clear',
            glyph: 0xf12d
        };

        
        var closeBtn = {
            text: '關閉',
            itemId: 'winBtnClose',
            action: 'close',
            glyph: 0xf00d
        };

        me.items = [form];
        me.buttons = [clearBtn, closeBtn];
        
        me.callParent(arguments);
    }

});