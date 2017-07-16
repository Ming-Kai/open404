var bDebug = true;
function AjaxAgent(targetFunction, async, bForm)
{
	var pThis = this;
	var AjaxRequest = null;
	if (window.XMLHttpRequest)
	{
		AjaxRequest = new XMLHttpRequest();
		if (AjaxRequest.overrideMimeType)
			AjaxRequest.overrideMimeType('text/xml');
	}
	else if (window.ActiveXObject)
	{
		try {AjaxRequest = new ActiveXObject("Msxml2.XMLHTTP");} 
		catch (e) {try {AjaxRequest = new ActiveXObject("Microsoft.XMLHTTP");} catch (e) {}};
	}
		
	this.Open = function(strMethod, targetFunction)
	{
		if (AjaxRequest==null)
			return;
		//if (window.netscape != null)
		//	netscape.security.PrivilegeManager.enablePrivilege("UniversalBrowserRead");
		AjaxRequest.open(strMethod, targetFunction, async);
		if (bForm)
			AjaxRequest.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
	}

	this.SendRequest = function(pPostData, pSucceed, pComplete, pFailed, pStep)
	{
		if (AjaxRequest==null)
			return;
		function CompleteStatae()
		{
			if (pComplete) pComplete.call(pThis, AjaxRequest, AjaxRequest.status);
			if (AjaxRequest.status != 200)
			{
				if (pFailed) pFailed.call(pThis, AjaxRequest, AjaxRequest.status);
				if (bDebug) window.open("").document.write(AjaxRequest.responseText);
			}
			else if (pSucceed)
			{
				pSucceed.call(pThis, AjaxRequest);
			}
		}
		
		if (async)
		{
			AjaxRequest.onreadystatechange = function()
			{
				if (pStep) pStep.call(pThis, AjaxRequest, AjaxRequest.readyState);
				if (AjaxRequest.readyState == 4)
					CompleteStatae();
			};
		}
		try {AjaxRequest.send(pPostData);}
		catch (e) {return alert("Error");}
		if (!async)
		{
			if (!async)
				CompleteStatae();
			return AjaxRequest;
		}
		return null;
	}
	
	if (targetFunction)
		this.Open("POST", targetFunction);
}

function GetXMLChildNode(pNode, strName)
{
	var pNodes = FindXMLNodes(pNode, strName);
	if (pNodes != null && pNodes.length > 0)
		return pNodes.item(0);
	return null;
}

function FindXMLNodes(pNode, strName)
{
	if (pNode == null)
		return null;
	//if (window.netscape != null)
	//	netscape.security.PrivilegeManager.enablePrivilege("UniversalBrowserRead");
	return pNode.getElementsByTagName(strName);
}

function GetXMLNodeText(pNode)
{
	if (pNode==null)
		return null;
	//if (window.netscape != null)
	//	netscape.security.PrivilegeManager.enablePrivilege("UniversalBrowserRead");
	if (pNode.firstChild)
		return pNode.firstChild.nodeValue;
	return "";
}

function GetXMLNodeAttribute(pNode, strName)
{
	if (pNode)
	{
		//if (window.netscape != null)
		//	netscape.security.PrivilegeManager.enablePrivilege("UniversalBrowserRead");
		return pNode.getAttribute(strName);
	}
	return "";
}

function LoadScript(sSrc, pFunc)
{
	var bLoaded = false;
	var pScp = document.createElement("script");
	function readystatechanged()
	{
		if (pScp.readyState == "loaded")
			Loaded();
	}
	function Loaded() 
	{
		bLoaded = true;
		if (pFunc)
			pFunc.call(null, pScp);
		DetachEvent(pScp, "readystatechange", readystatechanged, false);
		DetachEvent(pScp, "load", Loaded, false);
		document.body.removeChild(pScp);
	}
	AttachEvent(pScp, "readystatechange", readystatechanged, false);
	AttachEvent(pScp, "load", Loaded, false);
	document.body.appendChild(pScp);
	pScp.type = "text/javascript";
	pScp.src = sSrc;
}