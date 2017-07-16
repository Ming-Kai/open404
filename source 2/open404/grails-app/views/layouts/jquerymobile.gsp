<!DOCTYPE html>
<html>
	<head>
		<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
        <meta name="viewport" content="user-scalable=no, initial-scale=1, maximum-scale=1, minimum-scale=1, width=device-width">        
        <title><g:layoutTitle default="OPEN 404" /></title>
        <link rel="shortcut icon" href="${resource(dir: 'images', file: 'favicon.ico')}" type="image/x-icon">
        
        <link rel="stylesheet" href="${resource(dir: 'css', file: 'jquery.mobile-1.4.5.min.css')}">
                
        <%-- 自訂jQuery Mobile樣式 --%>
        <%--<link rel="stylesheet" href="${resource(dir: 'css', file: 'my-custom-theme.min.css')}">
        <link rel="stylesheet" href="${resource(dir: 'css', file: 'jquery.mobile.icons.min.css')}">--%>
        
                
        <script src="${resource(dir: 'js', file: 'jquery-1.11.3.min.js')}"></script>
        <script src="${resource(dir: 'js', file: 'jquery.mobile-1.4.5.min.js')}"></script>
        <script type="text/javascript">
			function message_hide(){
				//$('#message').hide();
				$('#message').fadeOut("slow");
			}

			function startLoad(){
				$.mobile.loading("show", {
					text : '讀取中…',
					textVisible : true,
					theme : 'b',
					textonly : false,
					html : ''
				});
			}

			function stopLoad(){
				$.mobile.loading( "hide" );
			}

			function toast(msg){
				$("<div class='ui-loader ui-overlay-shadow ui-body-b ui-corner-all'><h3>"+msg+"</h3></div>")
				.css({ display: "block", 
					opacity: 0.9, 
					position: "fixed",					
					"text-align": "center",
					width: "270px",
					left: ($(window).width() - 284)/2,
					top: $(window).height()*0.8 })
				.appendTo( $.mobile.pageContainer ).delay( 2000 )
				.fadeOut( 1000, function(){
					$(this).remove();
				});
				
			}	

			//畫面載入時
			$( document ).on( "pageshow","#myPage", function() {								
				setContentHeight();
			});
			$( document ).on( "pageshow",".first-page", function() {								
				setContentHeight();
			});

			//畫面縮放時
			$( window ).resize(function() {
				setContentHeight();
			});

			function setContentHeight(){				
		        var window_height = $.mobile.getScreenHeight(); //視窗高
		        //console.log(header_height);
		        //----- 設定內容區塊的高度 -----//
		    	var header_height = $(".ui-header").hasClass("ui-header-fixed") ? $(".ui-header").outerHeight() - 1 : $(".ui-header").outerHeight(); //header的高
		    	//console.log(header_height);		    			    	
		    	var footer_height = $(".ui-footer").hasClass("ui-footer-fixed") ? $(".ui-footer").outerHeight() - 1 : $(".ui-footer").outerHeight(); //footer的高
		    	//console.log(footer_height);		    			    	
		    	var content_padding = $(".ui-content").outerHeight() - $(".ui-content").height(); //內容區塊的padding
		    	//console.log(content_padding);
		    	var content_height = window_height - header_height - footer_height - content_padding; //計算出內容區塊實際的高度
		    	//console.log(content_height);
		    	$('.ui-content').height(content_height);
		    	
		    	//$('#menu-panel').height(window_height); //指定選單高度等於視窗高度
			}
		</script>
				
		<style>		
			@media only screen and (min-width: 768px) {
				/*限制畫面寬度 */
				.ui-page {
					max-width: 764px !important;
					margin: 0 auto !important;
					position: relative !important;
					border-right: 2px #333 outset !important;
					border-left: 2px #333 outset !important;
				}
				
				/*修正頭尾寬度*/
				.ui-header, .ui-footer {
					max-width: 764px !important;
					margin: 0 auto !important;
				}
				
				/*修正dialog寬度 */
				.ui-dialog-contain,
				.ui-dialog-contain>.ui-header{
					width: 100% !important;
					top:0;
				}
				
				/*修正右邊選單寬度問題*/
				.ui-panel-dismiss-open.ui-panel-dismiss-position-right{
					max-width: 492px !important; /*大約 764(頁寬)-272(選單的寬) */
					margin: 0 auto !important;																				
				}
				
				.ui-header .ui-bar-a{
					max-height:44px;
				}
			}
			
			.required{
				box-shadow: 0 0 12px #F00;
			}
			
			//設定底圖
			/*.ui-content{
				background-image:url('${resource(dir: 'images', file: 'bg.jpg')}');
				background-repeat: no-repeat;
        		background-position: center;
        		background-size: cover;
			}*/
			
			.btn-group{
		        position:absolute;
		        top: 45%;
		        left: 25%;
		        width: 50%;
		    }
		    
		    .ui-link div{
		    	color:black;
		    }
		</style>
		<%--修改 info window --%>	
		<style>
		.gm-style-iw {
			width: 350px !important;
			top: 15px !important;
			left: 0px !important;
			background-color: #fff;
			box-shadow: 0 1px 6px rgba(178, 178, 178, 0.6);
			border: 1px solid rgba(72, 181, 233, 0.6);
			border-radius: 2px 2px 10px 10px;
		}
		#iw-container {
			margin-bottom: 10px;
		}
		#iw-container .iw-title {
			font-family: 'Open Sans Condensed', sans-serif;
			font-size: 22px;
			font-weight: 400;
			padding: 10px;
			/*background-color: #48b5e9;*/
			color: white;
			margin: 0;
			border-radius: 2px 2px 0 0;
			width: 100%;
		}
		#iw-container .iw-content {
			font-size: 13px;
			line-height: 8px;
			font-weight: 400;
			margin-right: 1px;
			padding: 15px 5px 20px 15px;
			max-height: 140px;
			overflow-y: auto;
			overflow-x: hidden;
		}
		.iw-content img {
			float: right;
			margin: 0 5px 5px 10px;	
		}
		.iw-subTitle {
			font-size: 16px;
			font-weight: 700;
			padding: 5px 0;
		}
		.iw-bottom-gradient {
			position: absolute;
			width: 326px;
			height: 25px;
			bottom: 10px;
			right: 18px;
			background: linear-gradient(to bottom, rgba(255,255,255,0) 0%, rgba(255,255,255,1) 100%);
			background: -webkit-linear-gradient(top, rgba(255,255,255,0) 0%, rgba(255,255,255,1) 100%);
			background: -moz-linear-gradient(top, rgba(255,255,255,0) 0%, rgba(255,255,255,1) 100%);
			background: -ms-linear-gradient(top, rgba(255,255,255,0) 0%, rgba(255,255,255,1) 100%);
		}
		</style>		
		<g:layoutHead/>
	</head>
	<body>
	
		<g:layoutBody/>
    	
	</body>
</html>