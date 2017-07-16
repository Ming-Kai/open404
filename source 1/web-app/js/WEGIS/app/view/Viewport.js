Ext.define('WEGIS.view.Viewport', {
    extend: 'Ext.container.Viewport',
    
    requires: [
        'WEGIS.ux.app.MainMenu'
    ],

    layout: 'border',
    deferredRender: false,

    initComponent : function(){
        var me = this;
        var app = WEGIS.getApplication();
        
        var tabLayers = {
//            title: '圖層',
//            iconCls: 'menu_Layers',
//            autoScroll: true,
            layout: 'fit',
            items: [
                {
                    xtype: 'wx_layerTreeView'
                }
            ]
        };
        
        me.items = [
            {
                region: 'north',
                height: 75,
                html: '<div class="header">' +
                        '<h1 class="logo">' +
                            '<img src="../images/WEGIS/logo.png" alt="內政部NPO導航小精靈"/>' +
                        '</h1>' +
                        '<div class="navBlock">' +
                            '<ul>' +
                            '<li class="btn01"><a href="#" onclick="WEGIS.map.App.toggleLayerList();">圖層清單</a></li>' +
                            '<li class="btn02"><a href="#" onclick="WEGIS.map.App.openAddLayerWindow();">加入圖層</a></li>' +
                            '<li class="btn03"><a href="#" onclick="WEGIS.map.App.openLocateWindow();">定位工具</a></li>' +
                            '<li class="btn04"><a href="#" onclick="WEGIS.map.App.openRoutingWindow();">路徑規劃</a></li>' +
                            '<li class="btn05"><a href="#" onclick="WEGIS.map.App.openOrgQueryWindow();">機構查詢</a></li>' +
                            '</ul>' +
                        '</div>' +
                        '</div>'
                //tbar: {
                //    xtype: 'wx_mapMainMenu',
                //    height: 70
                //
                //}
            }, {
                region: 'south',
                tbar: {
                    xtype: 'taskbar',
                    itemId: 'taskbar',
                    height: 37
                }  
            }, {
                region: 'center',
                xtype: 'wx_mapPanel',
                wMap: WEGIS.map.Map,
                map: WEGIS.map.Map.map
            }, {
                region: 'west',
                width: 270,
                glyph: 0xf0c9,
                header: {
                    titleAlign: 'center'
                },
                title: "<img border='0' src='../images/WEGIS/MapIcon/layerListTitle2.png' style='width: 68px;'/>",
                collapsible: true,
                collapsed: true,
                //collapseMode: 'mini',
                animCollapse: true,
                margins: '0 0 0 0',
                layout: 'fit',
                items: [tabLayers]
        }];
    
        me.callParent(arguments);
    }
    
});

