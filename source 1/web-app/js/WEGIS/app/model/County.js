Ext.define('WEGIS.model.County', {
    extend:'Ext.data.Model',
    fields: [
        {type: 'string', name: 'cntcode', mapping: 'cntcode'},
        {type: 'string', name: 'cntname', mapping: 'cntname'},
        {type: 'string', name: 'box', mapping: 'box'}
    ]
});