Ext.define('WEGIS.store.County', {
    extend: 'Ext.data.Store',
    model: 'WEGIS.model.County',
    proxy: {
        type: 'ajax',
        url : '../map/getAllCounty',
        reader: {
            type: 'json',
            root: 'data',
            successProperty: 'success'
        }
    }
});