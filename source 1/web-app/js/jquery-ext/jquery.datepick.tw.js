
(function(jQuery) {
    jQuery.datepick.regional['zh-TW'] = {
        clearText: '清除', 
        clearStatus: '清除已選日期',
        closeText: '關閉', 
        closeStatus: '不改變目前的選擇',
        prevText: '&#x3c;上月', 
        prevStatus: '顯示上月',
        prevBigText: '&#x3c;&#x3c;', 
        prevBigStatus: '顯示上一年',
        nextText: '下月&#x3e;', 
        nextStatus: '顯示下月',
        nextBigText: '&#x3e;&#x3e;', 
        nextBigStatus: '顯示下一年',
        currentText: '顯示本月', 
        currentStatus: '顯示本月',
        monthNames: ['一月','二月','三月','四月','五月','六月',
        '七月','八月','九月','十月','十一月','十二月'],
        monthNamesShort: ['一','二','三','四','五','六',
        '七','八','九','十','十一','十二'],
        monthStatus: '選擇月份', 
        yearStatus: '選擇年份',
        weekHeader: '周', 
        weekStatus: '年內周次',
        dayNames: ['星期日','星期一','星期二','星期三','星期四','星期五','星期六'],
        dayNamesShort: ['日','一','二','三','四','五','六'],
        dayNamesMin: ['日','一','二','三','四','五','六'],
        dayStatus: '設定 DD 為一周起始', 
        dateStatus: '選擇 m月 d日, DD',
        dateFormat: 'yy/mm/dd', 
        firstDay: 1,
        initStatus: '請選擇日期', 
        isRTL: false,
        showMonthAfterYear: true, 
        yearSuffix: ''
    };
    jQuery.datepick.setDefaults(jQuery.datepick.regional['zh-TW']);
	
    jQuery.extend(jQuery.datepick, {
        formatDate: function (format, date, settings) {
            var d = date.getDate();
            var m = date.getMonth()+1;
            var y = date.getFullYear();			
            var fm = function(v){			
                return (v<10 ? '0' : '')+v;
            };	
            var fmYear = function(v){		
                return (v<10 ? '00' : v<100? '0': '')+v;
            };
            return fmYear((y-1911)) +'/'+ fm(m) +'/'+ fm(d);
        },
        parseDate: function (format, value, settings) {
            var v = new String(value);
            var Y,M,D;
            if(v.length==7){/*1001215*/
                Y = v.substring(0,3)-0+1911;
                M = v.substring(3,5)-0-1;
                D = v.substring(5,7)-0;
                return (new Date(Y,M,D));
            }else if(v.length==6){/*981215*/
                Y = v.substring(0,2)-0+1911;
                M = v.substring(2,4)-0-1;
                D = v.substring(4,6)-0;
                return (new Date(Y,M,D));
            }else if(v.length==9){ /*100/01/01*/
                Y = v.substring(0,3)-0+1911;
                M = v.substring(4,6)-0-1;  
                D = v.substring(7,9)-0;
                                
                return (new Date(Y,M,D));
            }
            return (new Date());
        },
        formatYear:function(v){
            return '民國'+(v-1911)+'年';
        }
    });	
	
})(jQuery);