Ext.define('WEGIS.ux.map.ContextMenu', {
    extend: 'Ext.menu.Menu',
    alias: 'widget.wx_mapContextMenu',
    float: true,    
    showSeparator:false,
    
    config:{
        mouseX: null,
        mouseY: null
    },
    
    initComponent : function(){
        var me = this;
        
        var setRoutingOrigin = {
            text: '設定為起點',
            action: 'setRoutingOrigin'
        };
        
        var setRoutingWay = {
            text: '設定為必經點',
            action: 'setRoutingWay'
        };
        
        var setRoutingBlock = {
            text: '設定為障礙點',
            action: 'setRoutingBlock'
        };
        
        var setRoutingDestination = {
            text: '設定為終點',
            action: 'setRoutingDestination'
        };
        
        var getCoordinate = {
            text: '取得座標',
            action: 'getCoordinate'
        };

        var clearRoutingMark = {
            text: '清除路徑規劃',
            action: 'clearRoutingMark'
        };

        var clearBufferMark = {
            text: '清除環域標示',
            action: 'clearBufferMark'
        };
        
        me.items = [setRoutingOrigin, setRoutingWay, setRoutingDestination, getCoordinate, '-', clearRoutingMark, clearBufferMark];
        
        me.callParent(arguments);
    }
});