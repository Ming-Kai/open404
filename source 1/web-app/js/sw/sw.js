$(window).load(function () {
    try {
        //取得積分明細
        $(document).on('click', "[data-event='getScoreDetailsList']", function () {
            if (vConfirm) {
                var pIdno = $("#pIdno").val();
                var pScoreType = $(this).data("scoretype");
                var pRowType = $(this).data("rowtype");
                if (pIdno && pRowType) {
                    $.ajax({
                        url: appPath + "/sw/personalScoresDetail",
                        data: {pIdno: pIdno, pScoreType: pScoreType, pRowType: pRowType},
                        type: "POST",
                        dataType: "html",
                        success: function (html) {
                            $("#dialog-1").html(html);
                            $('#dialog-1').dialog({title: '積分明細表', modal: true, width: 1000});
                            endLoad();
                        },
                        beforeSend: function () {
                            startLoad();
                        },
                        complete: function () {
                            endLoad();
                        }
                    });
                }
            }
            vConfirm = true;
        });
    } catch (err) {
        alert("err " + err);
    }
});