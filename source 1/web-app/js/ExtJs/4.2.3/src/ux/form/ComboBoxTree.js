Ext.define("Ext.ux.form.ComboBoxTree", {
    extend: "Ext.form.field.Picker",
    requires: ["Ext.tree.Panel"],
    alternateClassName: 'Ext.form.ComboBoxTree',
    alias: ['widget.comboboxtree', 'widget.combotree'],

    initComponent: function() {
        var me = this;

        me.hiddenFieldValue = Ext.create('Ext.form.field.Hidden', {
            name: me.name + 'Value'
        });

        me.callParent(arguments);
    },

    createPicker: function() {
        var self = this;
        var store = Ext.create('Ext.data.TreeStore', {
            autoLoad: false,
            proxy: {
                type: 'ajax',
                url: self.storeUrl,
                extraParams: self.params,
                reader: {
                    type: 'json',
                    root: 'data',
                    successProperty: 'success'
                }
            },
            //root: {
            //    id: self.rootId,
            //    text: self.rootText,
            //    checked: false,
            //    expanded: true
            //},
            viewConfig: {
                loadMask: true
            },
            nodeParam: self.treeNodeParameter,
            listeners: {
                load: function( store, records, options ) {
                    self.setDisabled(false);
                }
            }
        });

        self.picker = new Ext.tree.Panel({
            height: 300,
            autoScroll: true,
            floating: true,
            focusOnToFront: false,
            shadow: true,
            ownerCt: this.ownerCt,
            useArrows: true,
            store: store,
            rootVisible: self.rootVisible === undefined ? false : self.rootVisible,
            tbar:[{
                xtype: 'button',
                text: '全選',
                listeners: {
                    click: self.onSelectAllButtonClick,
                    scope: self
                }
            },{
                xtype: 'button',
                text: '清除選擇',
                listeners: {
                    click: self.onDeselectAllButtonClick,
                    scope: self
                }
            }],
            ///**
            // * Override.
            // */
            //setRootNode: function() {
            //    if (this.getStore().autoLoad) {
            //        this.callParent(arguments);
            //    }
            //}
        });

        self.picker.on({
            checkchange: function(record, checked) {
                var checkModel = self.checkModel;
                if (checkModel == 'double') {
                    var root = self.picker.getRootNode();
                    root.cascadeBy(function(node) {
                        if (node.get('text') != record.get('text')) {
                            node.set('checked', false);
                        }
                    });
                    if (record.get('leaf') && checked) {
                        //self.setRawValue(record.get('id')); // 隐藏值
                        self.setValue(record.get('text')); // 显示值
                    } else {
                        record.set('checked', false);
                        //self.setRawValue(''); // 隐藏值
                        self.setValue(''); // 显示值
                    }
                } else {

                    var cascade = self.cascade;

                    if (checked == true) {
                        if (cascade == 'both' || cascade == 'child' || cascade == 'parent') {
                            if (cascade == 'child' || cascade == 'both') {
                                if (!record.get("leaf") && checked) record.cascadeBy(function(record) {
                                    record.set('checked', true);
                                });

                            }
                            if (cascade == 'parent' || cascade == 'both') {
                                pNode = record.parentNode;
                                for (; pNode != null; pNode = pNode.parentNode) {
                                    pNode.set("checked", true);
                                }
                            }

                        }

                    } else if (checked == false) {
                        if (cascade == 'both' || cascade == 'child' || cascade == 'parent') {
                            if (cascade == 'child' || cascade == 'both') {
                                if (!record.get("leaf") && !checked) record.cascadeBy(function(record) {

                                    record.set('checked', false);

                                });
                            }
                        }
                    }

                    self.refreshValue();
                }

                //console.log(this.getRawValue());
            }
            //itemclick: function(tree, record, item, index, e, options) {
            //    var checkModel = self.checkModel;
            //
            //    if (checkModel == 'single') {
            //        if (record.get('leaf')) {
            //            self.setRawValue(record.get('id')); // 隐藏值
            //            self.setValue(record.get('text')); // 显示值
            //        } else {
            //            self.setRawValue(''); // 隐藏值
            //            self.setValue(''); // 显示值
            //        }
            //    }
            //
            //}
        });


        return self.picker;
    },

    alignPicker: function() {
        var me = this,
            picker, isAbove, aboveSfx = '-above';
        if (this.isExpanded) {
            picker = me.getPicker();
            if (me.matchFieldWidth) {
                picker.setWidth(me.bodyEl.getWidth());
            }
            if (picker.isFloating()) {
                picker.alignTo(me.inputEl, "", me.pickerOffset); // ""->tl
                isAbove = picker.el.getY() < me.inputEl.getY();
                me.bodyEl[isAbove ? 'addCls': 'removeCls'](me.openCls + aboveSfx);
                picker.el[isAbove ? 'addCls': 'removeCls'](picker.baseCls + aboveSfx);
            }
        }
    },

    refreshValue: function(){
        var me = this;

        var records = me.picker.getView().getChecked(),
            names = [],
            values = [];

        Ext.Array.each(records,
            function(rec) {
                if(rec.get('leaf')){
                    names.push(rec.get('text'));
                    values.push(rec.get('id'));
                }
            }
        );

        me.hiddenFieldValue.setValue(values.join(','));
        //self.setRawValue(values.join(';')); // 隐藏值
        var length = names.length;
        if(length <= 5)
            me.setValue(names.join(';')); // 显示值
        else
            me.setValue('已選取' + length + '個項目'); // 显示值
    },

    onSelectAllButtonClick: function(obj, e, eOpts){
        var me = this;
        me.changeAllTreeCheck(true);
    },

    onDeselectAllButtonClick: function(obj, e, eOpts){
        var me = this;
        me.changeAllTreeCheck(false);
    },

    changeAllTreeCheck: function(checked){
        var me = this;

        var treePanel = me.picker;
        var root = treePanel.getRootNode();

        Ext.suspendLayouts();
        root.eachChild(function(node) {
            node.set('checked', checked)
            if (node.hasChildNodes()) {
                node.eachChild(function(childNode) {
                    childNode.set('checked', checked);
                });
            }
        });
        Ext.resumeLayouts(true);

        me.refreshValue();
    },

    loadTwnsp: function(statTime){
        var me = this;

        var params = {
            statTime: statTime
        };

        me.load(params);
    },

    loadItems: function(prodID){
        var me = this;

        var params = {
            prod: prodID
        };

        me.load(params);
    },

    load: function(params){
        var me = this;

        var tree = me.picker;
        if(tree){
            var store = tree.getStore();

            // 清除
            me.clearTreeStore();

            // 讀取
            store.load({
                params: params,
                callback: function(records, operation, success) {
                },
                scope: this
            });
        }
        else{
            me.params = params;
        }
    },

    clearTreeStore: function(){
        var me = this;

        var tree = me.picker;
        if(tree){
            var store = tree.getStore();
            store.clearFilter();
            store.getRootNode().removeAll();
            me.refreshValue();
        }
    },

    showAndEnable: function(){
        var me = this;

        me.setDisabled(false);
        me.hiddenFieldValue.setDisabled(false);
        me.show();
    },

    hideAndDisable: function(){
        var me = this;

        me.setDisabled(true);
        me.hiddenFieldValue.setDisabled(true);
        me.hide();
    },

    clear: function(){
        var me = this;

        me.clearTreeStore();
    }
});