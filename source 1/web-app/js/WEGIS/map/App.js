Ext.define('WEGIS.map.App', {
    singleton: true,

    appCtrl: null,

    getAppCtrl: function(){
        var me = this;

        if(me.appCtrl == null){
            me.appCtrl = WEGIS.getApplication().getController('App');
        }
    },

    openAddLayerWindow: function(){
        var me = this;

        me.getAppCtrl();
        me.appCtrl.openAddLayerWindow();
    },

    openLocateWindow: function(){
        var me = this;

        me.getAppCtrl();
        me.appCtrl.openLocateWindow();
    },

    openOrgQueryWindow: function(){
        var me = this;

        me.getAppCtrl();
        me.appCtrl.openOrgQueryWindow();
    },

    openRoutingWindow: function(){
        var me = this;

        me.getAppCtrl();
        me.appCtrl.openRoutingWindow();
    },

    toggleLayerList: function(){
        var me = this;

        me.getAppCtrl();
        me.appCtrl.toggleLayerList();
    }

});