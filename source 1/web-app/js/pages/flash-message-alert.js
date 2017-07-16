$(function() {
    var q = "";

    $("input[type=hidden].flashMessage").each(function() {
        var f = $(this);
        if (f.val().length > 0) {
            q += ($(this).val() + "\r\n");
        }
    });

    if (q.length > 0) {
        alert(q);
    }
});
