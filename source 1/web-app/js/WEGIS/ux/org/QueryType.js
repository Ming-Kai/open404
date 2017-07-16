Ext.define('WEGIS.ux.org.QueryType', {
    extend: 'Ext.form.field.ComboBox',
    alias: 'widget.wx_orgComboQueryType',

    fieldLabel : '查詢方式',
    matchFieldWidth: true,
    queryMode: 'local',
    displayField: 'text',
    valueField: 'value',
    editable: false,
    emptyText: '請選擇查詢方式',
    value: 1,

    initComponent : function(){
        var me = this;

        me.store = Ext.create('Ext.data.Store', {
            autoDestroy: true,
            fields: [
                {type: 'string', name: 'text'},
                {type: 'int', name: 'value'}
            ],
            data: [
                {text: "指定縣市、鄉鎮市區", value: 1},
                {text: "環域分析", value: 2}
            ]
        });

        me.callParent(arguments);
    }
});