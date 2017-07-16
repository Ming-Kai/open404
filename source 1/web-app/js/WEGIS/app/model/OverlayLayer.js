Ext.define('WEGIS.model.OverlayLayer', {
    extend:'Ext.data.Model',
    idProperty: 'id',
    fields: [
        {type: 'string', name: 'id'},
        {type: 'string', name: 'name'},
        {type: 'boolean', name: 'check', defaultValue: true},
        {type: 'number', name: 'opacity', defaultValue: 100},
        {type: 'boolean', name: 'isExternalWMS', defaultValue: false}
    ]
});