/*!
 * todo year, month setting error
 * Copyright 2015 Kevin
 */
var timeoutClock = {};

//參數
timeoutClock.divId =  'countdown_dashboard';    //default   更動需一併更動css/timeout-clock
timeoutClock.refreshUrl = "/open404/auth/resetSessionTime";
timeoutClock.logoutUrl = "/open404/auth/logout"; 
timeoutClock.directLogout = false;  //pass window.onbeforeunload


timeoutClock.notifyMs =  1*60*1000;     //提早多久提醒(毫秒)
//倒數時間設定
timeoutClock.year =  0;
timeoutClock.month =  0;
timeoutClock.day =  0;
timeoutClock.hr =  0;
timeoutClock.min =  15;
timeoutClock.sec =  0;


//init timer
timeoutClock.hintTimer = null;
timeoutClock.logoutTimer = null;

//初始化
timeoutClock.init = function (){
    jQuery('#'+timeoutClock.divId).countDown({
            targetOffset: {
                    'year': 	timeoutClock.year,
                    'month': 	timeoutClock.month,
                    'day': 	timeoutClock.day,
                    'hour': 	timeoutClock.hr,
                    'min': 	timeoutClock.min,
                    'sec': 	timeoutClock.sec
            }
    });
    timeoutClock.seTimeout();
}

//重置前端畫面
timeoutClock.reset = function (){
    jQuery('#'+timeoutClock.divId).stopCountDown();
    jQuery('#'+timeoutClock.divId).setCountDown({
            targetOffset: {
                    'year': 	timeoutClock.year,
                    'month': 	timeoutClock.month,
                    'day': 	timeoutClock.day,
                    'hour': 	timeoutClock.hr,
                    'min': 	timeoutClock.min,
                    'sec': 	timeoutClock.sec
            }
    });
    jQuery('#'+timeoutClock.divId).startCountDown();
    timeoutClock.seTimeout();
}

//手動重置(前端畫面+後台session刷新)
timeoutClock.manualReset = function (){
    this.reset();
    $.ajax({
        url: timeoutClock.refreshUrl,
        type: 'POST',
        success: function (json) {
            //console.log(json)
        }
    });
}


//設定提醒時間,登出時間
timeoutClock.seTimeout = function(){
    clearTimeout(this.hintTimer);
    clearTimeout(this.logoutTimer);
    //轉為毫秒
    var ms = 0;
    ms += timeoutClock.sec*1000;
    ms += timeoutClock.min*1000*60;
    ms += timeoutClock.hr*1000*60*60;
    ms += timeoutClock.day*1000*60*60*24;
    
    
    this.hintTimer = setTimeout(function(){
        jAlert('<span style="font-size: 17pt; color: #224f77;">您的登出時間要到囉，若您要繼續使用系統可點選確定按鈕！</span>', '登出提醒', function(r) {
            if(r){
                window.parent.timeoutClock.manualReset(); //手動更新
            }
        });
    }, ms-timeoutClock.notifyMs);
    
    this.logoutTimer = setTimeout(function(){
        timeoutClock.directLogout = true;
        document.location.href= timeoutClock.logoutUrl;
    }, ms);
}