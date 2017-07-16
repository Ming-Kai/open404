Ext.define('WEGIS.controller.App', {
    extend: 'Ext.app.Controller',
    
    refs: [
        { ref: 'westPanel', selector: 'viewport panel[region=west]' },
        { ref: 'mapToolbar', selector: 'wx_mapToolbar' }
    ],
    
    init: function() {
        var me = this;
        
        me.map = WEGIS.map.Map;
        me.olMap = me.map.map;
        me.windows = new Ext.util.MixedCollection();
        
        me.windowMenu = new Ext.menu.Menu(me.createWindowMenu());        
        
        me.control({
            'viewport panel[region=south]': {
                afterrender: function(panel, e){
                    me.taskbar = panel.getComponent('taskbar');
                    me.taskbar.windowMenu = me.windowMenu;
                }
            },
            'wx_routingToolbar': {
                destroy: me.onControlToolbarDestroy
            },
            'wx_mapMainMenu button, button[id$="-menu-trigger"] > menuitem': {
                click: me.onMainMenuButtonClick
            }
        });

    },

    onMainMenuButtonClick: function(button, e, eOpts){
        var me = this;

        switch(button.action){
            case 'toggleLayerList':
                me.toggleLayerList();
                break;
            case 'openBookmarkWindow':
                me.openBookmarkWindow(button);
                break;
            case 'openAddLayerWindow':
                me.openAddLayerWindow(button);
                break;
            case 'openLocateWindow':
                me.openLocateWindow();
                break;
            case 'openRoutingWindow':
                me.openRoutingWindow();
                break;
            case 'openSocQueryWindow':
                me.openSocQueryWindow();
                break;
            case 'openOrgQueryWindow':
                me.openOrgQueryWindow();
                break;
            case 'openPeopleStatWindow':
                me.createPeopleStatWindow();
                break;
            case 'openSocStatWindow':
                me.createSocStatWindow();
                break;
        }
    },

    toggleLayerList: function(){
        var me = this;
        var west = me.getWestPanel();
        west.toggleCollapse();
    },

    openBookmarkWindow: function(button){
        var me = this;
        me.fireEvent('mapOpenBookmarkWindow', button);
    },

    openAddLayerWindow: function(button){
        var me = this;
        me.fireEvent('mapOpenAddWMSLayerWindow', button);
    },

    openLocateWindow: function(){
        var me = this;
        me.createLocateWindow();
        //me.fireEvent('mapOpenLocateWindow');
    },

    openRoutingWindow: function(){
        var me = this;
        me.createRoutingWindow();
        //me.fireEvent('mapOpenRoutingWindow');
    },

    openSocQueryWindow: function(){
        var me = this;
        me.createSocQueryWindow();
    },

    openOrgQueryWindow: function(){
        var me = this;
        me.createOrgQueryWindow();
    },
    
    createLocateWindow: function(){
        var me = this;
        var win = Ext.WindowManager.get('locateWindow');
        
        if(!win){
            win = me.createWindow({}, WEGIS.view.location.LocateWindow);
            win.show();
        }
        else{
            me.restoreWindow(win);
        }
    },
            
    createRoutingWindow: function(){
        var me = this;
        var win = Ext.WindowManager.get('routingWindow');
        
        if(!win){
            win = me.createWindow({
                olMap: WEGIS.map.Map.map,
                routingLocLayer: WEGIS.map.Map.routingLocLayer
            }, WEGIS.view.routing.MainWindow);
            win.show();
        }
        else{
            me.restoreWindow(win);
        }
    },

    createSocQueryWindow: function(){
        var me = this;
        var win = Ext.WindowManager.get('socQueryWindow');

        if(!win){
            win = me.createWindow({}, WEGIS.view.soc.QueryWindow);
            win.show();
        }
        else{
            me.restoreWindow(win);
        }
    },

    createOrgQueryWindow: function(){
        var me = this;
        var win = Ext.WindowManager.get('orgMainWindow');

        if(!win){
            win = me.createWindow({}, WEGIS.view.org.MainWindow);
            win.show();
        }
        else{
            me.restoreWindow(win);
        }
    },

    createPeopleStatWindow: function(){
        var me = this;
        var win = Ext.WindowManager.get('peopleStatWindow');

        if(!win){
            win = me.createWindow({}, WEGIS.view.people.StatWindow);
            win.show();
        }
        else{
            me.restoreWindow(win);
        }
    },

    createSocStatWindow: function(){
        var me = this;
        var win = Ext.WindowManager.get('socStatWindow');

        if(!win){
            win = me.createWindow({}, WEGIS.view.soc.StatWindow);
            win.show();
        }
        else{
            me.restoreWindow(win);
        }
    },
            
    createWindowMenu: function () {
        var me = this;
        return {
            defaultAlign: 'br-tr',
            items: [
                { text: '還原', handler: me.onWindowMenuRestore, scope: me },
                { text: '最小化', handler: me.onWindowMenuMinimize, scope: me },
                '-',
                { text: '關閉', handler: me.onWindowMenuClose, scope: me }
            ],
            listeners: {
                beforeshow: me.onWindowMenuBeforeShow,
                hide: me.onWindowMenuHide,
                scope: me
            }
        };
    },
            
    onWindowClose: function(win) {
        var me = this;
        me.windows.remove(win);
        me.taskbar.removeTaskButton(win.taskButton);
        me.updateActiveWindow();
    },
            
    //------------------------------------------------------
    // Window context menu handlers

    onWindowMenuBeforeShow: function (menu) {
        var items = menu.items.items, win = menu.theWin;
        items[0].setDisabled(win.maximized !== true && win.hidden !== true); // Restore
        items[1].setDisabled(win.minimized === true); // Minimize
    },

    onWindowMenuClose: function () {
        var me = this, win = me.windowMenu.theWin;

        win.close();
    },

    onWindowMenuHide: function (menu) {
        Ext.defer(function() {
            menu.theWin = null;
        }, 1);
    },

    onWindowMenuMaximize: function () {
        var me = this, win = me.windowMenu.theWin;

        win.maximize();
        win.toFront();
    },

    onWindowMenuMinimize: function () {
        var me = this, win = me.windowMenu.theWin;

        win.minimize();
    },

    onWindowMenuRestore: function () {
        var me = this, win = me.windowMenu.theWin;

        me.restoreWindow(win);
    },
 
    //------------------------------------------------------
    // Window management methods
    
    cascadeWindows: function() {
        var x = 0, y = 0,
            zmgr = this.getDesktopZIndexManager();

        zmgr.eachBottomUp(function(win) {
            if (win.isWindow && win.isVisible() && !win.maximized) {
                win.setPosition(x, y);
                x += 20;
                y += 20;
            }
        });
    },
            
    createWindow: function(config, cls) {
        var me = this, win, cfg = Ext.applyIf(config || {}, {
            stateful: false,
            isWindow: true,
            constrainHeader: true,
            minimizable: true
        });

        cls = cls || 'Ext.window.Window';
        //win = new cls(cfg);
        win = Ext.create(cls, cfg);

        me.windows.add(win);

        win.taskButton = me.taskbar.addTaskButton(win);
        win.animateTarget = win.taskButton.el;

        win.on({
            activate: me.updateActiveWindow,
            afterrender: me.onWindowAfterRender,
            beforecollapse: me.onWindowBeforecollapse,
            beforeexpand: me.onWindowBeforeexpand,
            beforeshow: me.updateActiveWindow,
            collapse: me.onWindowCollapse,
            deactivate: me.updateActiveWindow,
            minimize: me.minimizeWindow,
            destroy: me.onWindowClose,
            scope: me
        });

        win.on({
            boxready: function () {
                win.dd.xTickSize = me.xTickSize;
                win.dd.yTickSize = me.yTickSize;

                if (win.resizer) {
                    win.resizer.widthIncrement = me.xTickSize;
                    win.resizer.heightIncrement = me.yTickSize;
                }
            },
            single: true
        });

        // replace normal window close w/fadeOut animation:
        win.doClose = function ()  {
            win.doClose = Ext.emptyFn; // dblclick can call again...
            win.el.disableShadow();
            win.el.fadeOut({
                listeners: {
                    afteranimate: function () {
                        win.destroy();
                    }
                }
            });
        };

        return win;
    },
    
    getActiveWindow: function () {
        var win = null,
            zmgr = this.getDesktopZIndexManager();

        if (zmgr) {
            // We cannot rely on activate/deactive because that fires against non-Window
            // components in the stack.

            zmgr.eachTopDown(function (comp) {
                if (comp.isWindow && !comp.hidden) {
                    win = comp;
                    return false;
                }
                return true;
            });
        }

        return win;
    },

    getDesktopZIndexManager: function () {
        var windows = this.windows;
        // TODO - there has to be a better way to get this...
        return (windows.getCount() && windows.getAt(0).zIndexManager) || null;
    },

    getWindow: function(id) {
        return this.windows.get(id);
    },

    minimizeWindow: function(win) {
        win.minimized = true;
        win.hide();
    },

    restoreWindow: function (win) {
        if (win.isVisible()) {
            win.restore();
            win.toFront();
        } else {
            win.show();
        }
        return win;
    },

    tileWindows: function() {
        var me = this, availWidth = me.body.getWidth(true);
        var x = me.xTickSize, y = me.yTickSize, nextY = y;

        me.windows.each(function(win) {
            if (win.isVisible() && !win.maximized) {
                var w = win.el.getWidth();

                // Wrap to next row if we are not at the line start and this Window will
                // go off the end
                if (x > me.xTickSize && x + w > availWidth) {
                    x = me.xTickSize;
                    y = nextY;
                }

                win.setPosition(x, y);
                x += w + me.xTickSize;
                nextY = Math.max(nextY, y + win.el.getHeight() + me.yTickSize);
            }
        });
    },

    updateActiveWindow: function () {
        var me = this, activeWindow = me.getActiveWindow(), last = me.lastActiveWindow;
        if (last && last.isDestroyed) {
            me.lastActiveWindow = null;
            return;
        }
        if (activeWindow === last) {
            return;
        }

        if (last) {
            if (last.el.dom) {
                last.addCls(me.inactiveWindowCls);
                last.removeCls(me.activeWindowCls);
            }
            last.active = false;
        }

        me.lastActiveWindow = activeWindow;

        if (activeWindow) {
            activeWindow.addCls(me.activeWindowCls);
            activeWindow.removeCls(me.inactiveWindowCls);
            activeWindow.minimized = false;
            activeWindow.active = true;
        }

        me.taskbar.setActiveButton(activeWindow && activeWindow.taskButton);
    },
    
    onWindowBeforecollapse: function(p, direction, animate, eOpts){
        p.originWidth = p.getWidth();
    },
            
    onWindowCollapse: function(p, eOpts){
        p.animate({
            to: {
                width: 200
            }
        });
    },
            
    onWindowBeforeexpand: function(p, animate, eOpts){              
        p.setWidth(p.originWidth);
    },

    onWindowAfterRender: function(component, eOpts){
        var me = this;

        var x = me.map.getWindowX();
        var y = me.map.getWindowY();
        component.setPosition(x, y);
    },
            
    //
    onControlToolbarDestroy: function(toolbar, eOpts){
        var me = this;
        if(toolbar.isActive){
            var mapToolbar = me.getMapToolbar();
            mapToolbar.activateNavigation();
        }
    }
});