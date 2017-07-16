Ext.define('WEGIS.view.location.District', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.wx_locDistrict',
    
    itemId: 'locDistrictPanel',
    title: '行政區',
    autoScroll: true,
//    glyph: 0xf0c8,
    
    initComponent : function(){
        var me = this;

        var comboCounty = {
            xtype : 'combo',
            itemId: 'county',
            name: 'county',
            fieldLabel : '縣市',
            matchFieldWidth: true,
            labelAlign : 'right',
            store: Ext.create('WEGIS.store.County'),
            displayField: 'cntname',
            valueField: 'cntcode',
            editable: false,
            emptyText: '請選擇縣市',
            listConfig: {
                loadingText: '讀取中'
            }
        };
        
        var comboTownship = {
            xtype : 'combo',
            itemId: 'township',
            name: 'township',
            fieldLabel : '鄉鎮市區',
            disabled: true,
            matchFieldWidth: true,
            labelAlign : 'right',
            store: Ext.create('WEGIS.store.Townships'),
            queryMode: 'local',
            displayField: 'twnspname',
            valueField: 'twnspcode',
            editable: false,
            emptyText: '請選擇鄉鎮市區',
            listConfig: {
                loadingText: '讀取中'
            }            
        };
        
        var comboVillage = {
            xtype : 'combo',
            itemId: 'village',
            name: 'village',
            fieldLabel : '村里',
            disabled: true,
            matchFieldWidth: true,
            labelAlign : 'right',
            store: Ext.create('WEGIS.store.Villages'),
            queryMode: 'local',
            displayField: 'vilgname',
            valueField: 'vilgcode',
            editable: false,
            emptyText: '請選擇村里',
            listConfig: {                
                loadingText: '讀取中'
            }
        };
        
        var buttonLocate = {
            xtype: 'button',
            action: 'locate',
            text: '定位',
            glyph: 0xf041
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
            items: [comboCounty, comboTownship, comboVillage],
            bbar: ['->', buttonLocate]
        };
        
        me.items = [form];
        
        me.callParent(arguments);
    }
});