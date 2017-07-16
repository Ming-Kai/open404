<div id="footer" data-role="footer" data-position="fixed" style="border: 0px;text-align: right;background: rgba(0,0,0,0);">	
	<div style="background-repeat: repeat-x;background-image: url('${resource(dir: 'images', file: 'socmap/footer.png')}');height:40px;width: 100%;display: block;margin: 0px;padding:0px;background-size: 300px 40px;background-position:center;">
		<g:if test="${topButton}">
			<a href="#" onclick="$.mobile.silentScroll(0)" data-role="button" class="ui-btn ui-btn-b ui-icon-carat-u ui-btn-icon-left ui-shadow ui-corner-all" style="margin-right: 0.5em;">Top</a>	
		</g:if>
	</div>		
</div><!-- /footer -->