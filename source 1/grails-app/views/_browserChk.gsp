<%--
compile "org.grails.plugins:browser-detection:2.5.0"
--%>

<browser:isMsie versionLower="9">
    <script src="${resource(dir: 'js/cookie', file: 'jquery.cookie.js')}"></script> 
    <script src="${resource(dir: 'jquery/ui/jalert', file: 'jquery.min.js')}"></script>
    <script src="${resource(dir: 'jquery/ui/jalert', file: 'jquery-ui.min.js')}"></script>
    <script src="${resource(dir: 'jquery/ui/jalert', file: 'jquery.ui-jalert.js')}"></script>
    <script src="${resource(dir: 'jquery/ui/jalert', file: 'jquery.themeswitcher.min.js')}"></script>
    <link rel="stylesheet" type="text/css" href="${resource(dir: 'jquery/ui/jalert', file: 'jquery.ui-jalert.css')}" />
    <link rel="stylesheet" type="text/css" href="${resource(dir: 'jquery/ui/jalert', file: 'jquery-ui.css')}" />
    <link rel="stylesheet" type="text/css" href="${resource(dir: 'jquery/ui/jalert', file: 'reset-min.css')}" />
    <script type="text/javascript">
        $(document).ready(function() {
            var cookie = 'chkBrowser'
            if($.cookie(cookie)){  //已提醒過
                return false;
            }
            $.cookie(cookie,'true',{expires: 2});
            
            var ua = window.navigator.userAgent;
            var msie = ua.indexOf ( "MSIE " );
            var version = parseInt (ua.substring (msie+5, ua.indexOf (".", msie )));
            var msg = "您目前的瀏覽器為「Internet Explorer "+version+"」，建議您可更新IE版本、<br>或使用";
            msg +="<a style='color:#0000FF' href='https://www.google.com.tw/chrome/browser/desktop/index.html' target='_blank'>Google Chrome<img src='/npom/images/chrome.jpg' width='16' height='16'></a>";
            msg +="、<a style='color:#0000FF' href='http://mozilla.com.tw/firefox/new/' target='_blank'>FireFox<img src='/npom/images/firefox.jpg' width='16' height='16'></a>，";
            msg +="可得到更佳的操作效能。";
            $.jAlert(msg,'','',{width: '500px'});
        });
    </script>
</browser:isMsie>

