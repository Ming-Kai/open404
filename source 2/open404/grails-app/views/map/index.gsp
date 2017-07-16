<!DOCTYPE html>
<html>
	<head>
		<meta name="layout" content="jquerymobile" />
		<title>OPEN 404</title>
		
		<script src="https://maps.googleapis.com/maps/api/js?v=3&key=${map_api_key}&language=zh-TW"></script>
		<%--使用https的google map api，不然在https的ap，會無法顯示地圖--%>		
		<script>
			var twLatLng = new google.maps.LatLng(23.974093,120.979903); //台灣
			var currLatLng = null; //目前地圖中心
			var gmap;
			var infowindow=null;
			var markers_aqxsite = []; //空氣檢測站
			var markers_factory = []; //工廠點位
			var markers_people = []; //民眾回報
			//var markers_xx = []; //其他點位
			
			
			function setContentHeight(){				
		        var window_height = $.mobile.getScreenHeight(); //視窗高
		        //----- 設定內容區塊的高度 -----//
		    	var header_height = $(".ui-header").hasClass("ui-header-fixed") ? $(".ui-header").outerHeight() - 1 : $(".ui-header").outerHeight(); //header的高
		    	var footer_height = $(".ui-footer").hasClass("ui-footer-fixed") ? $(".ui-footer").outerHeight() - 1 : $(".ui-footer").outerHeight(); //footer的高		    	
		    	var content_padding = $(".main-content").outerHeight() - $(".main-content").height(); //內容區塊的padding
		    	var content_height = window_height-header_height-footer_height-content_padding; //計算出內容區塊實際的高度
		    	$('.main-content').height(content_height); //指定內容區塊的高度，其他顯示比例，在view調整
		    	$('#menu-panel').height(window_height); //指定選單高度等於視窗高度
			}

			//參數設定dialog
			function settingDialog(){
				$('#myDialog_title').html("顯示參數設定");
				//$('#myDialog_message').html("");
				$('#myDialog_content').load("${createLink(controller:'map',action:'setting')}");
					
				//popup的dialog用
				$('#myDialog').popup();
				$('#myDialog').popup('open');
			}

			//清除點位(傳入一陣列物件)
			function clearMarkers(markers){
			    for (var i = 0; i < markers.length; i++) {
			        markers[i].setMap(null);
			    }
			    markers = [];
			} 

			//載入地圖設定
			function map_setting(){
				$('#myDialog').popup('close');
				startLoad();
							
				//工廠
				clearMarkers(markers_factory);
				var qFactory=[];
				$('input[type=checkbox][name=qFactory]').each(function() {
					if (this.checked){
						qFactory.push($(this).val());
					}
				});
			    console.log(qFactory)
				load_factory(qFactory);

			  	//空氣檢測站
				clearMarkers(markers_aqxsite);
				var qdate=$('#qDate').val();
				var qhour=$('#qHour').val();
				load_aqxsite(qdate,qhour);

				stopLoad();
			}

			//空氣檢測站 
			function load_aqxsite(qdate,qhour){
				$.getJSON("${createLink(controller:'map',action:'filter_aqxSite')}?qdate="+qdate+"&qhour="+qhour,
					function(json){    	
						if(json.length!=0){
				            $.each(json,function(id,item){
				            	var psi = parseInt(item.psi) == NaN ? 0 : parseInt(item.psi); //轉數值
				            	
				            	var contentString = '<div id="iw-container" style="width:350px;">';
				            	if(psi>=0 && psi<=50){
				            		contentString += '<div class="iw-title" style="background-color:#00e800;color:black;">'+item.site_name+'</div>';
						        }else if(psi>=51 && psi<=100){
						        	contentString += '<div class="iw-title" style="background-color:#ffff00;color:black;">'+item.site_name+'</div>';
						        }else if(psi>=100 && psi<=150){
						        	contentString += '<div class="iw-title" style="background-color:#ff7e00;color:black;">'+item.site_name+'</div>';
						        }else if(psi>=151 && psi<=200){
						        	contentString += '<div class="iw-title" style="background-color:#ff0000;color:black;">'+item.site_name+'</div>';
						        }else if(psi>=201 && psi<=300){
						        	contentString += '<div class="iw-title" style="background-color:#8f3f97;color:black;">'+item.site_name+'</div>';
						        }else if(psi>=301 && psi<=500){
						        	contentString += '<div class="iw-title" style="background-color:#7e0023;color:black;">'+item.site_name+'</div>';
						        }
				            	contentString += '	<div class="iw-content">';
				            	//aqi
				            	contentString += '		<div class="iw-subTitle">AQI</div>';
				            	contentString += '		<p>'+item.psi+'</p>';
				            	//空氣品質指標
				            	contentString += '		<div class="iw-subTitle">空氣品質指標</div>';
				            	contentString += '		<p>'+item.status+'</p>';
				            	//臭氧(ppb)(O3)
				            	contentString += '		<div class="iw-subTitle">臭氧(ppb)(O3)</div>';
				            	contentString += '		<p>'+item.o3+'</p>';
				            	//細懸浮微粒(μg/m3)(PM2.5)
				            	contentString += '		<div class="iw-subTitle">細懸浮微粒(μg/m3)(PM2.5)</div>';
				            	contentString += '		<p>'+item.pm2_5+'</p>';
				            	//細懸浮微粒指標(FPMI)
				            	contentString += '		<div class="iw-subTitle">細懸浮微粒指標(FPMI)</div>';
				            	contentString += '		<p>'+item.fpmi+'</p>';
				            	//懸浮微粒(μg/m3)(PM10)
				            	contentString += '		<div class="iw-subTitle">懸浮微粒(μg/m3)(PM10)</div>';
				            	contentString += '		<p>'+item.pm10+'</p>';
				            	//一氧化碳(ppm)(CO)
				            	contentString += '		<div class="iw-subTitle">一氧化碳(ppm)(CO)</div>';
				            	contentString += '		<p>'+item.co+'</p>';
				            	//二氧化硫(ppb)(SO2)
				            	contentString += '		<div class="iw-subTitle">二氧化硫(ppb)(SO2)</div>';
				            	contentString += '		<p>'+item.so2+'</p>';
				            	//二氧化氮(ppb)(NO2)
				            	contentString += '		<div class="iw-subTitle">二氧化氮(ppb)(NO2)</div>';
				            	contentString += '		<p>'+item.no2+'</p>';
				            	//氮氧化物(ppb)(NOx)
				            	contentString += '		<div class="iw-subTitle">氮氧化物(ppb)(NOx)</div>';
				            	contentString += '		<p>'+item.nox+'</p>';
				            	//一氧化氮(ppb)(NO)
				            	contentString += '		<div class="iw-subTitle">一氧化氮(ppb)(NO)</div>';
				            	contentString += '		<p>'+item.no+'</p>';
				            	//風向(degrees)(WindDirec)
				            	contentString += '		<div class="iw-subTitle">風向(degrees)(WindDirec)</div>';
				            	contentString += '		<p>'+item.windDirecName+'</p>';
				            	//風速(m/sec)(WindSpeed)
				            	contentString += '		<div class="iw-subTitle">風速(m/sec)(WindSpeed)</div>';
				            	contentString += '		<p>'+item.wind_speed+'</p>';
				            	//發布時間(PublishTime)
				            	contentString += '		<div class="iw-subTitle">發布時間(PublishTime)</div>';
				            	contentString += '		<p>'+item.publish_dt+'</p>';
				            	
				            	contentString += '	</div>';
				            	contentString += '</div>';


				                var tLatlng = new google.maps.LatLng(item.lat ,item.lon );
				                var tOptions = {center : tLatlng};
				                var tMarker = new google.maps.Marker({
				                    contentString: contentString,
				                    position : tLatlng,
				                    map : gmap,
				                    icon : '${resource(dir: 'images', file: 'bdot-purple.png')}'
				                });

				                google.maps.event.addListener(tMarker,'click', function() {
				                    infowindow.open(gmap,tMarker);
				                    infowindow.setContent(tMarker.contentString);
				                });

				                markers_aqxsite.push(tMarker);	
				            });//each
				        }    	
			    	}
			    );	
			}

			//空氣檢測站 
			function load_factory(qFactory){
				$.getJSON("${createLink(controller:'map',action:'filter_factory')}?qFactory="+qFactory,
					function(json){    	
						if(json.length!=0){
				            $.each(json,function(id,item){
				            	var contentString = '<div id="iw-container" style="width:350px;">';
				            	contentString += '<div class="iw-title" style="background-color:#6E6E6E">'+item.工廠名稱+'</div>';
				            	contentString += '	<div class="iw-content">';
				            	
				            	contentString += '		<div class="iw-subTitle">地址</div>';
				            	contentString += '		<p>'+item.工廠地址+'</p>';
				            	contentString += '		<div class="iw-subTitle">產業類別</div>';
				            	contentString += '		<p>'+item.產業類別+'</p>';
				            	contentString += '		<div class="iw-subTitle">主要產品</div>';
				            	contentString += '		<p>'+item.主要產品+'</p>';
				            	
				            	
				            	contentString += '</div>';


				            	var tLatlng = new google.maps.LatLng(item.lat ,item.lon );
				                var tOptions = {center : tLatlng};
				                var tMarker = new google.maps.Marker({
				                    contentString: contentString,
				                    position : tLatlng,
				                    map : gmap,
				                    icon : '${resource(dir: 'images/dots', file: 'dot-red.png')}'
				                });

				                google.maps.event.addListener(tMarker,'click', function() {
				                    infowindow.open(gmap,tMarker);
				                    infowindow.setContent(tMarker.contentString);
				                });

				                markers_factory.push(tMarker);	
				            });//each
				        }    	
			    	}
			    );	
			}
		
			$( document ).on( "pageshow","#myPage", function() {
	
				setContentHeight();
				drawMap(twLatLng);  //show map	
				
				function drawMap(latlng) {
					var myOptions = {
						zoom: 7,
						center: latlng,
						mapTypeId: google.maps.MapTypeId.ROADMAP,
						//scaleControl: true, //比例尺(預設:false)
			            panControl: false, //方向控置(預設:true)
			            //zoomControl: false, //縮放桿(預設:true)
			            //streetViewControl:false, //街景小人(預設：true)
			            mapTypeControl: false, //地圖/衛星切換按鈕(預設:true)
					};
		
					gmap = new google.maps.Map(document.getElementById("map-canvas"), myOptions);
					
					//地圖中心點
					gmap.addListener('center_changed', function() {
						currLatLng = gmap.getCenter();
					});

					infowindow = new google.maps.InfoWindow({maxWidth: 350});	
					//修改 infowindow
					google.maps.event.addListener(infowindow, 'domready', function() {

					    // Reference to the DIV that wraps the bottom of infowindow
					    var iwOuter = $('.gm-style-iw');

					    /* Since this div is in a position prior to .gm-div style-iw.
					     * We use jQuery and create a iwBackground variable,
					     * and took advantage of the existing reference .gm-style-iw for the previous div with .prev().
					    */
					    var iwBackground = iwOuter.prev();

					    // Removes background shadow DIV
					    iwBackground.children(':nth-child(2)').css({'display' : 'none'});

					    // Removes white background DIV
					    iwBackground.children(':nth-child(4)').css({'display' : 'none'});

					    // Moves the infowindow 115px to the right.
					    iwOuter.parent().parent().css({left: '115px'});

					    // Moves the shadow of the arrow 76px to the left margin.
					    iwBackground.children(':nth-child(1)').attr('style', function(i,s){ return s + 'left: 76px !important;'});

					    // Moves the arrow 76px to the left margin.
					    iwBackground.children(':nth-child(3)').attr('style', function(i,s){ return s + 'left: 76px !important;'});

					    // Changes the desired tail shadow color.
					    iwBackground.children(':nth-child(3)').find('div').children().css({'box-shadow': 'rgba(72, 181, 233, 0.6) 0px 1px 6px', 'z-index' : '1'});

					    // Reference to the div that groups the close button elements.
					    var iwCloseBtn = iwOuter.next();

					    // Apply the desired effect to the close button
					    iwCloseBtn.css({opacity: '1', right: '38px', top: '3px', border: '7px solid #48b5e9', 'border-radius': '13px', 'box-shadow': '0 0 5px #3990B9'});

					    // If the content of infowindow not exceed the set maximum height, then the gradient is removed.
					    if($('.iw-content').height() < 140){
					      $('.iw-bottom-gradient').css({display: 'none'});
					    }

					    // The API automatically applies 0.7 opacity to the button after the mouseout event. This function reverses this event to the desired value.
					    iwCloseBtn.mouseout(function(){
					      $(this).css({opacity: '1'});
					    });
					  });

					//預設載入的圖層事件
					//todo
				}
			});

		</script>
		
		
		        
	</head>
	<body>
		
		<div data-role="page" id="myPage" data-title="OPEN 404">
		
			<g:render template="/jqmDialog" />
		
			<g:render template="/jqmHeader" model="['backButton':false,'settingButton':true]" />
		
			<div class="ui-content main-content" role="main" style="padding:0px;">				
				<div id="map-canvas" style="height:100%;width:100%;"></div>
			</div>
		
		</div>

	</body>
</html>


