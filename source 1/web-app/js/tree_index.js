var tabs;
var tip;

var zTreeObj;
var zTreeObj1;
var zTreeObj2;

var RF1 = false;
var RF2 = false;
var RFi = 0;

(function ($) {
    // 把 $ bind 成 jQuery
    $(window).bind("beforeunload", function () {
        jQuery.post("${createLink(controller: 'ajax', action: 'close_window_event')}");
    });

    $(function () {
        var layoutSettings_Outer = {
            name: "outerLayout" // NO FUNCTIONAL USE, but could be used by custom code to 'identify' a layout
            // options.defaults apply to ALL PANES - but overridden by pane-specific settings
            ,	defaults: {
                size:					"auto"
                ,	minSize:				50
                ,	paneClass:				"pane" 		// default = 'ui-layout-pane'
                ,	resizerClass:			"resizer"	// default = 'ui-layout-resizer'
                ,	togglerClass:			"toggler"	// default = 'ui-layout-toggler'
                ,	buttonClass:			"button"	// default = 'ui-layout-button'
                ,	contentSelector:		".content"	// inner div to auto-size so only it scrolls, not the entire pane!
                ,	contentIgnoreSelector:	"span"		// 'paneSelector' for content to 'ignore' when measuring room for content
                ,	togglerLength_open:		5			// WIDTH of toggler on north/south edges - HEIGHT on east/west edges
                ,	togglerLength_closed:	5			// "100%" OR -1 = full height
                ,	hideTogglerOnSlide:		true		// hide the toggler when pane is 'slid open'
                ,	togglerTip_open:		"Close This Pane"
                ,	togglerTip_closed:		"Open This Pane"
                ,	resizerTip:				"Resize This Pane"
                //	effect defaults - overridden on some panes
                ,	fxName:					"slide"		// none, slide, drop, scale
                ,	fxSpeed_open:			750
                ,	fxSpeed_close:			1500
                ,	fxSettings_open:		{ easing: "easeInQuint" }
                ,	fxSettings_close:		{ easing: "easeOutQuint" }
                ,	showOverflowOnHover: true //不要擋到north的下拉選單
            }
            ,	north: {
                size: northSize
                ,	spacing_open:			1			// cosmetic spacing
                ,	togglerLength_open:		0			// HIDE the toggler button
                ,	togglerLength_closed:	-1			// "100%" OR -1 = full width of pane
                ,	resizable: 				true
                ,	slidable:				true
                //	override default effect
                ,	fxName:					"none"
            }
            ,	west: {
                size: westSize
                ,	spacing_closed:			21			// wider space when closed
                ,	togglerLength_closed:	21			// make toggler 'square' - 21x21
                ,	togglerAlign_closed:	"top"		// align to top of resizer
                ,	togglerLength_open:		0			// NONE - using custom togglers INSIDE west-pane
                ,	togglerTip_open:		"關閉選單"
                ,	togglerTip_closed:		"開啟選單"
                ,	resizerTip_open:		"縮放選單寬度"
                ,	slideTrigger_open:		"mouseover"
                ,	initClosed:				false
                //	add 'bounce' option to default 'slide' effect
                ,	fxSettings_open:		{ easing: "easeOutBounce" }
            }
            //,	west: {
            //    size:					westSize
            //    ,	spacing_closed:			21			// wider space when closed
            //    ,	togglerLength_closed:	21			// make toggler 'square' - 21x21
            //    ,	togglerAlign_closed:	"top"		// align to top of resizer
            //    ,	togglerLength_open:		0 			// NONE - using custom togglers INSIDE east-pane
            //    ,	togglerTip_open:		"Close East Pane"
            //    ,	togglerTip_closed:		"Open East Pane"
            //    ,	resizerTip_open:		"Resize East Pane"
            //    ,	slideTrigger_open:		"mouseover"
            //    ,	initClosed:				false
            //    //	override default effect, speed, and settings
            //    ,	fxName:					"drop"
            //    ,	fxSpeed:				"normal"
            //    ,	fxSettings:				{ easing: "" } // nullify default easing
            //}

        };

        var layoutSettings_Outer2 = {
            west__minSize: 100
            , west__size: westSize
            , north__size: northSize
            , spacing_open: 3
            , spacing_close: 6
            , north__showOverflowOnHover: true //不要擋到north的下拉選單

        }
        var outerLayout = $("body").layout(layoutSettings_Outer);
        // save selector strings to vars so we don't have to repeat it
        // must prefix paneClass with "body > " to target ONLY the outerLayout panes
        var westSelector = "body > .ui-layout-west"; // outer-west pane
        // CREATE SPANs for pin-buttons - using a generic class as identifiers
        $("<span></span>").addClass("pin-button").prependTo( westSelector );
        outerLayout.addPinBtn( westSelector +" .pin-button", "west");
        // CREATE SPANs for close-buttons - using unique IDs as identifiers
        $("<span></span>").attr("id", "west-closer" ).prependTo( westSelector );
        // BIND layout events to close-buttons to make them functional
        outerLayout.addCloseBtn("#west-closer", "west");
        outerLayout.addToggleBtn( "#toggelWest", "west" );


        //$("#west-accordion").accordion({ fillSpace: true })

        zTreeObj = $("#west-ztree").zTree({
            async: true,
            asyncUrl: curApp + "/auth/ztreeMenu?" + (jQuery("#group").add("#portalId").serialize()),
            fontCss: { "font-size": "11pt" },
            addDiyDom: function (treeid, node) {
                var obj = $("#" + node.tId + "_a");
                obj.click(function (ev) {
                    ev.preventDefault();
                });
                obj.dblclick(function (ev) {
                    ev.preventDefault();
                    if (node.isParent == false && node.href) {
                        add_iframe_tab({id: "TREE-" + node.id, title: node.name, url: node.href, other_params: "&iframe_tab_params=cascade%20tabid%3DROOT&iframe_tab_params=cascade%28nofix%3Dtrue%29%20entrance%3D" + node.id});
                    }
                });
            },
            callback: {
                asyncSuccess: function(event, treeId, treeNode, msg) {
                    var groupCount = 0;
                    var unitNodes = zTreeObj.getNodes();
                    for(var i=0 ; i<unitNodes.length ; i++){
                        groupCount += unitNodes[i].nodes.length;
                    }

                    if(groupCount <= 3){
                        zTreeObj.expandAll(true);
                    }
                }
            }
        });

        tabs = $("#app-tabs").tabs({
            cache: true,
            closable: true
        }).removeClass("ui-widget-content");

        add_iframe_tab({focus:true,url: "/open404/portal/npomPortal", id: "PORTAL", title: "首頁", other_params: "&iframe_tab_params=cascade%20tabid%3DROOT"});
        tabs.tabs("remove", 0);

        $("#app-tabs a.ui-tabs-close-button").remove();

        var inputVal;
        $("#filter-input").keydown(function () {
            inputVal = $(this).val();
        }).keyup(function () {
            var text = $(this).val();
            if (text != inputVal) {
                RFi += 1;
                RF1 = true;
                RF2 = true;
                RF1_wait(1000, RFi);
                zTreeObj.filter(text);
            }
        }).blur(function () {
            filter_input_blur(this);
        }).focus(function () {
            filter_input_focus(this);
        }).addClass("empty");

        filter_input_blur(document.getElementById("filter-input"));

        $("#filter-clear").click(function () {
            $("#filter-input").val("");
            filter_input_blur(document.getElementById("filter-input"));
            zTreeObj.filter("");
        });

        $(window).resize(function () {
            delay(function () {
                readjust_size();
            }, 200);
        });

        readjust_size();

    });
})(jQuery);

function readjust_size() {
    var h1 = jQuery("#west-ztree-container").parent().height();
    var h2 = jQuery("#west-filter").height();
    jQuery("#west-fake").height(h2);
    jQuery("#west-tree-ct").height(h1 - h2);

    fit_tabs_height();
}

function filter_input_blur(el) {
    var q = jQuery(el);
    if (q.val() == "") {
        q.addClass("empty");
        q.css("color", "#cccccc");
        q.val("關鍵字");
    } else {
        q.removeClass("empty");
    }
}

// from Stack Overflow
var delay = (function () {
    var timer = 0;
    return function (callback, ms) {
        clearTimeout(timer);
        timer = setTimeout(callback, ms);
    };
})();

function UUID() {
    var S4 = function () {
        return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    };
    return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
}
// END "from Stack Overflow"

function fit_tabs_height() {
    // 減一點 px 微調
    var h2 = jQuery("#layout-center").height();

    // 30px == ui-tabs-nav bar height
    jQuery("#app-tabs > div.ui-tabs-panel").height(h2 - 30 - 15);

    jQuery("#app-tabs > div > iframe[id^=L1-]").each(function () {
        this.contentWindow.fit_tabs_height();
    });
}

function filter_input_focus(el) {
    var q = jQuery(el);
    if (q.hasClass("empty")) {
        q.val("");
    }
    q.css("color", "black");
}

function filter_input_blur(el) {
    var q = jQuery(el);
    if (q.val() == "") {
        q.addClass("empty");
        q.css("color", "#cccccc");
        q.val("關鍵字");
    } else {
        q.removeClass("empty");
    }
}

function reload_iframe(dom_id) {
    var g = jQuery("#" + dom_id);
    if (g.length > 0) {
        var q = g.get(0);
        q.src = q.src;
    }
}

function reload_iframe_for_dashboard(dom_id, actionName, doAction, level, objid) {
    var g = jQuery("#" + dom_id);

    if (g.length > 0) {
        var q = g.get(0);
        var url = '';

        if (doAction != null && doAction != '' && doAction != undefined) {//儀表板作業
            if (q.src.indexOf("&" + actionName + "=") != -1) {//已有相同參數
                url = q.src.substring(0, q.src.indexOf('&' + actionName + '=')) + '&' + actionName + '=' + doAction
            } else {
                url = q.src + '&' + actionName + '=' + doAction
            }
        } else {//其他一般查詢作業
            if (level != null && level == 'M') {//master主要查詢頁面
                if (q.src.indexOf("&" + actionName + "=") != -1) {//已有相同參數
                    url = q.src.substring(0, q.src.indexOf('&' + actionName + '='))
                } else {
                    url = q.src
                }
            } else if (level != null && level == 'D') {//detail 編輯頁面
                if (q.src.indexOf("&" + actionName + "=") != -1) {//已有相同參數
                    url = q.src.substring(0, q.src.indexOf('&' + actionName + '=')) + '&' + actionName + '=' + objid
                } else {
                    url = q.src + '&' + actionName + '=' + objid
                }
            }
        }
        q.src = url;
    }
}

function addTab(tabObj, id, title, url, focus, remove_prev) {

    if (typeof(id) === "function") {
        id = id();
    }

    if (focus === undefined) {
        focus = true;
    }

    if (remove_prev === undefined) {
        remove_prev = false;
    }

    var idx = tabObj.tabs("findIndexById", id);
    var prevIdx = tabObj.tabs("option", "selected");

    if (idx === -1) {
        tabs.tabs("appendTabById", curApp + "/ajax/wrapUrlIframe?url=" + escape(url) + "&id=" + escape(id), title, id, true);
        fit_tabs_height();
        idx = tabObj.tabs("findIndexById", id);
    }

    if (focus) {
        tabObj.tabs("select", idx);
    }

    if (remove_prev)
        tabObj.tabs("remove", prevIdx);
}

function recursive_filter(treenode, filt_pattern) {
    var show1 = 0;
    treenode.eachChild(function (node2) {
        if (node2.leaf == false) {
            // 如果 node2 仍然是 node 目錄就再 call 一次
            var ret = recursive_filter(node2, filt_pattern);
            if (ret > 0) {
                // 假如回傳的值 > 0 表示目錄裡面仍然有東西
                node2.ui.show();
            } else {
                // <= 0 表示目錄裡面完全沒東西符合 pattern，把目錄也隠藏起來
                node2.ui.hide();
            }
        } else {
            // 如果符合就 show()，不符合就 hide()
            if (node2.text.match(filt_pattern) == null) {
                node2.ui.hide();
            } else {
                node2.ui.show();
                show1 += 1;
            }
        }
    });
    return show1;
}

function RF1_wait(time, i) {
    setTimeout("if (RFi == " + i + ") { RF1 = false; }", time);
}

function remove_cur_tab() {
    tabs.tabs("remove", tabs.tabs("option", "selected"));
}

function remove_tab(id) {
    tabs.remove(tabs.getItem(id));
}

function remove_tab2(id) {
    var tab = tabs.tabs("findIndexById", id);
    if (tab > 0) {
        tabs.tabs("remove", tab);
    }
}

function don(st) {
    if (typeof(st) === "string") {
        if (st.length === 0)
            return "";
        else
            return ("&" + st);
    }

    return "";
}

function plus_to_p20(str) {
    if (typeof(str) === "string") {
        return str.replace(/\+/g, "%20");
    }
}

function add_iframe_tab(map) {
    // utility function for adding a new tab
    // map.other_params should have a ampsand prefix if non-zero length

    if (typeof(map.other_params) == "undefined")
        map.other_params = "?"

    if (map.url && map.url.indexOf("?") == -1 && map.other_params.length > 0) {
        map.url += "?"
        map.other_params = map.other_params.substring(1);
    }

    if (map.focus === undefined)
        map.focus = true;

    if (map.remove_prev === undefined)
        map.remove_prev = false;

    var idx = tabs.tabs("findIndexById", map.id);
    var prevIdx = tabs.tabs("option", "selected");

    if (idx === -1) {
        jQuery(document).ready(function() {
            top.timeoutClock.reset();
        });
        if (map.secondLevel) {
            var sec = "&secondLevel=true"
            for (var i = 0; i < map.secondLevel.length; i++) {
                var sl1 = map.secondLevel[i];

                for (var sl2 in sl1) {
                    sec += ("&" + sl2 + i + "=" + encodeURIComponent(sl1[sl2]))
                }
            }

            tabs.tabs("appendTabById", curApp + "/general/wrap_url_iframe2?url=" + encodeURIComponent(curApp + "/general/secondLevelTab?other_params=" + encodeURIComponent(plus_to_p20(map.other_params)) + sec + "&nextid=" + map.id) + "&nextid=" + map.id + "-IFRAME", map.title, map.id, true);
        } else {
            tabs.tabs("appendTabById", curApp + "/general/wrap_url_iframe2?url=" + encodeURIComponent(map.url + plus_to_p20(map.other_params) + "&nextid=" + map.id) + "&nextid=" + map.id, map.title, map.id, true);
        }
    } else {
        if (map.secondLevel) {
            var wind = jQuery("#" + map.id + "-IFRAME").get(0).contentWindow;
            var tabobj = wind.jQuery("#" + map.id + "-CONTAINER");
            var foc = -1;

            for (var i = 0; i < map.secondLevel.length; i++) {
                var sl1 = map.secondLevel[i];

                var q = tabobj.tabs("findIndexById", sl1.id);
                if (q === -1) {
                    wind.add_iframe_tab({id: sl1.id, url: sl1.url, title: sl1.title, other_params: map.other_params});
                }

                if (sl1.focus) {
                    foc = tabobj.tabs("findIndexById", map.secondLevel[i].id);
                }
            }

            if (foc === -1) {
                foc = tabobj.tabs("findIndexById", map.secondLevel[map.secondLevel.length - 1].id);
            }

            tabobj.tabs("select", foc);

            wind.fit_tabs_height();
        }
    }

    if (map.focus)
        tabs.tabs("select", tabs.tabs("findIndexById", map.id));

    if (map.remove_prev)
        tabs.tabs("remove", prevIdx);

    if (map.remove_tab)
        tabs.tabs("remove", tabs.tabs("findIndexById", map.remove_tab));

    fit_tabs_height();
}
