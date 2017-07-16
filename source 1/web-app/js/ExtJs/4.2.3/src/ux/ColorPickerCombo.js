Ext.define('Ext.ux.ColorPickerCombo', {
    extend: 'Ext.form.field.Trigger',
    alias: 'widget.combocolor',
    picker: null,

    initComponent: function () {
        var me = this;

        Ext.applyIf(me, {
            listeners: {
                afterrender: me.onAfterRender
            }
        });

        me.callParent(arguments);
    },

    detectFontColor : function(color){
        var me = this;
        var value;

        if(!color){
            value = '#FFFFFF';
        }
        else{
            value = [
                me.h2d(this.value.slice(1, 3)),
                me.h2d(this.value.slice(3, 5)),
                me.h2d(this.value.slice(5))
            ];
        }

        var avg = (value[0] + value[1] + value[2]) / 3;
        me.setFieldStyle({color: ((avg > 128) ? '#000' : '#FFF')});
    },

    onAfterRender: function(comp, eOpts){
        var me = this;

        me.setFieldStyle({background: me.value});
        me.detectFontColor(me.value);
    },

    h2d: function(d){
        return parseInt(d, 16);
    },

    onTriggerClick: function() {
        var me = this;

        if(!me.picker || me.picker.hidden == true) {
            me.picker = Ext.create('Ext.picker.Color', {
                colors : [
                    'FFEBEE', 'FCE4EC', 'F3E5F5', 'EDE7F6', 'E3F2FD', 'F1F8E9', 'F9FBE7', 'FFF3E0',
                    'EF9A9A', 'F48FB1', 'CE93D8', 'B39DDB', '90CAF9', 'C5E1A5', 'E6EE9C', 'FFCC80',
                    'EF5350', 'EC407A', 'AB47BC', '7E57C2', '42A5F5', '9CCC65', 'D4E157', 'FFA726',
                    'E53935', 'D81B60', '8E24AA', '5E35B1', '1E88E5', '7CB342', 'C0CA33', 'FB8C00',
                    'B71C1C', '880E4F', '4A148C', '311B92', '0D47A1', '33691E', '827717', 'E65100'
                ],
                pickerField: this,
                ownerCt: this,
                renderTo: document.body,
                floating: true,
                hidden: false,
                focusOnShow: true,
                style: {
                    backgroundColor: "#fff"
                } ,
                listeners: {
                    scope: this,
                    select: function(field, value, opts){
                        me.setValue('#' + value);
                        me.setFieldStyle({background: '#' + value});
                        me.detectFontColor(value);
                        me.picker.hide();
                    },
                    show: function(field,opts){
                        field.getEl().monitorMouseLeave(500, field.hide, field);
                    }
                }
            });

            me.picker.alignTo(me.inputEl, 'tl-bl?');
            me.picker.show(me.inputEl);
        }
        else {
            me.picker.hide();
        }
    }
});