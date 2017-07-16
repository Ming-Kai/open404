Ext.define('WEGIS.store.Orgs',{
    extend : 'Ext.data.Store',
    model : 'WEGIS.model.Org',
    autoLoad: false,
    groupField: 'nptypename'
});