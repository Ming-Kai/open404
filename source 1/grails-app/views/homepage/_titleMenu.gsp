<!-- 行動裝置選單 -->
<nav class="navbar navbar-default navbar-fixed-top mainMenu_mobile" role="navigation">
    <div class="container">
        <!-- LOGO及行動裝置按鈕切換區 -->
        <div class="navbar-header">
            <%--
            <button type="button" class="navbar-toggle" data-toggle="collapse" data-target=".navbar-ex1-collapse">
                <span class="sr-only">導覽列開關</span>
                <span class="icon-bar"></span>
                <span class="icon-bar"></span>
                <span class="icon-bar"></span>
            </button>
--%>
            <a class="navbar-brand" href="${createLink(controller: 'homepage')}">
                <img src="${resource(dir: 'images/homepage', file: 'logo.svg')}" height="70px">
            </a>
        </div>
        <!-- 主選單 -->
            <%--
        <div class="collapse navbar-collapse navbar-ex1-collapse">
            <ul class="nav navbar-nav navbar-right mobileStyle">
                <li><a href="javascript: void(0);">進階查詢</a></li>
            </ul>
        </div>
--%>
    </div>
</nav>