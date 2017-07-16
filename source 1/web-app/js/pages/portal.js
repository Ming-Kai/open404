$(function () {
    // Visual effects for grid buttons.
    $("div.grid.linkfy1").each(function() {
        var q = $(this).children(".qtipContent");
        if (q.length > 0) {
            $(this).qtip({content: q, show: {delay: 500}});
        }
    }).mouseenter(function() {
        $(this).addClass("grid-border", 200);
    }).mouseleave(function() {
        $(this).removeClass("grid-border", 200);
    });

    // Grid buttons setup onclick events
    $("#loading .dismiss").click(function () {
        $("#loading").fadeOut("slow");
    });

    $("div.grid.linkfy1").click(function() { window.open($(this).attr("data-url")); });

    // Image preload
    new Image().src = "images/fiona/logout_1.png";
    new Image().src = "images/fiona/logout_2.png";
});
