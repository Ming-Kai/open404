<div id="header" data-role="header" data-position="fixed">
	<g:if test="${backButton}"> <%--左邊是返回鍵 --%>
		<g:if test="${backURL}"> <%--指定路徑的返回鍵 --%>
			<a href="${backURL}" rel="external" data-icon="back" data-shadow="false" data-iconpos="notext" data-iconshadow="false" class="ui-btn-left">返回</a>
		</g:if>
		<g:else>
			<a href="#" class="ui-btn ui-corner-all ui-icon-back ui-btn-icon-notext ui-btn-left" data-rel="back">返回</a>			
		</g:else>		
	</g:if>
	<h1 class="ui-title" role="heading" style="padding: 0px;margin: 0.25em;min-height: 34px;">
		<span style="font-size: 125%;font-weight: bold;">OPEN 404</span>
	</h1>
	<g:if test="${menuButton}"> <%--右邊是選單鍵 --%>
		<a href="#menu-panel" data-icon="bars" data-shadow="false" data-iconpos="notext" data-iconshadow="false" class="ui-btn-right">選單</a>
	</g:if>	
	<g:if test="${settingButton}">
		<a href="javascript:void(0);" data-icon="gear" data-shadow="false" data-iconpos="notext" data-iconshadow="false" class="ui-btn-right" onclick="settingDialog();">設定</a>
	</g:if>
</div><!-- /header -->