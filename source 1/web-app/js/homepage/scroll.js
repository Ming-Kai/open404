$(function() {

    $(window).scroll(function() {

        var HEIGHT = $(window).scrollTop() + $(window).innerHeight()/2 - $(window).innerHeight()/10 ;
        
        if ($(window).scrollTop() > 50) {

            $("#gisIcon").stop().animate({
                top: HEIGHT
            });

        } else {

            $("#gisIcon").stop().animate({
                top: -10
            });

        }

    });

});
