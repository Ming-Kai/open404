Ext.define('WEGIS.controller.Location', {
    extend: 'Ext.app.Controller',
    
    views:[
        'location.LocateWindow'
    ],
    
    refs: [
        {ref: 'locateWin', selector: 'wx_locateWindow'},
        {ref: 'districtPanel', selector: 'wx_locateWindow wx_locDistrict'},
        {ref: 'county', selector: 'wx_locDistrict combo[itemId=county]'},
        {ref: 'township', selector: 'wx_locDistrict combo[itemId=township]'},
        {ref: 'village', selector: 'wx_locDistrict combo[itemId=village]'},
        {ref: 'addressPanel', selector: 'wx_locateWindow wx_locAddress'},
        {ref: 'addess', selector: 'wx_locAddress textfield[name=address]'},
        {ref: 'addressGrid', selector: 'wx_locAddress grid[itemId=addressGrid]'},
        {ref: 'addressFS', selector: 'wx_locAddress fieldset[itemId=resultFS]'},
        {ref: 'roadPanel', selector: 'wx_locateWindow wx_locRoad'},
        {ref: 'road', selector: 'wx_locRoad textfield[name=road]'},
        {ref: 'roadGrid', selector: 'wx_locRoad grid[itemId=roadGrid]'},
        {ref: 'roadFS', selector: 'wx_locRoad fieldset[itemId=resultFS]'},
        {ref: 'poiPanel', selector: 'wx_locateWindow wx_locPoi'},
        {ref: 'poiGrid', selector: 'wx_locPoi grid[itemId=poiGrid]'},
        {ref: 'poiFS', selector: 'wx_locPoi fieldset[itemId=resultFS]'},
        {ref: 'x', selector: 'wx_locCoordinate numberfield[name=x]'},
        {ref: 'y', selector: 'wx_locCoordinate numberfield[name=y]'}
    ],
    
    map: null,
    togs: null,

    roadKeyword: '',
    poiKeyword: '',
    
    init: function() {
        var me = this;
        
        me.map = WEGIS.map.Map;
        me.tgos = WEGIS.map.Tgos;
        
        me.control({
            'wx_locateWindow': {
                destroy: me.onLocateWindowDestroy
            },
            'wx_locateWindow button[itemId^=winBtn]': {
                click: me.onLocateWindowButtinClick
            },
            'wx_locDistrict combo[itemId=county]': {
                select: me.onCountySelect
            },
            'wx_locDistrict combo[itemId=township]': {
                select: me.onTownshipSelect
            },
            'wx_locDistrict combo[itemId=village]': {
                load: me.onVillageBeforeload,
                select: me.onVillageSelect
            },
            'wx_locDistrict button': {
                click: me.onDistrictButtonClick
            },
            'wx_locAddress button': {
                click: me.onAddressButtonClick
            },
            'wx_locAddress grid[itemId=addressGrid]': {
                itemclick: me.onAddressGridItemClick
            },
//            'wx_locAddress grid[itemId=addressGrid] actioncolumn': {
//                itemlocatebuttonclick: me.onAddressLocateClick
//            },
            'wx_locRoad button': {
                click: me.onRoadButtonClick
            },
            'wx_locRoad grid[itemId=roadGrid]': {
                itemclick: me.onRoadGridItemClick
            },
            'wx_locRoad combo[itemId=pages]': {
                select: me.onRoadPagesSelect
            },
//            'wx_locRoad grid[itemId=roadGrid] actioncolumn': {
//                itemlocatebuttonclick: me.onRoadLocateClick
//            },
            'wx_locPoi button': {
                click: me.onPoiButtonClick
            },
            'wx_locPoi grid[itemId=poiGrid]': {
                itemclick: me.onPoiGridItemClick
            },
            'wx_locPoi combo[itemId=pages]': {
                select: me.onPoiPagesSelect
            },
            'wx_locCoordinate combo[itemId=coordinate]': {
                select: me.onCoordinateSystemSelect
            },
            'wx_locCoordinate button': {
                click: me.onCoordinateButtonClick
            }
        });
        
//        me.listen({
//            // We are using Controller event domain here
//            controller: {
//                // This selector matches any originating Controller
//                '*': {      
//                    mapOpenLocateWindow: 'openLocateWindow'
//                }
//            }
//        });
    },
            
    //openLocateWindow: function(){
    //    var me = this;
    //
    //    var locateWin = me.getLocateWin({
    //        map: me.map
    //    });
    //
    //    if(locateWin.isVisible())
    //        locateWin.toFront();
    //    else
    //        locateWin.show();
    //},
            
    removeLocateMark: function(){
        var me = this;
        me.map.removeLocMark();
    },
            
    closeLocateWindow: function(){
        var me = this;
        var win = me.getLocateWin();
        win.close();
    },
            
    onLocateWindowButtinClick: function(button, e, eOpts){
        var me = this;
        switch(button.action){
            case 'removeLocateMark':
                me.removeLocateMark();
                break;
            case 'close':
                me.closeLocateWindow(button);
                break;
        }
    },
            
    onLocateWindowDestroy: function(win, eOpts){
        var me = this;
        me.removeLocateMark();
    },

    onCountySelect: function(combo, records, eOpts){
        var me = this;

        var cntcode = records[0].data.cntcode;
        var township = this.getTownship();
        var townshipStore = township.getStore();

        // 清除
        Ext.suspendLayouts();
        me.clearComboTownship();
        me.clearComboVillage();
        Ext.resumeLayouts(true);

        // 讀取行政里
        townshipStore.load({
            params: {
                cntcode: cntcode
            },
            callback: function(records, operation, success) {
                if(success){
                    township.setDisabled(false);
                }
            },
            scope: this
        });
    },
    
    onTownshipSelect: function(combo, records, eOpts){
        var me = this;

        var twnspcode = records[0].data.twnspcode;
        var village = this.getVillage();
        var villageStore = village.getStore();
        
        // 清除
        Ext.suspendLayouts();
        me.clearComboVillage();
        Ext.resumeLayouts(true);
        
        // 讀取行政里
        villageStore.load({
            params: {
                twnspcode: twnspcode
            },
            callback: function(records, operation, success) {
                if(success){
                    village.setDisabled(false);
                }
            },
            scope: this
        });
    },
            
    onVillageSelect: function(combo, records, eOpts){
        var vilgcode = records[0].data.vilgcode;
    },
            
    onDistrictButtonClick: function(button, e, eOpts){
        var me = this;
        switch(button.action){
            case 'locate':
                me.locateDistrict();
                break;
        }
    },

    clearComboTownship: function(){
        var me = this;

        var township = me.getTownship();
        var townshipStore = township.getStore();

        // 清除
        township.setDisabled(true);
        township.clearValue();
        townshipStore.clearFilter();
        townshipStore.removeAll();
    },

    clearComboVillage: function(){
        var me = this;

        var village = me.getVillage();
        var villageStore = village.getStore();

        // 清除
        village.setDisabled(true);
        village.clearValue();
        villageStore.clearFilter();
        villageStore.removeAll();
    },

    locateDistrict: function(){
        var me = this;
        
        if(!me.tgos.isDefined()){
            me.tgos.showRefErrorMsg();
            return;
        }
        
        // 清除定位標示
        me.map.removeLocMark();

        var panel = me.getDistrictPanel();
        var form = panel.down('form').getForm();
        var valid = form.isValid();
        if(valid){
            panel.setLoading('定位中，請稍後！');
            
            var values = form.getValues();
            var county = values.county;
            var township = values.township;
            var village = values.village;

            var district = '';
            if(county) {
                var combo = me.getCounty();
                district += combo.getRawValue();
            }

            if(township) {
                var combo = me.getTownship();
                district += combo.getRawValue();
            }

            if(village) {
                var combo = me.getVillage();
                district += combo.getRawValue();
            }

            //Ext.Ajax.request({
            //    url: "../map/getDistrictGeomWKT",
            //    method: "POST",
            //    params: {
            //        twnspcode: township,
            //        vilgcode: village
            //    },
            //    success: function (response, options) {
            //        var result = Ext.JSON.decode(response.responseText);
            //        if(result.success){
            //            var wktParser = new OpenLayers.Format.WKT();
            //            var feature = wktParser.read(result.data);
            //
            //            // 將行政區範圍標示於圖台上
            //            me.map.addLocFeature(feature);
            //
            //            // 將圖台縮放至行政區，並在中央標示定位marker
            //            var center = feature.geometry.getCentroid();
            //            var info = me.createDistrictPopupInfo(district);
            //            me.map.addLocMarker(center.x, center.y, info);
            //            me.map.zoomToBounds(feature.geometry.bounds);
            //        }
            //    },
            //    failure: function (response, options) {
            //        Ext.MessageBox.alert('行政區定位', '定位失敗：' + response.status);
            //    },
            //    callback: function (options, success, response) {
            //        panel.setLoading(false);
            //    }
            //});

            var callback = function(result, status){
                panel.setLoading(false);

                if (status !== TGOS.TGLocatorStatus.OK) {
                    Ext.MessageBox.show({
                        title: '查無結果',
                        msg: '查無此行政區！',
                        buttons: Ext.MessageBox.OK,
                        icon: Ext.MessageBox.WARNING
                    });
                    return;
                }

                var r = result[0];

                // 將行政區範圍標示於圖台上
                var olFeature = me.map.transTgosFeatureToOLFeature(r);
                me.map.addLocFeature(olFeature);

                // 將圖台縮放至行政區，並在中央標示定位marker
                var viewport = r.geometry.viewport;
                var center = olFeature.geometry.getCentroid();
                var info = me.createDistrictPopupInfo(district);
                me.map.addLocMarker(center.x, center.y, info);
                me.map.zoomToExtent(viewport.left, viewport.bottom, viewport.right, viewport.top);
            };

            // 查詢行政區
            me.tgos.queryDistrict(district, callback);
        }
    },
    createDistrictPopupInfo: function(district, x, y){
        var me = this;
        
        var info = '';
        info += '<div class="ui raised segment">' + 
                    '<div class="red ui top attached label">行政區定位</div>' + 
                    '<div>行政區：' + district + '</div>' +
                    '<br/>' +
                '</div>';
        return info;
    },
            
    onCoordinateSystemSelect: function(combo, records, eOpts){
        var me = this;
        var x = me.getX();
        var y = me.getY();        
        var type = records[0].data.value;    
        
        Ext.suspendLayouts();
        switch(type){
            case 1:
                x.setFieldLabel('經度X');
                y.setFieldLabel('緯度Y');
                x.setMinValue(-180);           
                x.setMaxValue(180);           
                y.setMinValue(-90);
                y.setMaxValue(90);
                break;
            case 2:
            case 3:
                x.setFieldLabel('X座標');
                y.setFieldLabel('Y座標');
                x.setMinValue(0);
                x.setMaxValue(false);  
                y.setMinValue(0);
                y.setMaxValue(false);
                break;
        }
        Ext.resumeLayouts(true);
    }, 
    onAddressButtonClick: function(button, e, eOpts){
        var me = this;
        switch(button.action){
            case 'query':
                me.queryAddress();
                break;
            case 'clear':
                me.clearAddress(button);
                break;
        }
    },
    // 地址定位查詢
    queryAddress: function(){
        var me = this;
        
        if(!me.tgos.isDefined()){
            me.tgos.showRefErrorMsg();
            return;
        }

        var panel = me.getAddressPanel();
        var form = panel.down('form').getForm();
        var valid = form.isValid();
        if(valid){
            panel.setLoading('查詢中，請稍後！');
            
            var grid = me.getAddressGrid();
            var store = grid.getStore();
            store.removeAll();
            
            var values = form.getValues();
            var address = values.address;
            
            var callback = function(result, status){
                var fsTitle = '查詢結果';
                if(status !== 'ZERO_RESULTS'){
                    if(result.length > 0){
                        var data = [];
                        
                        Ext.suspendLayouts();

                        fsTitle += ' (' + result.length + '筆)';

                        for(var i=0 ; i<result.length ; i++){                            
                            var r = result[i];                            
                            var a = {
                                address: r.formattedAddress,
                                x: r.geometry.location.x,
                                y: r.geometry.location.y                                
                            };
                            data.push(a);
                        }

                        store.loadData(data);
                        Ext.resumeLayouts(true);
                        panel.doLayout();
                    }
                }

                var fs = me.getAddressFS();
                fs.setTitle(fsTitle);
                
                panel.setLoading(false);
            };
        
            me.tgos.queryAddress(address, callback);         
        }
    },            
    clearAddress: function(button){
        var form = button.up('form').getForm();
        form.reset();
    },
//    onAddressLocateClick: function(grid, rowIndex, colIndex, item, e, record, row){
//        var me = this;
//        var data = record.data;        
//        var info = '地址：' + data.address;
//        
//        // 清除定位標示
//        me.map.removeLocMark();
//        
//        me.map.addLocMarker(data.x, data.y, info);        
//        me.map.setCenter(data.x, data.y, 11);
//    },
    onAddressGridItemClick: function(view, record, item, index, e, eOpts){
        var me = this;
        var data = record.data;        
        var info = me.createAddressPopupInfo(data.address, data.x, data.y);
        
        // 清除定位標示
        me.map.removeLocMark();
        
        me.map.addLocMarker(data.x, data.y, info);        
        me.map.setCenter(data.x, data.y, 11);
    },
    createAddressPopupInfo: function(address, x, y){
        var me = this;
        
        var info = '';
        info += '<div class="ui raised segment">' + 
                    '<div class="red ui top attached label">地址定位</div>' + 
                    '<div>地址：' + address + '</div>' +
                    '<br/>' +
                    me.map.createPopupLocToolbar(x, y);
                '</div>';
        return info;
    },

    // 道路定位
    onRoadButtonClick: function(button, e, eOpts){
        var me = this;
        switch(button.action){
            case 'query':
                me.queryRoad();
                break;
            case 'clear':
                me.clearRoad(button);
                break;
        }
    },

    queryRoad: function(keyword, page){
        var me = this;
        page = page === undefined ? 1 : page;
        
        if(!me.tgos.isDefined()){
            me.tgos.showRefErrorMsg();
            return;
        }

        var panel = me.getRoadPanel();
        var form = panel.down('form').getForm();
        var valid = form.isValid();
        if(valid){

            panel.setLoading('查詢中，請稍後！');
            
            var grid = me.getRoadGrid();
            var store = grid.getStore();
            store.removeAll();

            var comboPage = panel.down('combo[itemId=pages]');
            var storePage = comboPage.getStore();
            storePage.removeAll();
            comboPage.clearValue();

            var values = form.getValues();
            var road = values.road;

            var callback = function(result, status, total, pages){
                var fsTitle = '查詢結果';
                if(status !== 'ZERO_RESULTS'){
                    if(result.length > 0){
                        var data = [];

                        Ext.suspendLayouts();

                        storePage.loadData(me.generatePages(pages));
                        comboPage.setValue(page);

                        fsTitle += ' (' + total + '筆，共' + pages + '頁)';

                        for(var i=0 ; i<result.length ; i++){
                            var r = result[i];
                            var viewport = r.geometry.viewport;
                            var a = {
                                num: (page - 1) * 30 + i + 1,
                                roadName: r.county + r.town + r.formattedAddress,
                                x: r.geometry.location.x,
                                y: r.geometry.location.y,
                                viewport: viewport.left + ',' + viewport.bottom + ',' + viewport.right + ',' + viewport.top
                            };
                            data.push(a);
                        }

                        store.loadData(data);
                        Ext.resumeLayouts(true);
                        panel.doLayout();
                    }
                }

                var fs = me.getRoadFS();
                fs.setTitle(fsTitle);

                panel.setLoading(false);
            };

            keyword = keyword === undefined ? road : keyword;
            me.roadKeyword = keyword;
            me.tgos.queryRoad(keyword, page, callback);
        }
    },

    clearRoad: function(button){
        var form = button.up('form').getForm();
        form.reset();
    },

    onRoadPagesSelect: function(combo, records, eOpts){
        var me = this;

        var page = records[0].data.value;
        me.queryRoad(me.roadKeyword, page);
    },

    onRoadGridItemClick: function(view, record, item, index, e, eOpts){
        var me = this;
        
        var data = record.data;
        var viewport = data.viewport.split(',');
        var info = me.createRoadPopupInfo(data.roadName, data.x, data.y);
        
        // 清除定位標示
        me.map.removeLocMark();

        me.map.addLocMarker(data.x, data.y, info);        
        if(viewport.length === 4){
            me.map.zoomToExtent(viewport[0], viewport[1], viewport[2], viewport[3]);
        }        
        me.map.setCenter(data.x, data.y);
    },
    createRoadPopupInfo: function(roadName, x, y){
        var me = this;
        
        var info = '';
        info += '<div class="ui raised segment">' + 
                    '<div class="red ui top attached label">道路定位</div>' + 
                    '<div>道路：' + roadName + '</div>' +
                    '<br/>' +
                '</div>';
        return info;
    },

    // 地標定位
    onPoiButtonClick: function(button, e, eOpts){
        var me = this;
        switch(button.action){
            case 'query':
                me.queryPoi();
                break;
            case 'clear':
                me.clearPoi(button);
                break;
        }
    },

    queryPoi: function(keyword, page){
        var me = this;
        page = page === undefined ? 1 : page;

        if(!me.tgos.isDefined()){
            me.tgos.showRefErrorMsg();
            return;
        }

        var panel = me.getPoiPanel();
        var form = panel.down('form').getForm();
        var valid = form.isValid();
        if(valid){
            panel.setLoading('查詢中，請稍後！');

            var comboPage = panel.down('combo[itemId=pages]');
            var storePage = comboPage.getStore();
            storePage.removeAll();
            comboPage.clearValue();

            var grid = me.getPoiGrid();
            var store = grid.getStore();
            store.removeAll();

            var values = form.getValues();
            var poiName = values.poiName;

            var callback = function(result, status, total, pages){
                var fsTitle = '查詢結果';

                if(status !== 'ZERO_RESULTS'){
                    if(result.length > 0){
                        var data = [];

                        Ext.suspendLayouts();

                        storePage.loadData(me.generatePages(pages));
                        comboPage.setValue(page);

                        fsTitle += ' (' + total + '筆，共' + pages + '頁)';

                        for(var i=0 ; i<result.length ; i++){
                            var r = result[i];
                            var viewport = r.geometry.viewport;
                            var p = {
                                num: (page - 1) * 30 + i + 1,
                                poiName: r.poiName,
                                county: r.county,
                                town: r.town,
                                x: r.geometry.location.x,
                                y: r.geometry.location.y,
                                viewport: viewport.left + ',' + viewport.bottom + ',' + viewport.right + ',' + viewport.top
                            };
                            data.push(p);
                        }

                        store.loadData(data);
                        Ext.resumeLayouts(true);
                        panel.doLayout();
                    }
                }

                var fs = me.getPoiFS();
                fs.setTitle(fsTitle);

                panel.setLoading(false);
            };

            keyword = keyword === undefined ? poiName : keyword;
            me.poiKeyword = keyword;
            me.tgos.queryPoi(keyword, page, callback);
        }
    },

    clearPoi: function(button){
        var form = button.up('form').getForm();
        form.reset();
    },

    onPoiGridItemClick: function(view, record, item, index, e, eOpts){
        var me = this;

        var data = record.data;
        var info = me.createPoiPopupInfo(data.poiName, data.county, data.town, data.x, data.y);

        // 清除定位標示
        me.map.removeLocMark();
        me.map.addLocMarker(data.x, data.y, info);
        me.map.setCenter(data.x, data.y, 11);
    },

    createPoiPopupInfo: function(poiName, county, town, x, y){
        var me = this;

        var info = '';
        info += '<div class="ui raised segment">' +
            '<div class="red ui top attached label">地標定位</div>' +
            '<div>縣市：' + county + '<br/>' +
            '行政區：' + town + '<br/>' +
            '地標名稱：' + poiName + '<br/>' +
            '</div>' +
            '<br/>' +
            me.map.createPopupLocToolbar(x, y) +
            '</div>';
        return info;
    },

    onPoiPagesSelect: function(combo, records, eOpts){
        var me = this;

        var page = records[0].data.value;
        me.queryPoi(me.poiKeyword, page);
    },

    // 座標定位
    onCoordinateButtonClick: function(button, e, eOpts){
        var me = this;
        switch(button.action){
            case 'locate':
                me.locateCoordinate(button);
                break;
            case 'clear':
                me.clearCoordinate();
                break;
        }
    },
    locateCoordinate: function(button){
        var me = this;
        
        // 清除定位標示
        me.map.removeLocMark();
        
        var form = button.up('form').getForm();
        var valid = form.isValid();
        if(valid){
            var record = form.getValues();
            var x = record.x;
            var y = record.y;            
            var proj = null;
            switch(record.type){
                case 1:
                    proj = WEGIS.map.Projection.WGS84;
                    break;
                case 2:
                    proj = WEGIS.map.Projection.TWD97;
                    break;
                case 3:
                    proj = WEGIS.map.Projection.TWD67;
                    break;
            }
            
            var info = me.createCoordinatePopupInfo(x, y);
            var lonLat = new OpenLayers.LonLat(x, y).transform(proj, me.map.map.projection);
            me.map.addLocMarker(lonLat.lon, lonLat.lat, info);
            me.map.setCenter(lonLat.lon, lonLat.lat, 11);
        }
    },
    // 清除座標定位表單資料
    clearCoordinate: function(){
        var me = this;
        me.getX().reset();
        me.getY().reset();
    },
    createCoordinatePopupInfo: function(x, y){
        var me = this;
        
        var info = '';
        info += '<div class="ui raised segment">' + 
                    '<div class="red ui top attached label">座標定位</div>' + 
                    '<div>X座標：' + x + '<br/>' + 'Y座標：' + y + '</div>' +
                    '<br/>' +
                    me.map.createPopupLocToolbar(x, y) +
                '</div>';
        return info;
    },

    generatePages: function(pageNumber){
        var pages = [];
        for(var i = 1 ; i <= pageNumber ; i++){
            var page = {
                text: i.toString(),
                value: i
            };

            pages.push(page);
        }

        return pages;
    }
});