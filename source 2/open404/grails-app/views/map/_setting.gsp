<div data-role="tabs" id="tabs">
	<div data-role="navbar">
		<ul>
			<li><a href="#times" data-ajax="false" class="ui-btn-active">時間設定</a></li>
			<li><a href="#layers" data-ajax="false">圖層設定</a></li>
		</ul>
	</div>
	
	<div id="times" style="opacity: 0.9;filter: alpha(opacity=90);padding:1em;border: 1px solid;border-radius: 0 0 5px 5px;">
		<label for="qDate">日期</label>
			<input type="date" data-clear-btn="false" name="qDate" id="qDate" value="${qdate}">
		
		<label for="qHour">整點:</label>
			<input type="range" name="qHour" id="qHour" value="${qhour}" min="0" max="23" step="1">
	</div>
	
	<div id="layers" style="opacity: 0.9;filter: alpha(opacity=90);padding:1em;border: 1px solid;border-radius: 0 0 5px 5px;">
		<%--<label for="marker_icon">標記顯示</label>
			<select id="marker_icon" name="marker_icon" data-role="flipswitch">
				<option>圓點</option>
				<option>圖示</option>
			</select>--%>
				
		<fieldset data-role="controlgroup" style="width:250px;height:200px;overflow-y: scroll;">
        <legend>工廠類型：</legend>
		<g:each in="${Industry.list()}" status="i" var="item">
			<label for="qFactory_${i}"><input type="checkbox" name="qFactory" id="qFactory_${i}" value="${item?.id}">${item?.id+':'+item?.cname }</label>
		</g:each>
        </fieldset>    

		<%--<label for="">焚化爐</label>
			<select id="qPeople" name="qPeople" data-role="flipswitch">
				<option>隱藏</option>
				<option>顯示</option>
			</select>--%>
		
		
		<label for="qPeople">民眾回報：</label>
			<select id="qPeople" name="qPeople" data-role="flipswitch">
				<option>隱藏</option>
				<option>顯示</option>
			</select>
		
	</div>
	
</div>
