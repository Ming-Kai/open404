//OpenLayers.Layer.XYZ.SuperGISServer = OpenLayers.Class(OpenLayers.Layer.XYZ, 
//{
//    numberOfResolutions: 0,
//    initialize: function(name, url, options) {
//        var newArguments = [name, url, options];
//
//        if(options.type === 'TGOSMAP' || options.type === 'NLSCMAP')
//            this.numberOfResolutions = 20;
//        else if(options.type === 'F2IMAGE' || options.type === 'ROADMAP')
//            this.numberOfResolutions = 18;
//        else if(options.type === 'HILLSHADE' || options.type === 'HILLSHADEMIX')
//            this.numberOfResolutions = 14;
//                
//        OpenLayers.Layer.XYZ.prototype.initialize.apply(this, newArguments);
//    },
//    getURL: function (bounds) 
//    {
//        var res = this.map.getResolution();
//        var x = Math.round((bounds.left - this.tileOrigin.lon) / (res * this.tileSize.w));
//        var y = Math.round((this.tileOrigin.lat - bounds.top) / (res * this.tileSize.h));
//        var z = this.map.getZoom();
//
//        var url = this.url;
//        var s = '' + x + y + z;
//        if (url instanceof Array)
//        {
//            url = this.selectUrl(s, url);
//        }
//        var sUrl = OpenLayers.String.format(url, {'x': x, 'y': - y - 1, 'z': this.numberOfResolutions - z - 1});
//
//        return sUrl;
//    },
//    calculateGridLayout: function(bounds, origin, resolution) {
//        var tilelon = resolution * this.tileSize.w;
//        var tilelat = resolution * this.tileSize.h;
//        
//        var offsetlon = bounds.left - origin.lon;
//        var tilecol = Math.floor(offsetlon/tilelon) - this.buffer;
//        
//        var rowSign = this.rowSign;
//
//        var offsetlat = rowSign * (origin.lat - bounds.top + tilelat);  
//        var tilerow = Math[~rowSign ? 'floor' : 'ceil'](offsetlat/tilelat) - this.buffer * rowSign;
//        
//        var offsetlat2 = origin.lat - bounds.top + tilelat; 
//        var tilerow2 = Math.floor(offsetlat2/tilelat) - this.buffer;
//        
//        var tilecolremain = offsetlon/tilelon - tilecol;
//        var tileoffsetx = -tilecolremain * this.tileSize.w;
//        var tileoffsetlon = origin.lon + tilecol * tilelon;
//        
//        
//        var tilerowremain = tilerow2 - offsetlat2/tilelat;
//        var tileoffsety = tilerowremain * this.tileSize.h;
//        var tileoffsetlat = origin.lat - tilelat*tilerow2;
//        
//        return { 
//          tilelon: tilelon, tilelat: tilelat,
//          startcol: tilecol, startrow: tilerow,
//          tileoffsetlon: tileoffsetlon, tileoffsetlat: tileoffsetlat,
//          tileoffsetx: tileoffsetx, tileoffsety: tileoffsety
//        };
//    },
//    CLASS_NAME: "OpenLayers.Layer.XYZ.SuperGISServer"
//});

OpenLayers.Layer.XYZ.SuperGISServer = OpenLayers.Class(OpenLayers.Layer.XYZ, 
{
    initialize: function(name, url, options) {
	var newArguments = [name, url, options];
                
        if(options.type === 'TGOSMAP97' || options.type === 'NLSCMAP97')
            this.numberOfResolutions = 14;
        else if(options.type === 'ROADMAP97' || options.type === 'F2IMAGE97')
            this.numberOfResolutions = 12;
                
        OpenLayers.Layer.XYZ.prototype.initialize.apply(this, newArguments);
    },
    clone: function (obj) {
        
        if (obj == null) {
            obj = new OpenLayers.Layer.XYZ.SuperGISServer(this.name,
                                            this.url,
                                            this.getOptions());
        }

        //get all additions from superclasses
        obj = OpenLayers.Layer.Grid.prototype.clone.apply(this, [obj]);

        return obj;
    }, 
    getURL: function (bounds) 
    {
        var res = this.map.getResolution();
        var x = Math.round((bounds.left - this.tileOrigin.lon) / (res * this.tileSize.w));
        var y = Math.round((this.tileOrigin.lat - bounds.top) / (res * this.tileSize.h));
        var z = this.map.getZoom();

        var url = this.url;
        var s = '' + x + y + z;
        if (url instanceof Array)
        {
            url = this.selectUrl(s, url);
        }
        var sUrl = OpenLayers.String.format(url, {'x': x, 'y': - y - 1, 'z': this.numberOfResolutions - z - 1});
        return sUrl;
    },
    calculateGridLayout: function(bounds, origin, resolution) {
        var tilelon = resolution * this.tileSize.w;
        var tilelat = resolution * this.tileSize.h;
        
        var offsetlon = bounds.left - origin.lon;
        var tilecol = Math.floor(offsetlon/tilelon) - this.buffer;
        
        var rowSign = this.rowSign;

        var offsetlat = rowSign * (origin.lat - bounds.top + tilelat);  
        var tilerow = Math[~rowSign ? 'floor' : 'ceil'](offsetlat/tilelat) - this.buffer * rowSign;
        
        var offsetlat2 = origin.lat - bounds.top + tilelat; 
        var tilerow2 = Math.floor(offsetlat2/tilelat) - this.buffer;
        
        var tilecolremain = offsetlon/tilelon - tilecol;
        var tileoffsetx = -tilecolremain * this.tileSize.w;
        var tileoffsetlon = origin.lon + tilecol * tilelon;
        
        
        var tilerowremain = tilerow2 - offsetlat2/tilelat;
        var tileoffsety = tilerowremain * this.tileSize.h;
        var tileoffsetlat = origin.lat - tilelat*tilerow2;
        
        return { 
          tilelon: tilelon, tilelat: tilelat,
          startcol: tilecol, startrow: tilerow,
          tileoffsetlon: tileoffsetlon, tileoffsetlat: tileoffsetlat,
          tileoffsetx: tileoffsetx, tileoffsety: tileoffsety
        };
    },
    CLASS_NAME: "OpenLayers.Layer.XYZ.SuperGISServer"
});
