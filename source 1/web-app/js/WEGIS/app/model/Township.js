Ext.define('WEGIS.model.Township', {
    extend:'Ext.data.Model',
    fields: [
        {type: 'string', name: 'twnspcode', mapping: 'twnspcode'},
        {type: 'string', name: 'twnspname', mapping: 'twnspname'},
        {type: 'string', name: 'box', mapping: 'box'}
    ]
});