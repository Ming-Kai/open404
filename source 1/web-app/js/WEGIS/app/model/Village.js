Ext.define('WEGIS.model.Village', {
    extend:'Ext.data.Model',
    fields: [
        {type: 'string', name: 'vilgcode', mapping: 'vilgcode'},
        {type: 'string', name: 'vilgname', mapping: 'vilgname'},
        {type: 'string', name: 'box'}
    ]
});