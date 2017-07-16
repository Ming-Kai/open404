Ext.define('WEGIS.view.org.Query', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.wx_orgQuery',

    requires: [
        'WEGIS.ux.org.QueryType'
    ],

    //title: '查詢',
    layout: 'fit',
    autoScroll: true,
    defaults: {
        bodyPadding: 7
    },

    initComponent : function(){
        var me = this;
        var required = '<span style="color:red;font-weight:bold">* </span>';

        var comboQueryType = {
            xtype: 'wx_orgComboQueryType',
            name: 'queryType',
            beforeLabelTextTpl: required
        };

        var comboCounty = {
            xtype : 'combo',
            itemId: 'county',
            name: 'county',
            fieldLabel: '縣市',
            allowBlank: false,
            beforeLabelTextTpl: required,
            matchFieldWidth: true,
            store: Ext.create('WEGIS.store.County'),
            displayField: 'cntname',
            valueField: 'cntcode',
            editable: false,
            emptyText: '請選擇縣市',
            queryMode: 'local',
            listConfig: {
                loadingText: '讀取中'
            }
        };

        // 讀取行政區
        comboCounty.store.load();

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

        var distance = {
            xtype: "fieldcontainer",
            itemId: 'fcDistance',
            fieldLabel: '環域距離',
            beforeLabelTextTpl: required,
            disabled: true,
            hidden: true,
            layout: {
                type: 'hbox',
                defaultMargins: {top: 0, right: 5, bottom: 0, left: 0}
            },
            items: [
                {
                    xtype: 'numberfield',
                    name: 'distance',
                    value: 500,
                    minValue: 0,
                    maxValue: 5000,
                    decimalPrecision: 0,
                    emptyText: '請輸入距離 0 ~ 5000',
                    // Remove spinner buttons, and arrow key and mouse wheel listeners
                    hideTrigger: true,
                    keyNavEnabled: false,
                    mouseWheelEnabled: false,
                    width: 150,
                    allowBlank: false,
                    msgTarget: 'under'
                },
                {
                    xtype: "displayfield",
                    value: "公尺"
                }
            ]
        };

        var textfieldname = {
            xtype: 'textfield',
            name: 'orgName',
            fieldLabel: '單位名稱',
            emptyText: '請輸入單位名稱'
        };

        var textfieldPurpose = {
            xtype: 'textfield',
            name: 'orgPurpose',
            fieldLabel: '單位宗旨',
            emptyText: '請輸入單位宗旨'
        };

        var textfieldMission = {
            xtype: 'textfield',
            name: 'orgMission',
            fieldLabel: '單位任務',
            emptyText: '請輸入單位任務'
        };

        var expandAllOrgTypeBtn = {
            xtype : 'button',
            text : '展開',
            glyph: 0xf065,
            action: 'expandAllOrgType'
        };

        var collapseAllOrgTypeBtn = {
            xtype : 'button',
            text : '縮合',
            glyph: 0xf066,
            action: 'collapseAllOrgType'
        };

        var clearOrgTypeBtn = {
            xtype : 'button',
            text : '清除選擇',
            glyph: 0xf096,
            action: 'deselectAllOrgType'
        };

        var treeStore = Ext.create('Ext.data.TreeStore',{
            proxy: {
                type: 'ajax',
                url: '../map/getOrgTypeByTree'
//                reader: {
//                    type: 'json',
//                    root: 'data',
//                    successProperty: 'success'
//                }
            }
        });

//        var orgType = {
//            xtype: "fieldcontainer",
//            fieldLabel: '機構類別',
//            beforeLabelTextTpl: required,
//            layout: {
//                type: 'hbox',
//                defaultMargins: {top: 0, right: 5, bottom: 0, left: 0}
//            },
//            items: [clearOrgTypeBtn]
//        };

        var condition = {
            xtype: 'fieldset',
            title: '<span style="color: #0000ff; font-size: 10pt;">進階條件(點擊展開)</span>',
            collapsed: true,
            collapsible: true,
            padding: '5 8 5 8',
            defaults: {
                anchor: '100%',
                labelWidth: 60,
                labelAlign : 'right',
                msgTarget: 'under',
                layout: {
                    type: 'fit',
                    defaultMargins: {top: 0, right: 5, bottom: 0, left: 0}
                }
            },
            items: [
                textfieldname, textfieldPurpose, textfieldMission
            ]
        };

        var treePanel = Ext.create('Ext.tree.Panel',{
            xtype: 'treepanel',
            itemId: 'orgtype',
            border: false,
            rootVisible: false,
            useArrows: true,
            store: treeStore,
            tbar: [expandAllOrgTypeBtn, collapseAllOrgTypeBtn, clearOrgTypeBtn],
            listeners: { //節點打勾or取消，葉節點跟著打勾or取消
                checkchange: me.onNodeCheckchange
            }
        });

        var condition2 = {
            xtype: 'fieldset',
            title: '<span style="color:red;font-weight:bold">* </span><span style="color: #0000ff; font-size: 10pt;">單位類別</span>',
            collapsible: false,
            defaults: {
                anchor: '100%',
                labelWidth: 70,
                labelAlign : 'right',
                msgTarget: 'under',
                layout: {
                    type: 'fit',
                    defaultMargins: {top: 0, right: 5, bottom: 0, left: 0}
                }
            },
            items: [
                treePanel
            ]
        };

        var queryBtn = {
            xtype : 'button',
            text : '查詢',
            glyph: 0xf002,
            action : 'query'
        };

        var outputBtn = {
            xtype : 'button',
            text : '匯出EXCEL',
            glyph: 0xf02f,
            action : 'output'
        };

        var showResultWinBtn = {
            xtype: 'button',
            text: '顯示查詢結果',
            glyph: 0xf0ce,
            action: 'toggleResultWin'
        };

        var dockedItems = [
            {
                xtype: 'toolbar',
                dock: 'bottom',
                items: ['->', showResultWinBtn, outputBtn, queryBtn]
            }
        ];

        var form = {
            xtype: 'form',
            autoScroll: true,
            border: false,
            bodyBorder: false,
            defaults: {
                anchor: '100%',
                labelWidth: 70,
                labelAlign : 'right',
                msgTarget: 'under'
            },
            items: [comboQueryType, distance, comboCounty, comboTownship, condition, condition2],
            dockedItems: dockedItems
        };

        me.items = [form];

        me.callParent(arguments);
    },

    onNodeCheckchange: function(node, checked, eOpts){
        Ext.suspendLayouts();
        node.cascadeBy(function(n){n.set('checked', checked);} );
        Ext.resumeLayouts(true);
    }
});