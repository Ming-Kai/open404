Ext.define('WEGIS.model.Org', {
    extend: 'Ext.data.Model',
    fields: [
        {type: 'string', name: 'id'},
        {type: 'string', name: 'nptype'},
        {type: 'string', name: 'name'},
        {type: 'string', name: 'addr'},
        {type: 'string', name: 'phone'},
        {type: 'float', name: 'x'},
        {type: 'float', name: 'y'},
        {type: 'string', name: 'nptypename'},
        {type: 'string', name: 'purpose'},
        {type: 'string', name: 'mission'}
    ]
});