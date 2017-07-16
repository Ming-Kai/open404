<!DOCTYPE html>
<html lang="zh-Hant">
    <head>
        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>Open404</title>
        <link rel="shortcut icon" href="${resource(dir: 'images', file: 'favicon.ico')+'?v='+(new Date())}" type="image/x-icon"/>
        <link rel="stylesheet" type="text/css" href="${resource(dir: 'css/homepage', file: 'bootstrap.css')}">
        <link rel="stylesheet" type="text/css" href="${resource(dir: 'css/homepage', file: 'main.css')+'?v='+(new Date())}">
        <link rel="stylesheet" type="text/css" href="${resource(dir: 'css/homepage', file: 'font-awesome.min.css')}">
        <link rel="stylesheet" type="text/css" href="${resource(dir: 'css/homepage', file: 'animate.css')}">
        <!-- HTML5 shim and Respond.js for IE8 support of HTML5 elements and media queries -->
        <!--[if lt IE 9]>
          <script src="${resource(dir: 'js/homepage', file: 'html5shiv.js')}"></script>
          <script src="${resource(dir: 'js/homepage', file: 'respond.min.js')}"></script>
        <![endif]-->
        <!--[if gte IE 9]>
            <style type="text/css">
            .gradient {
                filter: none;
            }
            </style>
        <![endif]-->
        <script src="${resource(dir: 'js/homepage', file: 'jquery.min.js')}"></script>
        <script src="${resource(dir: 'js/homepage', file: 'bootstrap.min.js')}"></script>
        <script type="text/javascript" src="${resource(dir: 'js/homepage', file: 'scroll.js')}"></script>
        <script src="${resource(dir: 'js/homepage', file: 'wow.js')}"></script>
        <script src="${resource(dir: 'js/homepage', file: 'googleWMS.js')}"></script>
    </head>    
    <body>
        <div id="wrap">
            <g:render template="titleMenu" model="[isIndex:true]" />
            <div class="container-fluid">
                <div class="row">
                    <div class="topBlock">
                        <div class="polyganBg">
                            <div class="container" style="width: 100%;text-align: center;">
                                <iframe  width="100%" height="680" frameborder="0" style="border:0;max-width: 1199px;" src="https://coulomb.carto.com/builder/cebce9dd-99e6-4067-947a-de38a92b023c/embed?state=%7B%22map%22%3A%7B%22ne%22%3A%5B22.616783955926568%2C120.29295444488527%5D%2C%22sw%22%3A%5B22.63161899235932%2C120.31235218048097%5D%2C%22center%22%3A%5B22.624201674242418%2C120.30265331268312%5D%2C%22zoom%22%3A16%7D%2C%22widgets%22%3A%7B%222aa1267d-1c33-44db-932d-cbf1149a307e%22%3A%7B%22normalized%22%3Atrue%7D%7D%7D"></iframe>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <g:render template="footer"/>

        <!--Google Map-->
        <script src="//maps.google.com/maps/api/js?v=3&amp;sensor=false&callback=initMap"></script>
    </body>
</html>
