Ext.define('WEGIS.view.org.ResultWindow', {
    extend: 'Ext.window.Window',
    alias: 'widget.wx_orgResultWindow',
    id: 'orgResultWindow',

    title: '單位查詢結果',
    glyph: 0xf0ce,
    layout: 'fit',
    border: false,
    closeAction: 'hide',
    constrainHeader: true,
    resizable: true,
    width: 300,
    height: 550,
    minWidth: 300,
    minHeight: 550,
    x: 10,
    y: 10,

    initComponent : function(){
        var me = this;

        var columns = [{
            header: '圖示',
            dataIndex: 'nptype',
            align: 'center',
            width: 50,
            hideable: false,
            groupable: false,
            renderer: function (value, metadata, record) {
                return '<img height="22" src="../images/WEGIS/OrgIcon/' + value + '.png" />';
            }
        },{
            header: '單位名稱',
            dataIndex: 'name',
            flex: 1,
            hideable: false,
            groupable: false
        }];

        var groupingFeature = Ext.create('Ext.grid.feature.Grouping', {
            id: 'orgGrouping',
            groupHeaderTpl: '<span style="color: #007860">{name} ({rows.length} 筆)</span>',
            hideGroupedHeader: true,
            enableGroupingMenu: false
        });

        var expandAllBtn = {
            xtype: 'button',
            text: '展開分類',
            glyph: 0xf065,
            action: 'expandAllOrgGrouping'
        };

        var collapseAllBtn = {
            xtype: 'button',
            text: '縮合分類',
            glyph: 0xf066,
            action: 'collapseAllOrgGrouping'
        };

        var grid = {
            xtype: 'grid',
            columns: columns,
            store: 'Orgs',
            autoScroll: true,
            border: false,
            features: [groupingFeature],
            tbar: [expandAllBtn, collapseAllBtn],
            viewConfig: {
                deferEmptyText: true,
                emptyText: '無查詢結果'
            },
            plugins: [
                'bufferedrenderer'
            ]
        };

        me.items = [grid];

        me.callParent(arguments);
    }

});