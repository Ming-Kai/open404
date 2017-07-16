Ext.define('WEGIS.map.Google', {
    singleton: true,
    baseLayers: [],
    constructor : function(config){
        var me = this;
        
        if(me.isDefined()){
            // google map底圖
            var gmap = new OpenLayers.Layer.Google(
                "Google 街道地圖", // the default
                {                
                    type: google.maps.MapTypeId.ROADMAP,
                    isBaseLayer: true,
                    numZoomLevels: 20,
                    //minZoomLevel: 8,
                    visibility: false,
                    alwaysInRange: true,
                    buffer: 2
                }
            );

            var ghyb = new OpenLayers.Layer.Google(
                "Google 衛星地圖",
                {
                    type: google.maps.MapTypeId.HYBRID,
                    isBaseLayer: true,
                    numZoomLevels: 20,  
                    //minZoomLevel: 8,
                    visibility: false,
                    alwaysInRange: true
                }
            );

            var gphy = new OpenLayers.Layer.Google(
                "Google 地形地圖",
                {
                    type: google.maps.MapTypeId.TERRAIN,
                    isBaseLayer: true,
                    numZoomLevels: 22, 
                    //minZoomLevel: 8,
                    visibility: false,
                    alwaysInRange: true
                }
            );

            var gsat = new OpenLayers.Layer.Google(
                "Google 衛星影像",
                {
                    type: google.maps.MapTypeId.SATELLITE,
                    isBaseLayer: true,
                    numZoomLevels: 22, 
                    //minZoomLevel: 8,
                    visibility: false,
                    alwaysInRange: true
                }
            );
                
            me.baseLayers.push(gmap, ghyb, gphy, gsat);
        }
        
        me.initConfig(config);
        me.callParent(arguments);
    },
    isDefined: function(){
        return (typeof(google) !== 'undefined');
    },
    showRefErrorMsg: function(){
        Ext.MessageBox.show({
            title: '錯誤',
            msg: 'Google map參照發生錯誤！',
            buttons: Ext.MessageBox.OK,
            icon: Ext.MessageBox.ERROR
        });
    }
});