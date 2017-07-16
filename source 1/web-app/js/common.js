function commonjs_selectbox_refresh_by_json(params) {
    var i1 = "#" + eid(params.id1);
    var i2 = "#" + eid(params.id2);
    jQuery.getJSON(
        "/open404/tools/selectbox_json",
        { type: params.type, code: jQuery(i1).val(), extras: params.extras },
        function(json) {
            jQuery(i2 + " option[default!=true]").remove();
            jQuery.each(json, function(i, v) {
                jQuery("<option />").attr("value", v.c).html(v.n).appendTo(i2);
            });

            if (typeof(params.callback) == "function") {
                params.callback(json);
            }
        }
    );
}

function commonjs_bring_code(params) {
    var i1 = "#" + eid(params.id1);
    var i2 = "#" + eid(params.id2);
    jQuery.getJSON(
        "/open404/tools/commonjs_bring_code",
        { type: params.type, code: jQuery(i1).val(), extras: params.extras },
        function(json) {
            jQuery(i2).val(json.code);
            if (typeof(params.callback) == "function") {
                params.callback(json);
            }
        }
    );
}

function commonjs_cnt_vilg_link(u1, u3) {
    jQuery("#" + u1).change(function() {
        commonjs_selectbox_refresh_by_json({ type: "first_vilg_from_cnt", id1: u1, id2: u3 });
    });
}

function nvl(v, d) {  return (v ? v : d); }
function eid(v) { return v.replace(/\./g, "\\."); }
function jqogs(obj) {
    if (obj.length < 1) return "";

    var tnn = obj.get(0).nodeName;
    if (tnn == "SELECT") { return obj.children("option:selected").html(); }
    else if (tnn == "INPUT") { return obj.val(); }
    else { return "UNRECOGNIZED-ELEMENT"; }
}

// 處理村里，01:文化里
var removeVilgcode = function(text){
    var index = text.lastIndexOf(':');
    if(index > -1){
        var length = text.length-index-1;
        text = text.substr(index+1, length);
    }

    return text;
}

function copy_addr(from, to, divId){
    if(from == null){
        var twnspcode = document.getElementById('twnspcode').value
        var vilgcode = document.getElementById('vilgcode').value
        var postcode = document.getElementById('postcode').value
        var addr = document.getElementById('addr').value
    }else{
        var twnspcode = document.getElementById(from+'Twnspcode').value
        var vilgcode = document.getElementById(from+'Vilgcode').value
        var postcode = document.getElementById(from+'Postcode').value
        var addr = document.getElementById(from+'Addr').value
    }
    jQuery.ajax({
        type:'POST',
        data:{
            twnspcode:twnspcode,
            vilgcode:vilgcode,
            postcode:postcode,
            addr:addr,
            to:to
        },
        url:'/open404/ce100/sameRegaddr',
        success:function(data){
            jQuery('#'+divId).html(data);
        },error:function(XMLHttpRequest,textStatus,errorThrown){
            showMessage("系統發生錯誤，請洽系統管理員！");
        }});
}

function copy_addr_1(map) {
    if (!map) { map = {}; }
    var p = nvl(map.default_name_prefix, "");

    var c = "#" + eid(nvl(map.cnt,   p + "cntcode"));
    var t = "#" + eid(nvl(map.twnsp, p + "twnspcode"));
    var v = "#" + eid(nvl(map.vilg,  p + "vilgcode"));
    var n = "#" + eid(nvl(map.neig,  p + "neig"));
    var a = "#" + eid(nvl(map.addr,  p + "addr"));
    var d = "#" + eid(nvl(map.dest,  p + "informaddress"));
    
    var cv = jqogs(jQuery(c));
    var tv = jqogs(jQuery(t));
    var vv = removeVilgcode(jqogs(jQuery(v)));
    var nv = jqogs(jQuery(n)) + "鄰";
    var av = jqogs(jQuery(a));

    jQuery(d).val(cv + tv + vv + nv + av);
}

function copy_addr_2(map) {
    if (!map) { map = {} }
    var p = nvl(map.default_name_prefix, "");

    var c = "#" + eid(nvl(map.cnt,   p + "bs130.cntcode"));
    var t = "#" + eid(nvl(map.twnsp, p + "bs130.twnspcode"));
    var v = "#" + eid(nvl(map.vilg,  p + "bs130.vilgcode"));
    var n = "#" + eid(nvl(map.neig,  p + "bs130.neig"));
    var a = "#" + eid(nvl(map.addr,  p + "bs130.addr"));
    var d = "#" + eid(nvl(map.dest,  p + "bs130.informaddress"));

    var cv = jqogs(jQuery(c));
    var tv = jqogs(jQuery(t));
    var vv = jqogs(jQuery(v));
    var nv = jqogs(jQuery(n)) + "鄰";
    var av = jqogs(jQuery(a));

    jQuery(d).val(cv + tv + vv + nv + av);
}

function copy_addr_3(map) {
    if (!map) { map = {}; }
    var p = nvl(map.default_name_prefix, "");

    var c = "#" + eid(nvl(map.cnt,   p + "bs130_cntcode"));
    var t = "#" + eid(nvl(map.twnsp, p + "bs130_twnspcode"));
    var v = "#" + eid(nvl(map.vilg,  p + "bs130_vilgcode"));
    var n = "#" + eid(nvl(map.neig,  p + "bs130_neig"));
    var a = "#" + eid(nvl(map.addr,  p + "bs130_addr"));
    var d = "#" + eid(nvl(map.dest,  p + "bs130_informaddress"));

    var cv = jqogs(jQuery(c));
    var tv = jqogs(jQuery(t));
    var vv = jqogs(jQuery(v));
    var nv = jqogs(jQuery(n)) + "鄰";
    var av = jqogs(jQuery(a));

    jQuery(d).val(cv + tv + vv + nv + av);
}

function copy_addr_4(map) {
    if (!map) { map = {}; }
    var p = nvl(map.default_name_prefix, "");

    var c = "#" + eid(nvl(map.cnt,   p + "bs130_2_cntcode"));
    var t = "#" + eid(nvl(map.twnsp, p + "bs130_2_twnspcode"));
    var v = "#" + eid(nvl(map.vilg,  p + "bs130_2_vilgcode"));
    var n = "#" + eid(nvl(map.neig,  p + "bs130_2_neig"));
    var a = "#" + eid(nvl(map.addr,  p + "bs130_2_addr"));
    var d = "#" + eid(nvl(map.dest,  p + "bs130_2_informaddress"));

    var cv = jqogs(jQuery(c));
    var tv = jqogs(jQuery(t));
    var vv = jqogs(jQuery(v));
    var nv = jqogs(jQuery(n)) + "鄰";
    var av = jqogs(jQuery(a));

    jQuery(d).val(cv + tv + vv + nv + av);
}

function bind_data_ajaxly(fid, callback) {
    var q = jQuery("#" + fid);
    var s = q.serialize();
    var l = q.attr("action");

    var rme = replace_with_ajax_loading("#" + fid);

    q.load(l, s, function() {
        if (typeof(refresh_summary) == "function") {
            refresh_summary();
        }

        if (callback) {
            callback();
        }
    });
}
function bind_data_ajaxly_callback_first(fid, callback) {
    var q = jQuery("#" + fid);
    var s = q.serialize();
    var l = q.attr("action");

    var rme = replace_with_ajax_loading("#" + fid);

    q.load(l, s, function() {
        if (callback) {
            callback();
        }
        if (typeof(refresh_summary) == "function") {
            refresh_summary();
        }

    });
}
function bind_data_ajaxly_and_closeDialog(fid,qid,callback) {
    var q = jQuery("#" + fid);
    var s = q.serialize();
    var l = q.attr("action");
    var c = jQuery("#" + qid); 
    var rme = replace_with_ajax_loading("#" + fid);
    var msg = "";
    jQuery.ajax({
        url: l,
        data:s ,
        success:function(data) {
                  q.parents('.ui-dialog-content').dialog('close');
                  c.submit();
         },
         error:function(data) {
                  jAlert('系統錯誤','系統訊息');
         }
      }).always(function(data) {
                console.log(data);
                if(!data.message){
                       msg = '審核完成'
                }else{
                       msg = data.message
                }
//                  jAlert(msg,'系統訊息');     
    });
    
}

function reload_data_ajaxly(fid) {
    var q = jQuery("#" + fid);
    var s = q.serialize();
    var l = q.attr("reload_action");
    if (!l)
        l = "/open404/general/reload_data_ajaxly";

    var rme = replace_with_ajax_loading("#" + fid);

    q.load(l, s, function() {
        if (typeof(refresh_summary == "function")) {
            refresh_summary();
        }
    });
}

function replace_with_ajax_loading(jqselector, showfirst) {
    var q = jQuery(jqselector);
    if (typeof(showfirst) != "undefined")
        q.show(showfirst);

    var l2 = jQuery("<div />").css({"text-align": "center", "border": "soild thin #dddddd", "padding": "5em"}).append(
        jQuery("<img/>").attr("src", "/open404/images/ajax-loader.gif"));

    var sp = jQuery("<span/>").css("display", "none");

    q.wrapInner(sp).append(l2);

    // returns a function which removes the loading appearence.
    return (function() { l2.remove(); });
}

function jqdialog(selector, title, width, height) {
    jQuery(selector).dialog({ title: title, width: width, height: height, modal: true });
}

function fill_json_each(jmap) { jQuery.each(jmap, function(k, v) { jQuery("#" + eid(k)).val(v); }); }

function hint_error() { alert("發生錯誤。"); }
function hint_success() { alert("成功。"); }

function bring_ref_data(map) {
    startLoad();
    jQuery.ajax({
        cache: false,
        url: "/open404/general/bring_ref_data",
        data: {
            include: map.include,
            exclude: map.exclude,
            ref: map.ref
        },
        dataType:"json",
        success: function(json) {
            if (map.alarm_notfound && json.NOTFOUND == "OK")
                alert("找不到資料。");

            jQuery.each(map.include, function(k, v) {
                var name, fill;
                if (typeof(v) === "object") {
                    if (v.hasOwnProperty("name")) {
                        name = v.name;
                        fill = v.fill;
                    } else {
                        for (i in v) {
                            if (v.hasOwnProperty(i)) {
                                name = v[i];
                                fill = v[i];
                            }
                        }
                    }
                } else if (typeof(v) === "string") {
                    name = v;
                    fill = v;
                }

                var val = json[name];

                if (typeof(v.process) === "function") { val = v.process(val); }
                if (v.fillId) { jQuery(eid("#" + v.fillId)).html(val); }
                if (fill) { jQuery(eid("[name=" + fill + "]")).val(val); }
            });

            if (typeof(map.callback) == "function") {
                map.callback(json);
            }
            endLoad();
        }
    });
}


function bring_ref_data2(map) {
    startLoad();
    jQuery.ajax({
        cache: false,
        url: "/open404/general/bring_ref_data",
        data: {
            include: map.include,
            exclude: map.exclude,
            ref: map.ref
        },
        success: function(json) {
            if (map.alarm_notfound && json.NOTFOUND == "OK")
                alert("找不到資料。");

            jQuery.each(map.include, function(k, v) {
                var name, fill, colname, tagtype;
                if (typeof(v) === "object") {
                    if (v.hasOwnProperty("name")) {
                        name = v.name;
                        fill = v.fill;
                    } else {
                        for (i in v) {
                            if (v.hasOwnProperty(i)) {
                                name = v[i];
                                fill = v[i];
                            }
                        }
                    }
                } else if (typeof(v) === "string") {
                    name = v;
                    fill = v;
                    if(fill=='name'){
                        colname = map.spname.name;
                        tagtype = 'input';
                    }else if(fill=='birthdt'){
                        colname = map.spname.birthdt;
                        tagtype = 'input';
                    }else if(fill=='twnspcode'){
                        colname = map.spname.twnspcode;
                        tagtype = 'select';
                    }
                }

                var val = json[name];

                if (typeof(v.process) === "function") { val = v.process(val); }
                if (v.fillId) { jQuery(eid("#" + v.fillId)).html(val); }
                if (fill) { jQuery("#" + map.formid +" "+tagtype+"[name=" + colname + "]").val(val); }
            });

            if (typeof(map.callback) == "function") {
                map.callback(json);
            }
            endLoad();
        }
    });
}


function datepicker(id) {
    jQuery(function(){
        jQuery(eid("#" + id)).wrap('<span id="' + id + '_date_chooser_span" />').datepick({
            dateFormat: 'yy/mm/dd',
            showOn: 'button',
            buttonImageOnly: true,
            buttonImage: "/open404/images/calendar.gif",
            yearRange: '1912:2053'
        }).blur(function() {
            var u = jQuery(this);
            var q = u.val().match(/^(\d{3})(\d{2})(\d{2})$/);
            if (q != null) {
                u.val(q[1] + "/" + q[2] + "/" + q[3]);
            }
        }).addClass("date");
    });
}

function datepicker2(id, onselect) {
    jQuery(function() {
        jQuery("#h_" + id).datepick({
            dateFormat: 'yy/mm/dd',
            showOn: 'button',
            buttonImageOnly: true,
            buttonImage: '/open404/images/calendar.gif',
            yearRange: '1912:2053',
            onSelect: onselect
        });

        jQuery("#h_" + id).change(function() {
            document.getElementById(id).value = document.getElementById("h_" + id).value.substring(0,6);
        });

        jQuery("#" + id).change(function() {
            if(document.getElementById(id).value) {
                document.getElementById("h_" + id).value = (document.getElementById(id).value + '/01');
            }
        }).blur(function() {
            var u = jQuery(this);
            var q = u.val().match(/^(\d{3})(\d{2})$/);
            if (q != null) {
                u.val(q[1] + "/" + q[2]);
            }
        }).addClass("date");
    });
}

var Timer = function(sec, do_something) {
    this.length = sec*1000;
    this.running = false;
    this.do_something = do_something;
    this.set_timeout = null;
    this.has_ran = false;

    var this2 = this;
    this.run = function() {
        this2.do_something();
        this2.has_ran = true;
        this2.running = false;
    };
}

Timer.prototype.reset = function(start) {
    this.has_ran = false;

    var q = this.running;
    if (q) this.stop();
    if (q || start)
        this.start();
}

Timer.prototype.start = function() {
    if (!this.has_ran && !this.running) {
        this.running = true;
        this.set_timeout = setTimeout(this.run, this.length);
    }
}

Timer.prototype.stop = function() {
    if (this.running) {
        clearTimeout(this.set_timeout);
        this.running = false;
    }
}

var JSONPairStore = function() {
    this.store = new Object();
}

JSONPairStore.prototype.init = function(storekey, async) {
    if (typeof(async) == "undefined")
        async = true;

    var this2 = this;

    if (typeof(this.store[storekey]) == "undefined")
        jQuery.ajax({url: "/open404/tools/jsonstore_" + storekey, dataType: "json", async: async,
                     success: function(json) { this2.store[storekey] = json; }});
}

JSONPairStore.prototype.getv = function(storekey, vkey) {
    if (typeof(this.store[storekey]) == "undefined")
        this.init(storekey, false);
    return this.store[storekey][vkey];
}

function UUID() {
    var S4 = function() {
	return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
    };
    return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
}

function don(st) {
    if (typeof(st) === "string") {
        if (st.length === 0)
            return "";
        else
            return ("&"+st);
    }

    return "";
}

function add_iframe_tab(map, tag) {
    var itp = don(jQuery(".iframe-tab-params").serialize());
    if (!map.other_params)
        map.other_params = itp;
    else
        map.other_params = don(map.other_params + itp);

    map.oldid = jQuery("#tabid").val();

    parent.add_iframe_tab(map);
}

function render_template(map) {
    replace_with_ajax_loading(map.domid);

    var f = jQuery("input.iframe-tab-params-self[name=page-session]").val();
    if (f) {
        map.data["page_session"] = f;
    }

    jQuery.ajax({
        cache: false,
        url: "/open404/general/render_template",
        data: map.data,
        success: function(html) {
            jQuery(map.domid).html(html);
        },
        complete: function() {
            if (typeof(map.callback) == "function")
                map.callback();
        }
    });
}

function previous_document() {
    return get_iframe_window(jQuery(eid("#previous.tabid")).val());
}

function my_parent_window() {
    var q = parent.document.getElementById(parent.pageid_context.parent_of(pageid));
    return (q ? q.contentWindow : null);
}

function get_iframe_window(id) {
    var q = parent.document.getElementById(id);
    return (q ? q.contentWindow : null);
}

function reload_page() {
    window.location.href = window.location.href;
}

function addTab(tabObj, id, title, url, focus, remove_prev) {
    add_iframe_tab({id: id, title: title, url: url, focus: focus, remove_prev: remove_prev});
}

function checkbox_flip(sel, list) {
    var q = jQuery(eid(sel));
    var v = q.val();
    var f = list.shift();

    if (v == f) {
        q.val(list.shift());
    } else {
        q.val(f);
    }
}

function parseDate(text) {
    var q = text.match(/(\d{3})\/(\d{2})(?:\/(\d{2}))?/);
    if (!q) { return null; }

    var yr = parseInt(q[1], 10) + 1911;
    var mon = parseInt(q[2], 10);
    var day = parseInt(q[3], 10);

    return {year: yr, month: mon, day: day ? day : 1};
}

function pad(number, length) {
    var str = '' + number;
    while (str.length < length) {
        str = '0' + str;
    }

    return str;
}

function toDateString1(mod) {
    if (mod instanceof Date) {
        return (toDateString2(mod) + "/" + pad(mod.getDate(), 2));
    } else {
        return null;
    }
}


function toDateString2(mod) {
    if (mod instanceof Date) {
        return (pad(mod.getFullYear()-1911, 3) + "/" + pad(mod.getMonth()+1, 2));
    } else {
        return null;
    }
}

// general listening on certain textfields for uppercase idno conversion
// not sure if it's a good idiom, but it works for now

jQuery(function() {
    // later i find windows doesn't paint readonly input boxes into gray
    jQuery("[readonly=true]").add("[readonly=readonly]").css({
        "background-color": "#e0e0e0"
    });
});

function applyElementUpdates(json) {
    var updates;
    var script;

    if(json.updates) {
        updates = json.updates;
        var element;
        var scripts = new Array();

        for(var i=0 ; i<updates.length ; i++){
            element = updates[i];

            switch(element.mode) {
                case 'execute':
                    scripts.push(element.script);
                    break;
                case 'replace':
                    jQuery(element.target).html(element.content);
                    break;
                case 'prepend':
                    jQuery(element.target).prepend(element.content);
                    break;
                case 'append':
                    jQuery(element.target).append(element.content);
                    break;
            }
        }

        // Run scripts.
        for(var i=0 ; i<scripts.length ; i++){
            var script = document.createElement("SCRIPT");
            document.body.appendChild(script);
            script.text = scripts[i];
            document.body.removeChild(script);
        }

    } // if(json.updates)
} // applyElementUpdates

var LOCAL_PAIR_STORE = new JSONPairStore();

function applyElementUpdates(json) {
    var updates;
    var script;

    if(json.updates) {
        updates = json.updates;
        var element;
        var scripts = new Array();

        for(var i=0 ; i<updates.length ; i++){
            element = updates[i];

            switch(element.mode) {
                case 'execute':
                    scripts.push(element.script);
                    break;
                case 'replace':
                    jQuery(element.target).html(element.content);
                    break;
                case 'prepend':
                    jQuery(element.target).prepend(element.content);
                    break;
                case 'append':
                    jQuery(element.target).append(element.content);
                    break;
            }
        }

        // Run scripts.
        for(var i=0 ; i<scripts.length ; i++){
            var script = document.createElement("SCRIPT");
            document.body.appendChild(script);
            script.text = scripts[i];
            document.body.removeChild(script);
        }

    } // if(json.updates)
} // applyElementUpdates

//宣告qtip設定
function setQtip(uuid) {
    $('#' + uuid).qtip({
        content: {
            attr: 'qtip-text',
            title: {
                text: function (api) {
                    return "<div align='center' class='helpText'>" + $(this).attr('title') + "</div>";
                }
            }
        },
        position: {
            my: 'left bottom',
            at: 'top right',
            target: false
        },
        style: {
            classes: 'qtip-bootstrap'
        }
    });
}

function datediff(fromDate,toDate,interval) { 
        /*
         * DateFormat month/day/year hh:mm:ss
         * ex.
         * datediff('01/01/2011 12:00:00','01/01/2011 13:30:00','seconds');
         */
        var second=1000, minute=second*60, hour=minute*60, day=hour*24, week=day*7; 
        if(new Date(fromDate)=='NaN'){
             fromDate = fromDate.replace('-','/').replace('T',' ').replace('Z','');             
        }
        fromDate = new Date(fromDate); 
        
        toDate = new Date(toDate); 
        var timediff = toDate - fromDate; 
        if (isNaN(timediff)) return NaN; 
        switch (interval) { 
                case "years": return toDate.getFullYear() - fromDate.getFullYear(); 
                case "months": return ( 
                        ( toDate.getFullYear() * 12 + toDate.getMonth() ) 
                        - 
                        ( fromDate.getFullYear() * 12 + fromDate.getMonth() ) 
                ); 
                case "weeks"  : return Math.floor(timediff / week); 
                case "days"   : return Math.floor(timediff / day);  
                case "hours"  : return Math.floor(timediff / hour);  
                case "minutes": return Math.floor(timediff / minute); 
                case "seconds": return Math.floor(timediff / second); 
                default: return undefined; 
        } 
}

function dateFormatter(value, row) {
    if(value < 1911) return "-";
    var date = new Date(value);
    if(date=='NaN'){
        value = value.substring(0,10).replace('-','/')
        date = new Date(value)
    }
    return (date.getFullYear() - 1911) + '/' + pad(date.getMonth() + 1, 2) + '/' + pad(date.getDate(), 2);
}

$('div[data-toggle="tab"]').on('shown', function (e) {
    var myState = $(this).attr('state'),
        state = $('.expandcollapse').attr('state');
    if(myState != state) {
      toggleTab($(this).prop('hash'));
      $(this).attr('state',state);
    }
})

function toggleTab(id){
    $(id).find('.collapse').each(function() {
        $(this).collapse('toggle');
      });
}
