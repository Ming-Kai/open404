<%-- dialog --%>
<div data-role="popup" id="myDialog" data-overlay-theme="b" data-theme="a" data-dismissible="false" style="min-width:300px;">
	<div data-role="header" data-theme="a"><h1 id="myDialog_title"></h1></div>
	<div role="main" class="ui-content">
		<form>
		
			<g:render template="setting" />
			
			<fieldset class="ui-grid-a">
				<div class="ui-block-a">
				<a href="javascript:void(0);" class="ui-btn ui-icon-check ui-btn-icon-left ui-corner-all ui-shadow ui-btn-b" onclick="map_setting();">設定</a>
				</div>
				<div class="ui-block-b">
				<a href="javascript:void(0);" class="ui-btn ui-icon-delete ui-btn-icon-left ui-corner-all ui-shadow ui-btn-a" data-rel="back">取消</a>
				</div>		
			</fieldset>
		</form>
	</div>
</div>