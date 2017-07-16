var tree1;
var tabs;

$(function() {
    $("body").layout({ west__minSize: 210, north__size: 52 });

    var tree1_settings = {
	view: {
	    fontCss: { "font-size": "12pt" },
	    addDiyDom: function(treeid, node) {
		var obj = $("#" + node.tId + "_a");
		obj.attr("title", node.title);
		obj.click(function(ev) {
		    ev.preventDefault();
		    if (node.isParent == false && node.url) {
			addTab(tabs, node.id, node.name, node.url, true);
		    }
		});
	    }
	}
    };

    tabs = $("#layout-tabs").tabs({ cache: true, closable: true }).removeClass("ui-widget-content").tabs("appendTabById", app_name + "/tools/wrapUrlIframe?url=" + escape(app_name + "/layout/index2") + "&id=0", "首頁", "index2").tabs("remove", 0);

    var tree1_nodes = $.getJSON("/open404/layout/tree1?_rand=" + UUID(), function(json) {
	tree1 = $.fn.zTree.init($("#tree1"), tree1_settings, json);
    });

    $(window).resize(function() {
	delay(function() {
	    readjust_size();
	}, 200);
    });

    fit_tabs_height();

});

function readjust_size() {
    fit_tabs_height();
}

function fit_tabs_height() {
    // 減一點 px 微調
    var h2 = jQuery("#layout-center").height();
    var h3 = jQuery("#layout-tabs").height(h2 - 10);
    var h4 = jQuery("#layout-tabs ul.ui-tabs-nav").height();
    jQuery("#layout-tabs div.ui-tabs-panel").height(h2 - h4 - 15);
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
	tabs.tabs("appendTabById", app_name + "/tools/wrapUrlIframe?url=" + escape(url) + "&id=" + escape(id), title, id, true);
	fit_tabs_height();
	idx = tabObj.tabs("findIndexById", id);
    }

    if (focus) {
	tabObj.tabs("select", idx);
    }

    if (remove_prev)
	tabObj.tabs("remove", prevIdx);
}

function reload_iframe(dom_id) {
    var g = jQuery("#" + dom_id);
    if (g.length > 0) {
	var q = g.get(0);
	q.src = q.src;
    }
}

function remove_cur_tab() {
    tabs.tabs("remove", tabs.tabs("option", "selected"));
}

// from Stack Overflow
var delay = (function(){
    var timer = 0;
    return function(callback, ms){
	clearTimeout (timer);
	timer = setTimeout(callback, ms);
    };
})();

function UUID() {
    var S4 = function() {
	return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
    };
    return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
}
// END "from Stack Overflow"
