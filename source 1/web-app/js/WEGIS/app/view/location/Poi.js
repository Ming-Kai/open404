Ext.define('WEGIS.view.location.Poi', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.wx_locPoi',

    title: '地標',
    autoScroll: true,
    //collapsed: true,
//    glyph: 0xf015,

    initComponent : function(){
        var me = this;

        var textfieldAddress = {
            xtype: 'textfield',
            name: 'poiName',
            fieldLabel: '地標名稱',
            allowBlank: false,
            emptyText: '內政部'
        };

        var buttonQuery = {
            xtype: 'button',
            action: 'query',
            text: '地標查詢',
            glyph: 0xf002
        };

        var buttonClear = {
            xtype: 'button',
            action: 'clear',
            text: '清除地標',
            glyph: 0xf12d
        };

        var store = Ext.create('Ext.data.Store', {
            autoDestroy: true,
            fields: [
                {type: 'string', name: 'num'},
                {type: 'string', name: 'poiName'},
                {type: 'string', name: 'county'},
                {type: 'string', name: 'town'},
                {type: 'number', name: 'x'},
                {type: 'number', name: 'y'}
            ]
        });

        var columns = [{
            header: '',
            dataIndex: 'num',
            width: 45,
            hideable: false
        },{
            header: '縣市',
            dataIndex: 'county',
            width: 60,
            hideable: false
        },{
            header: '行政區',
            dataIndex: 'town',
            width: 75,
            hideable: false
        },{
            header: '地標名稱',
            dataIndex: 'poiName',
            flex: 1,
            hideable: false
        }];

        var comboPage = {
            xtype: 'combo',
            itemId: 'pages',
            width: 100,
            fieldLabel: '頁數',
            matchFieldWidth: true,
            queryMode: 'local',
            displayField: 'text',
            valueField: 'value',
            editable: false,
            store: Ext.create('Ext.data.Store', {
                autoDestroy: true,
                fields: [
                    {type: 'string', name: 'text'},
                    {type: 'int', name: 'value'}
                ]
            })
        };

        var resultGrid = {
            xtype: 'grid',
            itemId: 'poiGrid',
            height: 270,
            autoScroll: true,
            columns: columns,
            store: store,
            viewConfig: {
                deferEmptyText: true,
                emptyText: '無查詢結果'
            },
            plugins: [
                'bufferedrenderer'
            ]
        };

        var fieldset = {
            xtype: 'fieldset',
            itemId: 'resultFS',
            title: '查詢結果',
            layout: 'anchor',
            style: 'padding: 5px',
            //bodyStyle: 'padding: 10px',
            defaults: {
                labelWidth: 40,
                labelAlign: 'right'
            },
            items: [comboPage, resultGrid]
        };

        var form = {
            xtype: 'form',
            border: false,
            bodyBorder: false,
            defaults: {
                anchor: '100%',
                labelWidth: 60,
                labelAlign : 'right',
                msgTarget: 'under'
            },
            items: [textfieldAddress],
            bbar: ['->', buttonClear, buttonQuery]
        };

        me.items = [form, fieldset];

        me.callParent(arguments);
    }
});