var vConfirm = true;
$(window).load(function () {
    try {
        startLoad();

        //清除
        $(document).on('click', "button[data-event~='clear']", function () {
            if (vConfirm) {
                ClearQueryForm();
            }
            vConfirm = true;
        });

        //Loading Start
        $(document).on('click', "[data-event~='loading']", function () {
            if (vConfirm) {
                startLoad();
            }
            vConfirm = true;
        });

        //確認視窗
        $(document).on('click', "button[data-event~='confirm']", function () {
            var pMsg = $(this).data("msg");
            if (!pMsg) {
                pMsg = "確定？"
            }
            if (!confirm(pMsg)) {
                vConfirm = false;
            }
        });

        //視窗關閉
        $(document).on('click', "button[data-event~='windowClose']", function () {
            alert("1");
            if (vConfirm) {
                window.close();
            }
            vConfirm = true;
        });

        //Dialog關閉
        $(document).on('click', "button[data-event~='dialogClose']", function () {
            if (vConfirm) {
                $(this).parents('.ui-dialog-content').dialog().dialog('close'); //先.dialog()後再關閉
            }
            vConfirm = true;
        });

        //分頁關閉
        $(document).on('click', "button[data-event~='removeCurTab']", function () {
            if (vConfirm) {
                parent.remove_cur_tab()
            }
            vConfirm = true;
        });

        //新分頁開啟
        $(document).on('click', "button[data-event~='addTab'],a[data-event~='addTab']", function () {
            if (vConfirm) {
                var pId = $(this).data("tid");
                var pKind = $(this).data("tkind") + pId;
                var pTabName = $(this).data("tname");
                var pLink
                if (pId) {
                    pLink = $(this).data("tlink") + "/" + pId;
                } else {
                    pLink = $(this).data("tlink");
                }
                parent.addTab(parent.tabs, pKind , pTabName, pLink);
            }
            vConfirm = true;
        });


        endLoad();
    } catch(err) {
        alert("err " + err);
    }
});

//報表列印Function
function RpPrint(fid) {
    startLoad();
    var u = jQuery("#" + fid + " #reportUrl");

    jQuery.ajax({
        url: (u.length > 0) ? u.val() : appPath + "/tools/reportPrint",
        data: jQuery("#" + fid).serialize(),
        success: function(key) {
            endLoad();
            jQuery("body").append(key);
        },
        error: function() {
            endLoad();
            alert("發生錯誤。");
        }
    });
}