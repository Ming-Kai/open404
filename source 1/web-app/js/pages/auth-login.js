$(function() {
    var u = $("#username");
    var p = $("#password");

    if (u.val().length > 0) {
        p.focus();
    } else {
        u.focus();
    }
});
