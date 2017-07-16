Ext.define('WEGIS.map.Projection', {
    singleton: true,
    TWD67: new OpenLayers.Projection("EPSG:3828"),
    TWD97: new OpenLayers.Projection("EPSG:3826"),
    WGS84: new OpenLayers.Projection("EPSG:4326"),
    GOOGLE: new OpenLayers.Projection("EPSG:900913")
});