Ext.define('WEGIS.controller.Org', {
    extend: 'Ext.app.Controller',

    stores: ['Orgs'],

    models: ['Org'],

    views:[
        'org.MainWindow',
        'org.ResultWindow'
    ],

    refs: [
        {ref: 'orgMainWin', selector: 'wx_orgMainWindow'},
        {
            ref: 'orgResultWin',
            selector: 'wx_orgResultWindow',
            autoCreate: true,
            xtype: 'wx_orgResultWindow'
        },
        {ref: 'orgQueryPanel', selector: 'wx_orgQuery'},
        {ref: 'comboCounty', selector: 'wx_orgQuery combo[itemId=county]'},
        {ref: 'comboTownship', selector: 'wx_orgQuery combo[itemId=township]'},
        {ref: 'orgTypeTree', selector: 'wx_orgQuery form treepanel'},
        {ref: 'orgResultGrid', selector: 'wx_orgResultWindow grid'}
    ],

    map: null,
    orgVecLayer: null,

    showThreshold: 1000,

    message:{
        query: '單位查詢中，請稍後！',
        buffer: '單位環域分析中，請稍後！',
        bufferInvalid: '請使用地圖工具列裡的環域工具，在地圖上標示分析範圍！',
        showConfirm: '查詢結果為{0}筆，超過{1}筆可能造成瀏覽器效能低落，甚至停止反應，建議縮小查詢範圍，請問是否要顯示查詢結果？'
    },

    /*
     *  存放在查詢結果grid上，滑鼠enter grid item的record
     *  提供滑鼠移出grid item時，把機構icon恢復原狀
     *  @private
     */
    hoverItems: [],

    init: function() {
        var me = this;

        me.map = WEGIS.map.Map;
        me.orgVecLayer = me.map.orgVecLayer;

        me.orgVecLayer.events.on({
            featureclick: me.onOrgLayerFeatureClick,
            scope: me
        });

        me.control({
            'wx_orgMainWindow': {
                beforedestroy: me.onOrgQueryWindowClose,
                collapse: me.onOrgQueryWindowHide,
                expand: me.onOrgQueryWindowShow,
                hide: me.onOrgQueryWindowHide,
                show: me.onOrgQueryWindowShow
            },
            'wx_orgMainWindow button[itemId^=winBtn]': {
                click: me.onOrgQueryWindowButtonClick
            },
            'wx_orgQuery': {
                afterrender: me.onQueryAfterrender
            },
            'wx_orgQuery form button': {
                click: me.onQueryFormButtonClick
            },
            'wx_orgQuery form wx_orgComboQueryType': {
                select: me.onSelectQueryType
            },
            'wx_orgResultWindow grid': {
                itemmouseenter: me.onOrgResultWindowGridItemMouseEnter,
                itemmouseleave: me.onOrgResultWindowGridItemMouseLeave,
                itemclick: me.onOrgResultWindowGridItemClick
            },
            'wx_orgResultWindow grid button': {
                click: me.onResulWindowGridtButtonClick
            },
//            'wx_orgResultWindow grid actioncolumn': {
//                locateButtonClick: me.onLocateButtonClick
//            },
            'wx_orgQuery combo[itemId=county]': {
                change: me.onCountyChange
            }
        });
    },

    onQueryAfterrender: function(combo, eOpts){
        var me = this;

        var cntcode = me.map.geolocateCntcode;
        var comboCounty = me.getComboCounty();

        if(cntcode){
            comboCounty.setValue(cntcode);
        }
    },

    onQueryFormButtonClick: function(button, e, eOpts){
        var me = this;

        switch(button.action){
            case 'query':
                me.query();
                break;
            case 'output':
                me.output();
                break;
            case 'toggleResultWin':
                me.toggleOrgResultWin();
                break;
            case 'expandAllOrgType':
                me.expandAllOrgType();
                break;
            case 'collapseAllOrgType':
                me.collapseAllOrgType();
                break;
            case 'deselectAllOrgType':
                me.deselectAllOrgType();
                break;
        }
    },

    onResulWindowGridtButtonClick: function(button, e, eOpts){
        var me = this;

        switch(button.action){
            case 'expandAllOrgGrouping':
                me.expandAllOrgGrouping();
                break;
            case 'collapseAllOrgGrouping':
                me.collapseAllOrgGrouping();
                break;
        }
    },

    onOrgQueryWindowClose: function(win, eOpts){
        var me = this;
        var rwin = me.getOrgResultWin();

        if(rwin){
            rwin.hide();
            rwin.destroy();
        }

        me.clearQueryResult();
    },

    onOrgQueryWindowHide: function(win, eOpts){
        var me = this;
        var rwin = me.getOrgResultWin();

        if(rwin && rwin.isVisible()){
            rwin.isShow = true;
            rwin.hide();
        }
    },

    onOrgQueryWindowShow: function(win, eOpts){
        var me = this;
        var rwin = me.getOrgResultWin();

        if(rwin && rwin.isHidden() && rwin.isShow == true){
            rwin.isShow = false;
            rwin.show();
        }
    },

    onOrgQueryWindowButtonClick: function(button, e, eOpts){
        var me = this;

        switch(button.action){
            case 'clear':
                me.clearQueryResult();
                break;
            case 'close':
                me.closeOrgQueryWindow();
                break;
        }
    },

    expandAllOrgGrouping: function(){
        var me = this;

        Ext.suspendLayouts();
        var groupingFeature = me.getOrgResultGrid().getView().getFeature('orgGrouping');
        groupingFeature.expandAll();
        Ext.resumeLayouts(true);
    },

    collapseAllOrgGrouping: function(){
        var me = this;

        Ext.suspendLayouts();
        var groupingFeature = me.getOrgResultGrid().getView().getFeature('orgGrouping');
        groupingFeature.collapseAll();
        Ext.resumeLayouts(true);
    },

    closeOrgQueryWindow: function(){
        var me = this;
        var qwin = me.getOrgMainWin();
        qwin.close();
    },

    showOrgResultWin: function(){
        var me = this;

        var rwin = me.getOrgResultWin();
        if(rwin && rwin.isHidden()){
            var qwin = me.getOrgMainWin();

            rwin.show();

            if(qwin){
                rwin.alignTo(qwin, 'tl-tr');
            }
            else{
                var x = me.map.getWindowX();
                var y = me.map.getWindowY();
                rwin.setPosition(x, y);
            }

            rwin.toFront();
        }
    },

    toggleOrgResultWin: function(){
        var me = this;

        var rwin = me.getOrgResultWin();
        if(rwin){
            if(rwin.isHidden()){
                var qwin = me.getOrgMainWin();

                rwin.show();
                rwin.alignTo(qwin, 'tl-tr');
                rwin.toFront();
            }
            else{
                rwin.hide();
            }
        }
    },

    onSelectQueryType: function(combo, records, eOpts ){
        var me = this;

        var value = combo.getValue();
        var form = me.getOrgQueryPanel().down('form');
        var comboCounty = form.down('combo[name=county]');
        var comboTownship = form.down('combo[name=township]');
        var distance = form.down('fieldcontainer[itemId=fcDistance]');
        if(value === 1){
            comboCounty.setDisabled(false);
            comboCounty.show();

            comboTownship.setDisabled(false);
            comboTownship.show();

            distance.setDisabled(true);
            distance.hide();
        }
        else if(value === 2){
            Ext.example.msg('環域分析', '<span style="color: red">請使用地圖工具列裡的環域工具，在地圖上標示分析範圍！</span>');
            comboCounty.setDisabled(true);
            comboCounty.hide();

            comboTownship.setDisabled(true);
            comboTownship.hide();

            distance.setDisabled(false);
            distance.show();
        }
    },

    query: function(count){
        var me = this;
        count = count === undefined ? true : count;

        var form = me.getOrgQueryPanel().down('form');
        var comboQueryType = form.down('wx_orgComboQueryType');
        var value = comboQueryType.getValue();
        if(value === 1){
            me.queryOrg(count);
        }
        else if(value === 2){
            me.bufferOrg(count);
        }
    },

    /*
     *  從查詢頁面帶入單位查詢結果
     *  系統啟動後，直接顯示單位於圖台上
     */
    preQueryOrg: function(){
        var me = this;

        var getParams = document.URL.split("?");
        if(getParams.length > 1){
            var params = Ext.Object.fromQueryString(getParams[1], true);

            if(!Ext.isEmpty(params.o)){
                // 查詢
                Ext.Ajax.request({
                    url: '../map/preOrgQuery',
                    method: "POST",
                    timeout : 30000,
                    params: {
                        count: false,
                        orgID: params.o
                    },
                    success : function(response, options){
                        var result = Ext.JSON.decode(response.responseText);
                        if(result.success){
                            if(result.box){
                                me.map.zoomToExtentBox(result.box);
                            }

                            me.setQueryResult(result);
                        }
                        else{
                            Ext.MessageBox.show({
                                title: '單位查詢',
                                msg: '錯誤原因：' + result.msg + '！',
                                buttons: Ext.MessageBox.OK,
                                icon: Ext.MessageBox.ERROR
                            });
                        }
                    },
                    failure: function (response, options) {
                        Ext.MessageBox.show({
                            title: '單位查詢',
                            msg: '讀取失敗，' + response.status + '！',
                            buttons: Ext.MessageBox.OK,
                            icon: Ext.MessageBox.ERROR
                        });
                    },
                    callback: function (options, success, response) {
                    }
                });
            }
        }
    },

    /*
     *  查詢方式為指定縣市
     */
    queryOrg: function(count){
        var me = this;
        count = count === undefined ? true : count;

        var panel = me.getOrgQueryPanel();
        var form = panel.down('form');
        var orgType = me.getOrgTypeValue();

        var valid = form.isValid();
        if(!valid) return;

        if(Ext.isEmpty(orgType)){
            Ext.MessageBox.show({
                title: '單位查詢',
                msg: '請選擇單位類別！',
                buttons: Ext.MessageBox.OK,
                icon: Ext.MessageBox.WARNING
            });
            return;
        }

        // 訊息
        var win = me.getOrgMainWin();
        win.setLoading('查詢中，請稍後！');

        // 清除資料
        me.clearQueryResult();

        var values = form.getValues();
        var params = {
            count: count,
            showThreshold: me.showThreshold,
            cntcode: values.county,
            twnspcode: values.township,
            orgName: values.orgName,
            orgPurpose: values.orgPurpose,
            orgMission: values.orgMission,
            orgType: orgType
        };

        // 縣市、鄉鎮市區定位
        var box;
        var comboTownship = me.getComboTownship();
        var townshipRecord = comboTownship.findRecordByValue(comboTownship.getValue());
        if(townshipRecord){
            box = townshipRecord.data.box;
        }
        else{
            var comboCounty = form.down('combo[itemId=county]');
            var countyRecord = comboCounty.findRecordByValue(comboCounty.getValue());
            if(countyRecord){
                box = countyRecord.data.box;
            }
        }

        if(box){
            me.map.zoomToExtentBox(box);
        }

        // 查詢
        Ext.Ajax.request({
            url: '../map/orgQuery',
            method: "POST",
            timeout : 30000,
            params: params,
            success : function(response, options){
                var result = Ext.JSON.decode(response.responseText);
                if(result.success){
                    if(result.confirm){
                        me.confirmQueryResult(result);
                    }
                    else if(result.data.length >= 0){
                        me.setQueryResult(result);
                    }
                }
                else{
                    Ext.MessageBox.show({
                        title: '單位查詢',
                        msg: '錯誤原因：' + result.msg + '！',
                        buttons: Ext.MessageBox.OK,
                        icon: Ext.MessageBox.ERROR
                    });
                }

            },
            failure: function (response, options) {
                Ext.MessageBox.show({
                    title: '單位查詢',
                    msg: '查詢失敗，' + response.status + '！',
                    buttons: Ext.MessageBox.OK,
                    icon: Ext.MessageBox.ERROR
                });
            },
            callback: function (options, success, response) {
                win.setLoading(false);
            }
        });
    },

    /*
     *  查詢方式為環域分析
     */
    bufferOrg: function(count){
        var me = this;
        count = count === undefined ? true : count;

        var panel = me.getOrgQueryPanel();
        var form = panel.down('form');

        var valid = form.isValid();
        if(!valid){
            return;
        }

        var orgType = me.getOrgTypeValue();
        if(Ext.isEmpty(orgType)){
            Ext.MessageBox.show({
                title: '單位查詢 - 環域分析',
                msg: '請選擇單位類別！',
                buttons: Ext.MessageBox.OK,
                icon: Ext.MessageBox.WARNING
            });
            return;
        }

        if(!me.map.hasBufferMark()){
            Ext.MessageBox.show({
                title: '單位查詢 - 環域分析',
                msg: '請先標示環域範圍！',
                buttons: Ext.MessageBox.OK,
                icon: Ext.MessageBox.WARNING
            });
            return;
        }

        // 訊息
        var win = me.getOrgMainWin();
        win.setLoading('環域分析中，請稍後！');

        // 清除資料
        me.clearQueryResult();

        var values = form.getValues();

        // 畫出環域分析範圍
        me.map.clearBuffer();
        var geoms = me.map.getBufferMark();
        me.map.drawBuffer(geoms, values.distance, me.map.jstsFunc.UNION);

        // 取得環域分析標示
        var wktGeoms = me.map.getWKTBuffer();
        var jsonGeoms = Ext.JSON.encode(wktGeoms);

        var params = {
            count: count,
            showThreshold: me.showThreshold,
            orgName: values.orgName,
            orgPurpose: values.orgPurpose,
            orgMission: values.orgMission,
            orgType: orgType,
            geoms : jsonGeoms,
            distance: values.distance
        };

        // 環域分析
        Ext.Ajax.request({
            url: '../map/orgBuffer',
            method: "POST",
            timeout : 30000,
            params: params,
            success : function(response, options){
                var result = Ext.JSON.decode(response.responseText);
                if(result.success){
                    if(result.confirm){
                        me.confirmQueryResult(result);
                    }
                    else if(result.data.length >= 0){
                        me.setQueryResult(result);
                    }
                }
                else{
                    Ext.MessageBox.show({
                        title: '單位環域分析',
                        msg: '錯誤原因：' + result.msg + '！',
                        buttons: Ext.MessageBox.OK,
                        icon: Ext.MessageBox.ERROR
                    });
                }
            },
            failure: function (response, options) {
                Ext.MessageBox.show({
                    title: '單位環域分析',
                    msg: '環域分析失敗，' + response.status + '！',
                    buttons: Ext.MessageBox.OK,
                    icon: Ext.MessageBox.ERROR
                });
            },
            callback: function (options, success, response) {
                win.setLoading(false);
            }
        });
    },

    output: function(){
        var me = this;

        var form = me.getOrgQueryPanel().down('form');
        var comboQueryType = form.down('wx_orgComboQueryType');
        var value = comboQueryType.getValue();
        if(value === 1){
            me.outputQuery();
        }
        else if(value === 2){
            me.outputBuffer();
        }
    },

    outputQuery: function(){
        var me = this;

        var panel = me.getOrgQueryPanel();
        var form = panel.down('form');
        var orgType = me.getOrgTypeValue();

        var valid = form.isValid();
        if(!valid) return;

        if(Ext.isEmpty(orgType)){
            Ext.MessageBox.show({
                title: '單位查詢',
                msg: '請選擇單位類別！',
                buttons: Ext.MessageBox.OK,
                icon: Ext.MessageBox.WARNING
            });
            return;
        }

        // 訊息
        var win = me.getOrgMainWin();
        win.setLoading('產製檔案中，請稍後！');

        var values = form.getValues();
        var params = {
            count: false,
            queryType: values.queryType,
            cntcode: values.county,
            twnspcode: values.township,
            orgName: values.orgName,
            orgPurpose: values.orgPurpose,
            orgMission: values.orgMission,
            orgType: orgType
        };

        me.outputFile(params, success, fail);

        function success(url){
            win.setLoading(false);
        }

        function fail(html, url){
            win.setLoading(false);
            Ext.MessageBox.show({
                title: '單位查詢輸出',
                msg: html,
                buttons: Ext.MessageBox.OK,
                icon: Ext.MessageBox.ERROR
            });
        }
    },

    outputBuffer: function(){
        var me = this;

        var panel = me.getOrgQueryPanel();
        var form = panel.down('form');

        var valid = form.isValid();
        if(!valid){
            return;
        }

        var orgType = me.getOrgTypeValue();
        if(Ext.isEmpty(orgType)){
            Ext.MessageBox.show({
                title: '單位查詢 - 環域分析',
                msg: '請選擇單位類別！',
                buttons: Ext.MessageBox.OK,
                icon: Ext.MessageBox.WARNING
            });
            return;
        }

        if(!me.map.hasBufferMark()){
            Ext.MessageBox.show({
                title: '單位查詢 - 環域分析',
                msg: '請先標示環域範圍！',
                buttons: Ext.MessageBox.OK,
                icon: Ext.MessageBox.WARNING
            });
            return;
        }

        // 訊息
        var win = me.getOrgMainWin();
        win.setLoading('產製檔案中，請稍後！');

        var values = form.getValues();

        // 畫出環域分析範圍
        me.map.clearBuffer();
        var geoms = me.map.getBufferMark();
        me.map.drawBuffer(geoms, values.distance, me.map.jstsFunc.UNION);

        // 取得環域分析標示
        var wktGeoms = me.map.getWKTBuffer();
        var jsonGeoms = Ext.JSON.encode(wktGeoms);

        var params = {
            count: false,
            queryType: values.queryType,
            orgName: values.orgName,
            orgPurpose: values.orgPurpose,
            orgMission: values.orgMission,
            orgType: orgType,
            geoms : jsonGeoms,
            distance: values.distance
        };

        me.outputFile(params, success, fail);

        function success(url){
            win.setLoading(false);
        }

        function fail(html, url){
            win.setLoading(false);
            Ext.MessageBox.show({
                title: '單位查詢輸出',
                msg: html,
                buttons: Ext.MessageBox.OK,
                icon: Ext.MessageBox.ERROR
            });
        }
    },

    outputFile: function(params, success, fail){
        var me = this;

        //var queryString = Ext.Object.toQueryString(params);

        $.fileDownload("../map/orgOutput", {
            cookieName: 'gisOrgOutputFileDownload',
            httpMethod: 'POST',
            data: params,
            successCallback: success,
            failCallback: fail
        });
    },

    getOrgTypeValue: function(){
        var me = this;

        var checkItems = '';
        var orgTypeTree = me.getOrgTypeTree();
        var root = orgTypeTree.getRootNode();
        root.eachChild(function(node) {
            checkItems += me.getChildNodesValue(node);
        });

        return checkItems;
    },

    getChildNodesValue: function(node){
        var me = this;
        var checkItems = '';

        if (node.data.checked) {
            checkItems += node.data.id + ',';
        }

        if (node.hasChildNodes()) {
            node.eachChild(function(childNode) {
                checkItems = checkItems + me.getChildNodesValue(childNode);
            });
        }

        return checkItems;
    },

    confirmQueryResult: function(result){
        var me = this;

        if(result.confirm){
            Ext.MessageBox.show({
                title: '確認顯示查詢結果',
                msg: Ext.String.format(me.message.showConfirm, result.recTotal, me.showThreshold),
                buttons: Ext.Msg.YESNO,
                icon: Ext.Msg.QUESTION,
                fn: showQueryResult,
                scope: me
            });
        }

        function showQueryResult(btn){
            if(btn === 'yes'){
                me.query(false);
            }
        }
    },

    setQueryResult: function(result){
        var me = this;

        Ext.suspendLayouts();
        var orgStore = me.getOrgsStore();
        orgStore.loadData(result.data);
        Ext.resumeLayouts(true);

        // map add marker
        var count = orgStore.data.items.length;

        // add marker
        //for(var i=0 ; i<count ; i++){
        //    var record = orgStore.data.items[i];
        //    var info = me.createOrgPopupInfo(record.data);
        //    me.map.addOrgMarker(record.data.x, record.data.y, record.data.nptype, info);
        //}

        // add vector features
        for(var i=0 ; i<count ; i++){
            var record = orgStore.getAt(i);
            var data = record.raw;
            var geom = new OpenLayers.Geometry.Point(data.x, data.y);
            var attributes = {};
            var feature = new OpenLayers.Feature.Vector(geom, attributes);

            feature.attributes.nptype = data.nptype;
            feature.attributes.org = data;

            me.orgVecLayer.addFeatures(feature);
            record.raw.feature = feature;
        }

        me.showOrgResultWin();
    },

    clearQueryResult: function(){
        var me = this;

        me.map.removeOrgMarkers();

        var orgStore = me.getOrgsStore();
        orgStore.clearData();
        orgStore.removeAll();

        me.hoverItems.length = 0;
    },

    onOrgResultWindowGridItemClick: function(grid, record, item, index, e, eOpts) {
        var me = this;

        var x = record.get('x');
        var y = record.get('y');
        if(x && y){
            var info = me.createOrgPopupInfo(record.data);

            me.map.setCenter(x, y, 11);
            me.map.addOrgPopup(x, y, info);
        }
    },

    createOrgPopupInfo: function(org){
        var me = this;

        var info = '';
        info += '<div class="ui raised segment">' +
        '<div class="pink ui top attached label">單位資訊</div>' +
        '<div>名稱：' + org.name + '</div>' +
        '<div>類別：' + org.nptypename + '</div>' +
        '<div>地址：' + org.addr + '</div>';

        if(org.phone)   info += '<div>電話：' + org.phone + '</div>';
        if(org.purpose) info +='<div>宗旨：' + org.purpose + '</div>';
        if(org.mission) info +='<div>任務：' + org.mission + '</div>';

        info += '<div><a href="../homepage/detail/' + org.id + '" target="_blank">單位詳細資料</a></div>' +
        '<br/>' +
        me.map.createPopupLocToolbar(org.x, org.y) +
        '</div>';

        return info;
    },

    expandAllOrgType: function(){
        var me = this;

        var treePanel = me.getOrgTypeTree();

        Ext.suspendLayouts();
        treePanel.expandAll();
        Ext.resumeLayouts(true);
    },

    collapseAllOrgType: function(){
        var me = this;

        var treePanel = me.getOrgTypeTree();

        Ext.suspendLayouts();
        treePanel.collapseAll();
        Ext.resumeLayouts(true);
    },

    deselectAllOrgType: function(){
        var me = this;

        var treePanel = me.getOrgTypeTree();
        var root = treePanel.getRootNode();

        Ext.suspendLayouts();
        root.eachChild(function(node) {
            me.setChildNodesChecked(node, false);
        });
        Ext.resumeLayouts(true);
    },

    setChildNodesChecked: function(node, checked){
        var me = this;

        if(node.data.checked != null){
            node.set('checked', checked);
        }

        if (node.hasChildNodes()) {
            node.eachChild(function(childNode) {
                me.setChildNodesChecked(childNode, checked);
            });
        }
    },

    onOrgLayerFeatureClick: function(evt){
        var me = this;

        var feature = evt.feature;
        var geometry = feature.geometry;
        var info = me.createOrgPopupInfo(feature.attributes.org);

        me.map.addOrgPopup(geometry.x, geometry.y, info);
    },

    onCountyChange: function(combo, newValue, oldValue, eOpts){
        var me = this;

        //var cntcode = records[0].data.cntcode;
        var cntcode = newValue;
        var comboTownship = me.getComboTownship();
        var townshipStore = comboTownship.getStore();

        // 清除
        Ext.suspendLayouts();
        comboTownship.setDisabled(true);
        comboTownship.clearValue();
        townshipStore.clearFilter();
        townshipStore.removeAll();
        Ext.resumeLayouts(true);

        // 讀取行政里
        townshipStore.load({
            params: {
                cntcode: cntcode
            },
            callback: function(records, operation, success) {
                if(success){
                    comboTownship.setDisabled(false);
                }
            },
            scope: this
        });
    },

    addRecordFeatureNptypeHoverStyle: function(record){
        var me = this;

        var nptype = record.raw.feature.attributes.nptype;
        var index = nptype.indexOf('_hover');
        if(index === -1){
            record.raw.feature.attributes.nptype += '_hover';
            me.orgVecLayer.drawFeature(record.raw.feature);
        }
    },

    removeRecordFeatureNptypeHoverStyle: function(record){
        var me = this;

        var nptype = record.raw.feature.attributes.nptype;
        var index = nptype.indexOf('_hover');
        if(index !== -1){
            nptype = nptype.substring(0, index);
            record.raw.feature.attributes.nptype = nptype;
            me.orgVecLayer.drawFeature(record.raw.feature);
        }
    },

    onOrgResultWindowGridItemMouseEnter: function( grid, record, item, index, e, eOpts ){
        var me = this;

        if(me.hoverItems.length > 0){
            for(var i=0 ; i<me.hoverItems.length ; i++){
                var rec = me.hoverItems[i];
                me.removeRecordFeatureNptypeHoverStyle(rec);
            }
            me.hoverItems.length = 0;
        }

        me.addRecordFeatureNptypeHoverStyle(record);
        me.hoverItems.push(record);
    },

    onOrgResultWindowGridItemMouseLeave: function( grid, record, item, index, e, eOpts ){
        var me = this;

        me.removeRecordFeatureNptypeHoverStyle(record);
    }
});