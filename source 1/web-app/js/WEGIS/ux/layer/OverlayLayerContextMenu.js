Ext.define('WEGIS.ux.layer.OverlayLayerContextMenu', {
    extend: 'Ext.menu.Menu',
    alias: 'widget.wx_overlayLayerContextMenu',
    float: true,    
    showSeparator: false,
    
    config: {
        isFirst: false,
        isLast: false,
        selectedRecord: null
    },
    
    initComponent : function(){
        var me = this;
        
        me.items = [            
            {
                text: '縮放到圖層範圍',
                iconCls: 'layerContextMenu_search',
                action: 'zoomMaxExtent'
            },{
                text: '移到頂端',
                iconCls: 'layerContextMenu_top',
                action: 'top',
                disabled: me.isFirst
            },{
                text: '移到底端',
                iconCls: 'layerContextMenu_bottom',
                action: 'bottom',
                disabled: me.isLast
            },
            '-',{
                text: '開啟所有圖層',
                iconCls: '',
                action: 'showAll'
            },{
                text: '關閉所有圖層',
                iconCls: '',
                action: 'hideAll'
            },{
                text: '移除所有圖層',
                iconCls: '',
                action: 'removeAll'
            }            
        ];       
        
        me.callParent(arguments);
    }
});