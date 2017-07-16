Ext.onReady(function() {
    var defaultTheme = 'neptune';
    function getQueryParam(name, queryString) {
        var match = RegExp(name + '=([^&]*)').exec(queryString || location.search);
        return match && decodeURIComponent(match[1]);
    }

    function addThemeCss(filename) {
        var fileref = document.createElement("link")
            fileref.setAttribute("rel", "stylesheet")
            fileref.setAttribute("type", "text/css")
            fileref.setAttribute("href", filename);
        if (typeof fileref !== "undefined") {
            document.getElementsByTagName("head")[0].appendChild(fileref);
        }
    }

    var theme = getQueryParam('theme') || defaultTheme;
    var cssFiles = ['popup', 'tree'];
    for (var i=0, ii=cssFiles.length; i<ii; ++i) {
        addThemeCss('../js/GeoExt/2.1.0/resources/css/' + cssFiles[i] + '-' + theme + '.css');
    }
});

Ext.Loader.setConfig({
    disableCaching: true,
    enabled: true,
    paths: {
        'GeoExt': '../js/GeoExt/2.1.0/src/GeoExt',
        'WEGIS.app': '../map',
        'WEGIS.map': '../js/WEGIS/map',
        'WEGIS.ux': '../js/WEGIS/ux'
    }
});

// 設定 Proj4js 座標空間
OpenLayers.Projection.prototype.getCode = function() {
    return (this.proj && this.proj.srsCode) ? this.proj.srsCode : this.projCode;
    //return this.proj ? this.proj.srsCode : this.projCode;
};

window.Proj4js = {
    Proj: function(code) {
        return proj4(Proj4js.defs[code]);
    },
    defs: proj4.defs,
    transform: proj4
};

// define EPSG:3826 TWD97 / TM2 zone 121
proj4.defs["EPSG:3826"] = "+proj=tmerc +lat_0=0 +lon_0=121 +k=0.9999 +x_0=250000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs";
// define EPSG:3828 TWD67 / TM2 zone 121
proj4.defs["EPSG:3828"] = "+proj=tmerc +lat_0=0 +lon_0=121 +k=0.9999 +x_0=250000 +y_0=0 +ellps=aust_SA +units=m +no_defs";


Ext.application({    
    name: 'WEGIS',
    appFolder: '../js/WEGIS/app',
    
    requires: [
        'WEGIS.map.App',
        'WEGIS.map.Map'
    ],
    
    controllers: [
        'App',
        'Layer',
        'Location',
        'Map',
        'Org',
        'Routing'
    ],
    
    autoCreateViewport: true,
    
    init: function(){
        var me = this;
        
        // Init the singleton.  Any tag-based quick tips will start working.
        Ext.tip.QuickTipManager.init();

        // 設定FontAwesome
        Ext.setGlyphFontFamily('FontAwesome');
    },

    launch: function(){
        var me = this;

        // 設定地圖初始位置
        var olMap = WEGIS.map.Map.map;
        olMap.zoomToMaxExtent();
        WEGIS.map.Map.setCenter(219001, 2650007, 4);

        // 預先讀取機構資料
        var orgCtrl = WEGIS.getApplication().getController('Org');
        orgCtrl.preQueryOrg();
        
        Ext.getBody().unmask();
    }
});