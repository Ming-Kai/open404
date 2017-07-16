Ext.define('WEGIS.view.location.Address', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.wx_locAddress',

    title: '地址',
    autoScroll: true,
    //collapsed: true,
//    glyph: 0xf015,

    initComponent : function(){
        var me = this;

        var textfieldAddress = {
            xtype: 'textfield',
            name: 'address',
            fieldLabel: '地址',
            allowBlank: false,
            emptyText: '臺北市中正區徐州路5號',
            msgTarget: 'under'
        };

        var buttonQuery = {
            xtype: 'button',
            action: 'query',
            text: '地址查詢',
            glyph: 0xf002
        };

        var buttonClear = {
            xtype: 'button',
            action: 'clear',
            text: '清除地址',
            glyph: 0xf12d
        };

        var store = Ext.create('Ext.data.Store', {
            autoDestroy: true,
            fields: [
                {type: 'string', name: 'address'},
                {type: 'number', name: 'x'},
                {type: 'number', name: 'y'}
            ]
        });

        var columns = [{
                header: '地址',
                dataIndex: 'address',
                flex: 1,
                hideable: false
            }
        ];

        var resultGrid = {
            xtype: 'grid',
            itemId: 'addressGrid',
            height: 300,
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
            items: [resultGrid]
        };

        var form = {
            xtype: 'form',
            border: false,
            bodyBorder: false,
            defaults: {
                anchor: '100%',
                labelWidth: 30,
                labelAlign : 'right'
            },
            items: [textfieldAddress],
            bbar: ['->', buttonClear, buttonQuery]
        };

        me.items = [form, fieldset];

        me.callParent(arguments);
    }
});