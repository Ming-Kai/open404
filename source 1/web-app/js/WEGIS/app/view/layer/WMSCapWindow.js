Ext.define('WEGIS.view.layer.WMSCapWindow', {
    extend: 'Ext.window.Window',
    alias: 'widget.wx_WMSCapWindow',
    
    requires:[
        'GeoExt.data.reader.WmsCapabilities',
        'GeoExt.data.WmsCapabilitiesLayerStore',
        'GeoExt.panel.Map'
    ],
    
    title: '加入WMS圖層',
    layout: 'fit',
    glyph: 0xf067,
    width: 650,
    height: 300,
    minWidth: 650,
    minHeight: 300,
    autoScroll: true,
    border: false,
    closeAction: 'hide',
    constrainHeader: true,
    modal: true,
    
    tools: [
        {
            type: 'help',
            tooltip: '說明'
        }
    ],
    
    initComponent : function(){
        var me = this;
        
        // create a new WMS capabilities store
        var store = Ext.create('GeoExt.data.WmsCapabilitiesStore', {
            storeId: 'wmscapsStore',
            //url: "../js/xml/wmscap.xml",
            //url: "https://geoext.github.io/geoext2/examples/data/wmscap.xml",
            autoDestroy: true,
            autoLoad: false
        });
        
        var columns = [
            {
                xtype: 'actioncolumn',
                header: '預覽',
                align: 'center',
                width: 50,
                hideable: false,
                menuDisabled: true,
                resizable: false,
                sortable: false,
                stopSelection: false,
                items: [{
                    icon: '../images/WEGIS/previewlayer.png',
                    tooltip: '預覽圖層',
                    action: 'preview',
                    handler: function(grid, rowIndex, colIndex, item, e, record, row) {
                        this.fireEvent('actioncolumnitemclick', grid, rowIndex, colIndex, item, e, record, row);
                    }
                }]
            },
            {header: "標題", dataIndex: "title", sortable: true},
            {header: "名稱", dataIndex: "name", sortable: true},
            {header: "描述", dataIndex: "abstract", flex: 1}
        ];
        
        var tbar = [
            'WMS URL:', {
                xtype: 'textfield',
                name: 'wmsUrl',
                value: 'http://maps.wra.gov.tw/ArcGIS/services/WMS/APLayer_WMS_E/MapServer/WMSServer',
                //xtype: 'combo',
                //name : 'wmsUrl',
                //width: 70,
                //store: {
                //    fields: ['name', 'value'],
                //    data : [
                //        {"name":"經濟部水利署水文水資源資料", "value":"http://maps.wra.gov.tw/ArcGIS/services/WMS/APLayer_WMS_E/MapServer/WMSServer"},
                //        {"name":"全台灣村里界圖", "value":"http://ogcmap.tgos.nat.gov.tw/33682/SimpleWMS.aspx"}
                //    ]
                //},
                //queryMode: 'local',
                //displayField: 'name',
                //valueField: 'value',
                //editable: false,
                flex: 1                
            },{
                xtype: 'combo',
                name : 'wmsVer',
                width: 70,
                store: {
                    fields: ['name', 'value'],
                    data : [
                        {"name":"1.1.1", "value":"1.1.1"},
                        {"name":"1.3.0", "value":"1.3.0"}
                    ] 
                },
                queryMode: 'local',
                displayField: 'name',
                valueField: 'value',
                value: '1.1.1'
            },{
                xtype : 'button',
                action: 'load',
                text: '讀取資訊',
                glyph: 0xf021
            }            
        ];
        
        // create a grid to display records from the store
        var grid = {
            xtype: 'grid',
            autoScroll: true,
            store: store,
            columns: columns,
            tbar: tbar
        };
        
        me.items = [grid];
        
        var addButton = {
            xtype: 'button',
            action: 'add',
            text: '加入',
            glyph: 0xf067
        };
        
        var closeButton = {
            xtype: 'button',
            action: 'close',
            text: '關閉',
            glyph: 0xf00d
        };
        
        me.buttons = [addButton, closeButton];
        
        me.callParent(arguments);
    }
});