Ext.define('WEGIS.store.Villages', {
    extend: 'Ext.data.Store',
    model: 'WEGIS.model.Village',
    proxy: {
        type: 'ajax',
        url : '../map/getVillagesByTownship',
        reader: {
            type: 'json',
            root: 'data',
            successProperty: 'success'
        }
    }
});