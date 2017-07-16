Ext.define('WEGIS.view.location.Road', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.wx_locRoad',

    title: '道路',
    autoScroll: true,
//    glyph: 0xf018,

    initComponent : function(){
        var me = this;

        var textfieldAddress = {
            xtype: 'textfield',
            name: 'road',
            fieldLabel: '道路名稱',
            allowBlank: false,
            emptyText: '臺北市徐州路',
            msgTarget: 'under'
        };

        var buttonQuery = {
            xtype: 'button',
            action: 'query',
            text: '道路查詢',
            glyph: 0xf002
        };

        var buttonClear = {
            xtype: 'button',
            action: 'clear',
            text: '清除道路名稱',
            glyph: 0xf12d
        };

        var store = Ext.create('Ext.data.Store', {
            autoDestroy: true,
            fields: [
                {type: 'string', name: 'num'},
                {type: 'string', name: 'roadName'},
                {type: 'number', name: 'x'},
                {type: 'number', name: 'y'},
                {type: 'string', name: 'viewport'}
            ]
        });

        var columns = [
            {
                header: '',
                dataIndex: 'num',
                width: 50,
                hideable: false
            },
            {
                header: '道路名稱',
                dataIndex: 'roadName',
                flex: 1,
                hideable: false
            }
        ];

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
            itemId: 'roadGrid',
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
                labelAlign : 'right'
            },
            items: [textfieldAddress],
            bbar: ['->', buttonClear, buttonQuery]
        };

        me.items = [form, fieldset];

        me.callParent(arguments);
    }
});