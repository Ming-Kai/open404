Ext.define('WEGIS.controller.Layer', {
    extend: 'Ext.app.Controller',
    
    requires:[
        'GeoExt.data.reader.WmsCapabilities',
        'GeoExt.data.WmsCapabilitiesLayerStore',
        'WEGIS.ux.layer.OverlayLayerContextMenu'
    ],
    
    stores: [
        'OverlayLayers'
    ],
    
    models: [
        'OverlayLayer'
    ],
    
    views:[
        'layer.LayerTreeView',
        'layer.OverlayLayerWindow',
        'layer.WMSCapWindow'
    ],
    
    refs: [
        {
            ref: 'olWin', 
            selector: 'wx_overlayLayerWindow',
            autoCreate: true,
            xtype: 'wx_overlayLayerWindow'            
        },
        {
            ref: 'WMSCapWindow', 
            selector: 'wx_WMSCapWindow',
            autoCreate: true,
            xtype: 'wx_WMSCapWindow'
        },
        { 
            ref: 'olGridContextMenu',
            selector: 'wx_overlayLayerContextMenu',
            autoCreate: true,
            xtype: 'wx_overlayLayerContextMenu'
        },
        { ref: 'olGrid', selector: 'wx_overlayLayerWindow grid' },
        { ref: 'wmsCapGrid', selector: 'wx_WMSCapWindow grid' },
        { ref: 'west', selector: 'viewport panel[region=west]' },
        { ref: 'layerTreeView', selector: 'viewport panel[region=west] wx_layerTreeView' }
    ],
    
    map: null,
    olMap: null,
    addLayerIndex: null,
    
    init: function() {
        var me = this;
        
        me.map = WEGIS.map.Map;
        me.olMap = me.map.map;
        me.addLayerIndex = me.map.baseLayers.length;
        
        me.control({
            'wx_layerTreeView': {
                afterrender: me.onLayerTreeAfterrender,
                containercontextmenu: function(e, element, options) { 
                    // Stop the browser getting the event 
                    e.preventDefault(); 
                }
            },
            'wx_overlayLayerWindow': {
                afterrender: me.onOverlayLayerWindowAfterrender
            },
            'wx_overlayLayerWindow grid': {
                //edit: me.onGridEdit,
                itemcontextmenu: me.onOLGridContextMenuShow,
                /** 
                 * Prevents the browser handling the right-click on the control. 
                 */ 
                containercontextmenu: function(view, e) { 
                    // Stop the browser getting the event 
                    e.preventDefault(); 
                },
                contextmenu: function(e, element, options) { 
                    // Stop the browser getting the event 
                    e.preventDefault(); 
                },
                headercontextmenu: function(ct, column, e, t, eOpts) { 
                    // Stop the browser getting the event 
                    e.preventDefault(); 
                }
            },
            'wx_overlayLayerWindow grid numberfield[field=opacity]': {
                change : me.onOpacityFieldEdit
            },
            'wx_overlayLayerWindow grid actioncolumn': {
                actioncolumnitemclick: me.onOverlayLayerGridActionColumnItemClick
            },
            'wx_overlayLayerWindow grid dataview': {
                drop: me.overlayLayerDragAndDrop
            },
            'wx_overlayLayerWindow grid checkcolumn': {
                checkchange: me.toggleOverlayLayer
            },
            'wx_overlayLayerWindow header tool[type=help]': {
                click: me.showHelp
            },
            'wx_overlayLayerContextMenu': {
                beforeshow: me.onOverlayLayerContextMenuBeforeShow
            },
            'wx_overlayLayerContextMenu menuitem': {
                click: me.onOLGridContextMenuItemClick
            },
            'wx_WMSCapWindow button': {
                click: me.onWMSCapWindowButtonClick
            },
            'wx_WMSCapWindow grid actioncolumn': {
                actioncolumnitemclick: me.onWMSCapGridActionColumnItemClick
            },
            'viewport panel[region=west]': {
                afterrender: me.onRegionWestAfterrender
            }
        });
        
        me.listen({
            // We are using Controller event domain here
            controller: {
                // This selector matches any originating Controller
                '*': {      
                    mapToggleOverlayLayerWindow: 'toggleOverlayLayerWindow',
                    mapOpenAddWMSLayerWindow: 'openAddWMSLayerWindow'
                }
            }
        });
        
//        WEGIS.map.Map.on('overlayLayerChanged', function(layer){
//            me.updateOverlayLayerWindow(layer);
//        });

        me.bindMap();
    },
            
            /**
     * 
     *
     * @private
     */
    bindMap: function() {
        var me = this;
        
        // overlay layer綁定圖層清單更新事件
        me.bindLayer(me.map.overlayLayers);
        me.bindLayer(me.map.orgLayers);
        
        // 圖層樹狀選單overlay layer綁定圖層可視事件
        me.olMap.events.register('zoomend', this, function(){
            me.onLayerTreeAfterrender(null, null);
        });

        // 在環域標示圖層裡，對每個圖徵加上流水編號
        if(me.map.bufferMarkLayer){
            me.map.bufferMarkLayer.events.on({
                featureadded: function(evt) {
                    // 加入的環域地點
                    var feature = evt.feature;
                    var x = feature.geometry.x;
                    var y = feature.geometry.y;

                    var length = this.features.length - 1;
                    for(var i = length-1; i>=0 ; i--){
                        // 檢查地點是否有重複
                        if(this.features[i].geometry.CLASS_NAME !== "OpenLayers.Geometry.Point")
                            continue;

                        if(x === this.features[i].geometry.x && y === this.features[i].geometry.y) {
                            this.removeFeatures(feature);
                            break;
                        }
                    }
                    me.refreshBufferMarkLayer(this);
                },
                featuresremoved: function(evt){
                    me.refreshBufferMarkLayer(this);
                }
            });
        }
    },

    bindLayer: function(overlayLayers){
        var me = this;

        for(var i = 0 ; i < overlayLayers.length ; i++ ){
            var overlayLayer = overlayLayers[i];
            overlayLayer.removeFlag = true;
            overlayLayer.events.register('visibilitychanged', me.overlayLayers, function(evt){
                var layer = evt.object;
                me.updateOverlayLayerWindow(layer);
                //me.fireEvent('overlayLayerChanged', layer);
            });
        }
    },

    refreshBufferMarkLayer: function(layer){
        var count = layer.features.length;
        for(var i=0 ; i<count ; i++) {
            var feature = layer.features[i];
            delete feature.attributes.index;
            feature.attributes.index = i+1;
        }
        layer.redraw();
    },
            
    onLayerTreeAfterrender: function(component, eOpts){
        var me = this;

        var treePanel = me.getLayerTreeView();

        Ext.suspendLayouts();
        treePanel.getRootNode().cascadeBy(me.checkScaleInRange, this);
        Ext.resumeLayouts(true);
    },

    checkScaleInRange: function(node) {
        var me = this;

        if(node.isLeaf() && !node.data.layer.isBaseLayer) {
            var layer = node.data.layer;

            var visible = me.isLayerVisible(layer);

            if (visible === false) {
                node.set('cls', 'disableNode');
            } else {
                node.set('cls', 'enableNode');
            }
        }
    },

    isLayerVisible: function(layer){
        var me = this;

        var toggleTreeNode = layer.toggleTreeNode;
        var minScale = layer.minScale;
        var maxScale = layer.maxScale;

        if(toggleTreeNode && (minScale || maxScale)){
            var mapScale = me.olMap.getScale();
            if ((minScale && (minScale < mapScale)) || (maxScale && (maxScale > mapScale))) {
                return false;
            } else {
                return true;
            }
        }

        return true;
    },
            
    /*
     * 圖層管理相關功能
     */ 
    
    onLayerLoadStart: function(e){
        var record = this;
        var layer = e.object;
        record.set('name', layer.name + ' <i class="fa fa-spinner fa-pulse"></i>');
    },
            
    onLayerLoadEnd: function(e){
        var record = this;
        var layer = e.object;
        record.set('name', layer.name);
    },    
    
    toggleOverlayLayerWindow: function(button) {
        var me = this;
        var olWin = me.getOlWin();
        
        if(!olWin.animateTarget){
            olWin.animateTarget = button.el;
        }
        
        if(olWin.isVisible())
            olWin.hide();
        else
            olWin.show();
    },
            
    onOverlayLayerWindowAfterrender: function(component, eOpts){
        var me = this;
        //var olWin = me.getOlWin();
        
        // 初始顯示位置
        component.setPosition(window.innerWidth - 330, 120);
    },
    
    updateOverlayLayerWindow: function(layer) {
        var me = this;
        
        // 開啟圖層清單
        //var olWin = me.getOlWin();
        //olWin.show();
        
        var store = this.getOverlayLayersStore();
        var match = store.find('id', layer.id);
        
        // 圖層開啟
        if(layer.visibility){
            var record;
            layer.removeFlag = true;
            if(match === -1) {
                record = Ext.create('WEGIS.model.OverlayLayer', {
                    id: layer.id,
                    name: layer.name,
                    check: true,
                    opacity: layer.opacity * 100
                });
                
                // register layer load event
                layer.events.register('loadstart', record, me.onLayerLoadStart);                
                layer.events.register('loadend', record, me.onLayerLoadEnd);
                
                record.layer = layer;
                store.insert(0, record);
                me.map.addLayer(layer);
                me.olMap.setLayerIndex(layer, me.addLayerIndex);
                me.addLayerIndex += 1;
            }
            else{
                record = store.getAt(match);
            }
            
            record.set('check', true);
        } 
        else{
            if(match !== -1 && layer.removeFlag) {
                store.removeAt(match);
                me.setOverlayLayerDefault(layer);
                me.map.removeLayer(layer);
                me.addLayerIndex -= 1;
                
                // register layer load event
                layer.events.unregister('loadstart', record, me.onLayerLoadStart);                
                layer.events.unregister('loadend', record, me.onLayerLoadEnd);
            }
        }
    },
            
    onOverlayLayerGridActionColumnItemClick: function(grid, rowIndex, colIndex, item, e, record, row){
        var me = this;
        switch(item.action){
            case 'up':
                me.upOverlayLayer(rowIndex, record);
                break;
            case 'down':
                me.downOverlayLayer(rowIndex, record);
                break;
            case 'remove':
                me.removeOverlayLayer(record);
                break;
        }
    },
            
    upOverlayLayer: function(rowIndex, record){
        var me = this;
        var store = me.getOverlayLayersStore();
      
        if(rowIndex !== 0){         
            var layer = record.layer;
            me.changeRecordIndexInStore(store, record, rowIndex - 1);
            me.olMap.raiseLayer(layer, 1);
        }                 
    }, 
            
    downOverlayLayer: function(rowIndex, record){
        var me = this;        
        var store = me.getOverlayLayersStore();        
        
        if(rowIndex < store.getCount() - 1){
            var layer = record.layer;
            me.changeRecordIndexInStore(store, record, rowIndex + 1);
            me.olMap.raiseLayer(layer, -1);
        } 
    },
            
//    removeOverlayLayer: function(grid, rowIndex, colIndex, item, e, record, row){
//        var me = this;        
//        var store = me.getOverlayLayersStore();
//        var layer = record.layer;
//        
//        store.remove(record);
//        
//        layer.setVisibility(false); 
//        me.setOverlayLayerDefault(layer);
//        me.map.removeLayer(layer);
//    },
            
    toggleOverlayLayer: function(cc, rowIndex, checked, eOpts){
        var me = this;
        var store = me.getOverlayLayersStore();
        var record = store.getAt(rowIndex);

        if(checked){
            me.showOverlayLayer(record.layer);
        }
        else{
            me.hideOverlayLayer(record.layer);
        }
    },
            
    overlayLayerDragAndDrop: function(node, data, overModel, dropPosition, dropHandlers){
        var me = this;
        
        if(data.records.length > 0){
//            var fromLayer = me.getLayerFromOverlayLayerRecord(data.records[0]);
//            var toLayer = me.getLayerFromOverlayLayerRecord(overModel);
            var fromLayer = data.records[0].layer;
            var toLayer = overModel.layer;
            var fromLayerIndex = me.olMap.getLayerIndex(fromLayer);
            var toLayerIndex = me.olMap.getLayerIndex(toLayer);
            
            me.changeOverlayLayerIndex(fromLayer, fromLayerIndex, toLayerIndex);
        }
    },
            
    onOpacityFieldEdit: function(field, newValue, oldValue, eOpts){
        var me = this;
        
        // 編輯透明度
        if(newValue !== oldValue){
            var grid = me.getOlGrid();
            var record = grid.getSelectionModel().getSelection()[0];
            record.layer.setOpacity(newValue / 100);
        }
    },
    
    setOverlayLayerDefault: function(layer){
        if(layer.originalOpacity){
            layer.setOpacity(layer.originalOpacity);
        }
        else{
            layer.setOpacity(1);
        }
    },
            
    onOLGridContextMenuShow: function(view, record, item, index, e, eOpts ){
        var me = this;
        e.preventDefault();
        e.stopEvent();
        
        var cm = me.getOlGridContextMenu();
        var grid = me.getOlGrid();
        var store = me.getOverlayLayersStore();
        var isFirst = (index === 0 ? true : false);
        var isLast = (store.getCount() === (index + 1) ? true : false);

        // ExtJS 4.2.3 context menu不會select row，使用grid.contextMenuRecord紀錄選到的record。
        grid.contextMenuRecord = record;
        cm.setIsFirst(isFirst);
        cm.setIsLast(isLast);
        
        // 顯示context menu
        cm.showAt(e.getXY());
        return false;
    },
            
    onOLGridContextMenuItemClick: function(item, e, eOpts){
        var me = this;  
        var grid = me.getOlGrid();
        var record = grid.contextMenuRecord;

        if(record){
            switch(item.action){
                case 'top':
                    me.moveOverlayLayerToTop(record);
                    break;
                case 'bottom':
                    me.moveOverlayLayerToBottom(record);
                    break;
                case 'showAll':
                    me.showAllOverlayLayer();
                    break;
                case 'hideAll':
                    me.hideAllOverlayLayer();
                    break;
                case 'removeAll':
                    me.removeAllOverlayLayer();
                    break;
                case 'zoomMaxExtent':
                    me.zoomOverlayLayerMaxExtent(record);                    
                    break;
            }
        }
        
        // 關掉contextmenu
        //var contextmenu = this.getOlGridContextMenu();
        //Ext.destroy(contextmenu);
    },        
    
    // 變更overlay layer在openlayers map內的順序，index越大代表排序愈上層。       
    changeOverlayLayerIndex: function(layer, fromIndex, toIndex){
        var me = this; 
        var raiseIndex = toIndex - fromIndex;
        me.olMap.raiseLayer(layer, raiseIndex);
    },
    // 變更store內record順序。
    changeRecordIndexInStore: function(store, record, toIndex){
        store.remove(record);       
        store.insert(toIndex, record);
    },
    // 從overlay layer record 取得layer
//    getLayerFromOverlayLayerRecord: function(record){
//        var me = this; 
//        var layerID = record.get('id');
//        var layer = me.map.getLayerByID(layerID);
//        return layer;
//    },
    
    moveOverlayLayerToBottom: function(record){
        var me = this; 
        var store = record.store;
        
        // last overlay layer
        var lastLayer = store.getAt(store.getCount() - 1).layer;
        var lastLayerIndex = me.olMap.getLayerIndex(lastLayer);
        
        var layer = record.layer;
        var layerIndex = me.olMap.getLayerIndex(layer);
        
        me.changeRecordIndexInStore(store, record, store.getCount() - 1);        
        me.changeOverlayLayerIndex(layer, layerIndex, lastLayerIndex);
    },
    
    moveOverlayLayerToTop: function(record){
        var me = this;        
        var store = record.store;
        
        // first overlay layer
        var firstLayer = store.getAt(0).layer;
        var firstLayerIndex = me.olMap.getLayerIndex(firstLayer);
        
        var layer = record.layer;
        var layerIndex = me.olMap.getLayerIndex(layer);
        
        me.changeRecordIndexInStore(store, record, 0);
        me.changeOverlayLayerIndex(layer, layerIndex, firstLayerIndex);
    },
            
    showOverlayLayer: function(layer){        
        if(layer && layer.visibility === false){
            layer.setVisibility(true);
        }
    },
            
    hideOverlayLayer: function(layer){        
        if(layer && layer.visibility === true){
            layer.removeFlag = false;
            layer.setVisibility(false);
        }
    },
            
    removeOverlayLayer: function(record){
        var me = this;    
        var store = record.store;
        var layer = record.layer;
        
        store.remove(record);        
        layer.setVisibility(false); 
        me.setOverlayLayerDefault(layer);
        me.map.removeLayer(layer);
        
        delete record;
        if(record.data.isExternalWMS){
            delete layer;
        }
    },
           
    showAllOverlayLayer: function(){
        var me = this;        
        var grid = me.getOlGrid();
        var store = grid.getStore();
        var count = store.getCount();
        
        store.suspendEvents();
        for(var i=0 ; i < count ; i++){
            var record = store.getAt(i);
            if(record.data.check === false){
                me.showOverlayLayer(record.layer);
                record.set('check', true)
            }
        }
        store.resumeEvents();
        grid.getView().refresh();
    },
            
    hideAllOverlayLayer: function(){
        var me = this;        
        var grid = me.getOlGrid();
        var store = grid.getStore();
        var count = store.getCount();
        
        store.suspendEvents();
        for(var i=0 ; i < count ; i++){
            var record = store.getAt(i);
            if(record.data.check === true){
                me.hideOverlayLayer(record.layer);
                record.set('check', false);
            }
        }
        store.resumeEvents();
        grid.getView().refresh();
    },
            
    removeAllOverlayLayer: function(){
        var me = this;        
        var grid = me.getOlGrid();
        var store = grid.getStore();
        var count = store.getCount() - 1;
        
        store.suspendEvents();
        for(var i=count ; i >= 0 ; i--){
            var record = store.getAt(i);
            me.removeOverlayLayer(record);
            me.addLayerIndex--;
        }
        store.resumeEvents();
        grid.getView().refresh();
    },
            
    zoomOverlayLayerMaxExtent: function(record){
        var me = this;
        
        if(record.layer.maxExtent){
            me.olMap.zoomToExtent(record.layer.maxExtent);
        }
    },
    
    showHelp: function(){
        Ext.MessageBox.show({
            title: '<i class="fa fa-question-circle fa-lg"></i>&nbsp;圖層管理功能說明',
            msg: '<b style="color: red;"><i class="fa fa-exclamation-triangle fa-lg"></i>&nbsp;建議同時不要開啟過多圖層，以免降低系統效能。</b><br/><br/>' +
                '<b style="color: blue;">圖層管理範圍：</b>1. 從圖層清單所開啟的圖層、2. 從加入圖層功能所加入的圖層。<br/>' +
                '<b style="color: blue;">圖層顯示順序：</b>越上面的圖層優先顯示。<br/>' +
                '<b style="color: blue;">功能選單：</b>在資料列上點擊滑鼠右鍵開啟功能選單。<br/>' +
                '<b style="color: blue;">透明度：</b>值為0~100%，0%為透明，100%為不透明。'
        });
    },
    
    onOverlayLayerContextMenuBeforeShow: function(menu, eOpts){
        var topItem = menu.down('menuitem[action=top]');
        var bottomItem = menu.down('menuitem[action=bottom]');
        topItem.setDisabled(menu.getIsFirst());
        bottomItem.setDisabled(menu.getIsLast());
    },
    
    /**
     * 加入外部WMS圖層相關功能
     */        
    openAddWMSLayerWindow: function(button) {
        var me = this;
        var wmsCapWindow = me.getWMSCapWindow();

        //if(!wmsCapWindow.animateTarget){
        //    wmsCapWindow.animateTarget = button.el;
        //}
        
        if(!wmsCapWindow.isVisible()){
            wmsCapWindow.show();
        }       
    },
      
    addExternalWMSLayer: function(){
        var me = this;
        var grid = me.getWmsCapGrid();
        var sm = grid.getSelectionModel();
        var count = sm.getCount();
        
        if(count > 0){
            var olGridStore = me.getOverlayLayersStore();
            var record = sm.getSelection()[0];
            var layer = record.getLayer();
            var url = layer.url + layer.name;

            if(!me.isExternalWMSExist(url)){
                var srs = me.olMap.getProjection();

                if(!record.data.srs[srs]){
                    Ext.MessageBox.show({
                        title: '訊息',
                        msg: '此圖層沒有提供' + srs + '座標系統，無法加入！',
                        buttons: Ext.MessageBox.OK,
                        icon: Ext.MessageBox.WARNING
                    });
                    return;
                }
                
                var newLayer = layer.clone();
                var mapSize = me.olMap.getSize();                
                newLayer.singleTile = true;
                newLayer.ratio = Math.min(1920/Math.max(mapSize.w, mapSize.h), 1);
                newLayer.removeFlag = true;
                
                var bbox = record.data.bbox[srs];
                if(bbox){
                    newLayer.maxExtent = new OpenLayers.Bounds(bbox.bbox[0], bbox.bbox[1], bbox.bbox[2], bbox.bbox[3]);
                }
                else{
                    newLayer.maxExtent = me.olMap.getMaxExtent();
                }
                
                var olRecord = Ext.create('WEGIS.model.OverlayLayer', {
                    id: newLayer.id,
                    name: newLayer.name,
                    check: true,
                    opacity: newLayer.opacity * 100,
                    isExternalWMS: true
                });
                
                // register layer load event
                newLayer.events.register('loadstart', olRecord, me.onLayerLoadStart);                
                newLayer.events.register('loadend', olRecord, me.onLayerLoadEnd);
                
                olRecord.layer = newLayer;
                olGridStore.insert(0, olRecord);
                me.map.addLayer(newLayer);
                me.olMap.setLayerIndex(newLayer, me.addLayerIndex);
                me.addLayerIndex += 1;
                olRecord.set('check', true);
                 
                Ext.MessageBox.show({
                    title: '訊息',
                    msg: 'WMS圖層加入成功！',
                    buttons: Ext.MessageBox.OK,
                    icon: Ext.MessageBox.INFO
                });
            }
            else{                
                Ext.MessageBox.show({
                    title: '訊息',
                    msg: '圖層已在清單中！',
                    buttons: Ext.MessageBox.OK,
                    icon: Ext.MessageBox.WARNING
                });
            }
        }
        else{
            Ext.MessageBox.show({
                title: '訊息',
                msg: '請選擇圖層！',
                buttons: Ext.MessageBox.OK,
                icon: Ext.MessageBox.INFO
            });
        }
    },
            
    isExternalWMSExist: function(url){
        var me = this;
        var olGridStore = me.getOverlayLayersStore();
        var count = olGridStore.getCount();
        for(var i=0; i<count ; i++){
            var record = olGridStore.getAt(i);
            var layer = record.layer;
            var matchUrl = layer.url + layer.name;
            if(record.get('isExternalWMS') === true && url === matchUrl){
                return true;
            }
            else{
                return false;
            }
        }
    },
            
    loadWMSCapabilities: function(){
        var me = this;
        var wmsCapWin = me.getWMSCapWindow();
        
        var wmsUrl = wmsCapWin.down('textfield[name=wmsUrl]').value;
        var wmsVer = wmsCapWin.down('combo[name=wmsVer]').value;

        if(!wmsUrl){
            Ext.MessageBox.show({
                title: '加入圖層',
                msg: '請選擇WMS來源！',
                buttons: Ext.MessageBox.OK,
                icon: Ext.MessageBox.INFO
            });

            return;
        }
        
        me.getWMSCap(wmsUrl, wmsVer);
    },
            
    getWMSCap: function(wmsUrl, wmsVer){
        var me = this;
        
        // 清除grid資料
        var store = Ext.data.StoreManager.lookup('wmscapsStore');
        store.removeAll();
        
        // loading message
        var wmsCapGrid = me.getWmsCapGrid();
        wmsCapGrid.setLoading('讀取中，請稍後！');            
        
        // Get WMS capabilities
        Ext.Ajax.request({
            url: 'proxy',
            method: "GET",
            params : {
                url: wmsUrl + '?SERVICE=WMS&REQUEST=GetCapabilities&VERSION=' + wmsVer
            },
            success: function (response, options) {
                try{
                    var doc = response.responseXML;
                    if (!doc || !doc.documentElement) {
                        doc = response.responseText;
                    }

                    var reader = Ext.create("GeoExt.data.reader.WmsCapabilities", {keepRaw: true});
                    var records = reader.readRecords(doc);
                    store.loadRecords(records.records);
                }
                catch (e){
                    Ext.MessageBox.show({
                        title: '錯誤',
                        msg: '讀取失敗！',
                        buttons: Ext.MessageBox.OK,
                        icon: Ext.MessageBox.ERROR
                    });
                }
            },
            failure: function (response, options) {
                Ext.MessageBox.show({
                    title: '錯誤',
                    msg: '讀取失敗！',
                    buttons: Ext.MessageBox.OK,
                    icon: Ext.MessageBox.ERROR
                });
            },
            callback: function (options, success, response) {
                wmsCapGrid.setLoading(false);
            }
        });

     },
    
    closeWMSCapWindow: function(){
        var me = this;
        var wmsCapWindow = me.getWMSCapWindow();
        wmsCapWindow.hide();
    },
    
    previewLayer: function(record){
        var layer = record.getLayer().clone();
        layer.singleTile = true;
        var win = Ext.create('Ext.Window', {
            title: "圖層預覽：" + record.get("title"),
            width: 512,
            height: 512,
            layout: "fit",
            constrain: true,
            modal: true,
            items: [{
                xtype: "gx_mappanel",
                layers: [layer],
                extent: record.get("llbbox")
            }]
        });
        win.show();
    },
            
    onWMSCapWindowButtonClick: function(button, e, eOpts){
        var me = this;  
        
        switch(button.action){
            case 'load':
                me.loadWMSCapabilities(); 
                break;
            case 'add':
                me.addExternalWMSLayer();
                break;
            case 'close':
                me.closeWMSCapWindow();
                break;
        }
    },
            
    onWMSCapGridActionColumnItemClick: function(grid, rowIndex, colIndex, item, e, record, row){
        var me = this;  

        switch(item.action){
            case 'preview':
                me.previewLayer(record); 
                break;
        }
    },
     
    onRegionWestAfterrender: function(){
        var me = this;

        var west = me.getWest();
        var header = west.getHeader();
        header.setTitle("<img border='0' src='../images/WEGIS/MapIcon/layerListTitle.png' style='width: 66px;'/>");
    }
});