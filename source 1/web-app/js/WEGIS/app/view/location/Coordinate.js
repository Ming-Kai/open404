Ext.define('WEGIS.view.location.Coordinate', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.wx_locCoordinate',
    
    title: '座標',
    layout: 'form',
    autoScroll: true,
//    glyph: 0xf276,
    
    initComponent : function(){
        var me = this;
        
        var data = [
            {text: "經緯度座標系", value: 1},
            {text: "TWD97二度分帶座標系", value: 2},
            {text: "TWD67二度分帶座標系", value: 3}
        ];
        
        var store = Ext.create('Ext.data.Store', {
            autoDestroy: true,
            fields: [
                {type: 'string', name: 'text'},
                {type: 'int', name: 'value'}
            ],
            data: data
        });
        
        var comboCoordinate = {
            xtype : 'combo',
            itemId: 'coordinate',
            name: 'type',
            fieldLabel : '座標系',
            matchFieldWidth: true,
            store: store,
            queryMode: 'local',
            displayField: 'text',
            valueField: 'value',
            editable: false,
            emptyText: '請選擇座標系',
            value: 1
        };
        
        var numberfieldX = {
            xtype: 'numberfield',
            name: 'x',
            fieldLabel: '經度X',
            allowBlank: false,  // requires a non-empty value
            minValue: -180,        // prevents negative numbers
            maxValue: 180, 
            decimalPrecision: 5,
            // Remove spinner buttons, and arrow key and mouse wheel listeners
            hideTrigger: true,
            keyNavEnabled: false,
            mouseWheelEnabled: false,
            msgTarget: 'under'
        };
        
        var numberfieldY = {
            xtype: 'numberfield',
            name: 'y',
            fieldLabel: '緯度Y',
            allowBlank: false,  // requires a non-empty value
            minValue: -90,        // prevents negative numbers
            maxValue: 90, 
            decimalPrecision: 5,
            // Remove spinner buttons, and arrow key and mouse wheel listeners
            hideTrigger: true,
            keyNavEnabled: false,
            mouseWheelEnabled: false,
            msgTarget: 'under'
        };
        
        var buttonLocate = {
            xtype: 'button',
            action: 'locate',
            text: '座標定位',
            glyph: 0xf041
        };
        
        var buttonClear = {
            xtype: 'button',
            action: 'clear',
            text: '清除座標',
            glyph: 0xf12d
        };
        
        var form = {
            xtype: 'form',
            border: false,
            bodyBorder: false,
            defaults: {
                anchor: '100%',
                labelWidth: 50,
                labelAlign : 'right'
            },
            items: [comboCoordinate, numberfieldX, numberfieldY],
            bbar: ['->', buttonClear, buttonLocate]
        };
        
        me.items = [form];
        
        me.callParent(arguments);
    }
});