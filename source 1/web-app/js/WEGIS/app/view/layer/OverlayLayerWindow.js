Ext.define('WEGIS.view.layer.OverlayLayerWindow', {
    extend: 'Ext.window.Window',
    alias: 'widget.wx_overlayLayerWindow',
    
    title: '圖層管理',
    layout: 'fit',    
    width: 320,
    height: 300,
    minWidth: 320,
    minHeight: 300,
    border: false,
    closeAction: 'hide',
    collapsible: true,
    constrainHeader: true,
    resizable: true,

    tools: [
        {
            type: 'help',
            tooltip: '說明'
        }
    ],
    
    initComponent : function(){
        var me = this;
        
        var cellEditing = new Ext.grid.plugin.CellEditing({
            clicksToEdit: 1
        });
        
        var columns = [
            {
                xtype: 'checkcolumn',
                dataIndex: 'check',
                align: 'center',
                width: 30,
                hideable: false,
                sortable: false,
                menuDisabled: true,
                resizable: false
            },{
                header: '圖層名稱',  
                dataIndex: 'name',  
                flex: 1,
                hideable: false,
                sortable: false,
                menuDisabled: true
            },{
                header: '透明度',
                dataIndex: 'opacity',
                align: 'center',
                width: 65,
                hideable: false,
                sortable: false,
                menuDisabled: true,
                renderer: function(value) {
                    return value + '%';
                },
                editor: {
                    xtype: 'numberfield',
                    field: 'opacity',
                    allowBlank: false,
                    minValue: 0,
                    maxValue: 100
                }
            },{
                xtype: 'actioncolumn',
                width: 60,
                sortable: false,
                menuDisabled: true,
                hideable: false,
                resizable: false,
                items: [{
                    icon: '../images/WEGIS/up.png',
                    tooltip: '上移圖層',
                    action: 'up',
                    handler: function(grid, rowIndex, colIndex, item, e, record, row) {
                        this.fireEvent('actioncolumnitemclick', grid, rowIndex, colIndex, item, e, record, row);
                    }
                },{
                    icon: '../images/WEGIS/down.png',
                    tooltip: '下移圖層',
                    action: 'down',
                    handler: function(grid, rowIndex, colIndex, item, e, record, row) {
                        this.fireEvent('actioncolumnitemclick', grid, rowIndex, colIndex, item, e, record, row);
                    }
                },{
                    icon: '../images/WEGIS/minus.png',
                    tooltip: '移除圖層',
                    action: 'remove',
                    handler: function(grid, rowIndex, colIndex, item, e, record, row) {
                        this.fireEvent('actioncolumnitemclick', grid, rowIndex, colIndex, item, e, record, row);
                    }
                }]
            }
        ];
        
        var grid = {
            xtype: 'grid',
            autoScroll: true,
            columns: columns,
            store: 'OverlayLayers',
            viewConfig: {
                deferEmptyText: false,
                emptyText: '尚未選取任何圖層',
                markDirty: false,                
                plugins: {
                    ptype: 'gridviewdragdrop',
                    dragText: '調整圖層顯示順序'
                }
            },
            plugins: [cellEditing]
        };
        
        me.items = [grid];
        
        me.callParent(arguments);
    }
});