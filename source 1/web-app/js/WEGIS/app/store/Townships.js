Ext.define('WEGIS.store.Townships', {
    extend: 'Ext.data.Store',
    model: 'WEGIS.model.Township',
    proxy: {
        type: 'ajax',
        url : '../map/getTownshipsByCounty',
        reader: {
            type: 'json',
            root: 'data',
            successProperty: 'success'
        }
    }
});