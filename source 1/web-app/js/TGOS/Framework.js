var bDebug = true;
if (bDebug)
{
	var pErrorFunc = function (sMsg,sUrl,sLine)
	{
		var p = new SWGPanel(window.document.body, 0, true, true);
		var pM = p.getMainFrame()
		pM.style.position = "absolute";
		pM.style.top = 0
		pM.style.right = 0;
		pM.style.width = "250px";
		pM.style.height = 0;
		var pDiv = p.getViewFrame();
		pDiv.style.textAlign = "left";
		pDiv.innerHTML = "Error: " + sMsg + "<br>Line: " + sLine + "<br>URL: " + sUrl + "<br>";
		return true;
	}
	var pUnload = function()
	{
		DetachEvent(window, "error", pErrorFunc);
		DetachEvent(window, "unload", pUnload);
	}
	AttachEvent(window, "unload", pUnload);
	AttachEvent(window, "error", pErrorFunc);
}

function DeviceTest()
{
//MSIE, Firefox, Chrome, Safari, Opera, Gecko, Presto, Mozilla
	var agent=navigator.userAgent.toLowerCase();
	if(agent.indexOf("msie") > 0 && document.all)
		return "MSIE";
	else if(agent.indexOf("firefox") > 0)
		return "Firefox";
	else if(agent.indexOf("chrome") > 0)
		return "Chrome";
	else if(agent.indexOf("safari") > 0)
		return "Safari";
	else if(agent.indexOf("opera") > 0)
		return "Opera";
	else if(agent.indexOf("camino") > 0)
		return "Camino";
	else if(agent.indexOf("gecko") > 0)
		return "Gecko";
	else if(agent.indexOf("trident") > 0)
		return "Trident";
	else if(agent.indexOf("mozilla") > 0)
		return "Mozilla";
	return null;
}

function FuncAdapter(pCaller, pFunc)
{
	return function(pEvent)
	{
		return pFunc.call(pCaller, pEvent);
	};
}

function AttachEvent(targetObj, actEvent, actFunc, useCapture)
{
	if (targetObj.addEventListener)
	{
		if (actEvent == "mousewheel" && DeviceTest() == 'Firefox')
			actEvent = "DOMMouseScroll";
		if (useCapture)
			targetObj.ownerDocument.addEventListener(actEvent, actFunc, useCapture);
		else
			targetObj.addEventListener(actEvent, actFunc, useCapture);
	}
	else
	{
		targetObj.attachEvent("on" + actEvent, actFunc);
		if (useCapture)
			targetObj.setCapture();
	}
}

function DetachEvent(targetObj, actEvent, actFunc, useCapture)
{
	if (targetObj.removeEventListener)
	{
		if (actEvent == "mousewheel" && DeviceTest() == 'Firefox')
			actEvent = "DOMMouseScroll";
		if (useCapture)
			targetObj.ownerDocument.removeEventListener(actEvent, actFunc, useCapture);
		else
			targetObj.removeEventListener(actEvent, actFunc, useCapture);
	}
	else
	{
		targetObj.detachEvent("on" + actEvent, actFunc);
		if (useCapture)
			targetObj.releaseCapture();
	}
}

function Inherit(pThisObj, pBaseObj)
{
	for (var t in pBaseObj) pThisObj[t] = pBaseObj[t];
}

function CreateWndBG(pElem, sStyle, h1, h2, w1, w2)
{
	var pTbl = pElem.ownerDocument.createElement("TABLE");
	pElem.insertBefore(pTbl, pElem.firstChild);
	pTbl.style.position = "absolute";
	pTbl.style.left = "0px";
	pTbl.style.top = "0px";
	pTbl.style.width = "100%";
	pTbl.style.height = "100%";
	pTbl.border = "0px";
	pTbl.cellPadding = "0px";
	pTbl.cellSpacing = "0px";

	var pRow1 = pTbl.insertRow(-1);
	pRow1.height = h1;
	pRow1.style.height = h1;
	var pCell1 = pRow1.insertCell(-1);
	pCell1.className = sStyle + "InnerUL";
	var pCell2 = pRow1.insertCell(-1);
	pCell2.className = sStyle + "InnerU";
	var pCell3 = pRow1.insertCell(-1);
	pCell3.className = sStyle + "InnerUR";
	
	var pRow2 = pTbl.insertRow(-1);
	var pCell4 = pRow2.insertCell(-1);
	pCell4.className = sStyle + "InnerL";
	pCell4.width = w1;
	var pCell5 = pRow2.insertCell(-1);
	pCell5.className = sStyle + "Inner";
	pCell5.innerHTML = "&nbsp;"
	var pCell6 = pRow2.insertCell(-1);
	pCell6.className = sStyle + "InnerR";
	pCell6.width = w2;
	
	var pRow3 = pTbl.insertRow(-1);
	pRow3.height = h2;
	pRow3.style.height = h2;
	var pCell7 = pRow3.insertCell(-1);
	pCell7.className = sStyle + "InnerDL";
	var pCell8 = pRow3.insertCell(-1);
	pCell8.className = sStyle + "InnerD";
	var pCell9 = pRow3.insertCell(-1);
	pCell9.className = sStyle + "InnerDR";
	
	this.Dock = function(nType)
	{
		pRow1.style.display = ((nType&4)?"none":"");
		pRow3.style.display = ((nType&8)?"none":"");
		pCell1.style.display = ((nType&1)?"none":"");
		pCell4.style.display = ((nType&1)?"none":"");
		pCell7.style.display = ((nType&1)?"none":"");
		pCell3.style.display = ((nType&2)?"none":"");
		pCell6.style.display = ((nType&2)?"none":"");
		pCell9.style.display = ((nType&2)?"none":"");
	}
}

function CreateWndBG2(pElem,nWidth, h1, h2)
{
	var pTbl = pElem.ownerDocument.createElement("TABLE");
	pElem.insertBefore(pTbl, pElem.firstChild);
	pTbl.style.position = "absolute";
	pTbl.style.left = "0px";
	pTbl.style.top = "0px";
	pTbl.style.width = "100%";
	pTbl.style.height = "100%";
	pTbl.border = "0px";
	pTbl.cellPadding = "0px";
	pTbl.cellSpacing = "0px";

	var pRow1 = pTbl.insertRow(-1);
	pRow1.width = nWidth;
	pRow1.height = h1;
	pRow1.style.height = h1;
	var pCell1 = pRow1.insertCell(-1);
	pCell1.style.backgroundImage = "url(images/windows/004_01.png)";
	
	var pRow2 = pTbl.insertRow(-1);
	var pCell4 = pRow2.insertCell(-1);
	pCell4.style.backgroundImage = "url(images/windows/004_02.png)";
	
	var pRow3 = pTbl.insertRow(-1);
	pRow3.height = h2;
	pRow3.style.height = h2;
	var pCell7 = pRow3.insertCell(-1);
	pCell7.style.backgroundImage = "url(images/windows/004_03.png)";
	
	this.Dock = function(nType)
	{
	}
}

function SWGPanel(pParentElem, nStyle, bFloat, bAllowClose)
{
	var onClosedevent = null;
	this.setClosedEvent = function (newVal) {onClosedevent = newVal;};
	var m_pViewFrame = null;
	
	var m_hObj = pParentElem.ownerDocument.createElement("DIV");
	//pParentElem = pParentElem.ownerDocument.documentElement;
	pParentElem.appendChild(m_hObj);
	m_hObj.style.position = "absolute";
	m_hObj.style.width = "300px";
	m_hObj.style.height = "0px";
	m_hObj.style.left = "0px";
	m_hObj.style.top = "0px";
	//m_hObj.style.padding = "12px 15px 15px 15px";
	//m_hObj.style.background = "gray";
	//m_hObj.style.border = "1px solid #333";
	var m_pBG = null
	//if (nStyle == 0)
	//	m_pBG = new CreateWndBG(m_hObj, "Panel", "10pt", "12pt", "115pt", "100pt");
	//else
	//	m_pBG = new CreateWndBG(m_hObj, "Bar", "5pt", "5pt", "36pt", "23pt");
	m_pBG = new CreateWndBG2(m_hObj, 300, 12, 14)
	var m_pTbl = m_hObj.ownerDocument.createElement("TABLE");
	m_hObj.appendChild(m_pTbl);
	m_pTbl.style.position = "relative";
	m_pTbl.border = "0px";
	m_pTbl.cellPadding = "0px";
	m_pTbl.cellSpacing = "0px";
	m_pTbl.style.fontSize = "8pt";
	var pRow = m_pTbl.insertRow(-1);
	pRow.height = "13px";
	pRow.style.height = "13px";
	var pCell = pRow.insertCell(-1);
	pCell.width = "15px";
	pCell.style.width = "15px";
	var pCell = pRow.insertCell(-1);
	var pCell = pRow.insertCell(-1);
	pCell.width = "15px";
	pCell.style.width = "15px";
	
	var pRow = m_pTbl.insertRow(-1);
	var pCell = pRow.insertCell(-1);
	var pInnerCell = pRow.insertCell(-1);
	var pCell = pRow.insertCell(-1);
	
	var pRow = m_pTbl.insertRow(-1);
	pRow.height = "15px";
	pRow.style.height = "15px";
	var pCell = pRow.insertCell(-1);
	var pCell = pRow.insertCell(-1);
	var pCell = pRow.insertCell(-1);

			
	var m_pInnerTbl = pInnerCell.ownerDocument.createElement("TABLE");
	pInnerCell.appendChild(m_pInnerTbl);
	m_pInnerTbl.style.position = "relative";
	m_pInnerTbl.border = "0px";
	m_pInnerTbl.cellPadding = "0px";
	m_pInnerTbl.cellSpacing = "0px";
	m_pInnerTbl.style.fontSize = "8pt";
	
	var pRow = m_pInnerTbl.insertRow(-1);
	var pCell = pRow.insertCell(-1);
	pCell.className = "Panel";
	pCell.vAlign = "top";
	pCell.align = "center";
	pCell.style.padding = "0px 0px 3px 0px";
	
	var pDrag = null;
	var pTitle = null;
	if (bFloat)
	{
		pD = pCell.ownerDocument.createElement("TABLE");
		pD.style.fontSize = "8pt";
		pD.style.backgroundImage = "url(images/windows/004_04.png)";
		//pD.style.position = "relative";
		//pD.style.textAlign = "right";
		pD.border = "0px";
		pD.cellPadding = "0px";
		pD.cellSpacing = "0px";
		pD.style.width = "270px";
		pD.style.height = "17px";
		pCell.appendChild(pD);
		var pRow = pD.insertRow(-1);
		pTitle = pRow.insertCell(-1);
		pTitle.style.color = "white";
		var pSys = pRow.insertCell(-1);
		pSys.align = "right";
		pSys.style.padding = "0px 5px 0px 0px";
		
		if (bAllowClose)
		{
			var pImg = pSys.ownerDocument.createElement("IMG");
			pSys.appendChild(pImg);
			pImg.src = "images/icons/Close.png";
			pImg.border = "0";
			AttachEvent(pImg, "click", FuncAdapter(this, function(tEvent)
			{
				this.FinalRelease();
				if (onClosedevent) onClosedevent.call(this);
			}),false);
		}
		pDrag = new DragTracker(pRow, m_hObj);
	}
	
	var pRow = m_pInnerTbl.insertRow(-1);
	var pCell = pRow.insertCell(-1);
	pCell.style.padding = "0px";
	pCell.className = "Panel";
	pCell.vAlign = "top";
	pCell.align = "center";
	
	pC = pCell.ownerDocument.createElement("TABLE");
	pC.style.fontSize = "8pt";
	pC.border = "0px";
	pC.cellPadding = "0px";
	pC.cellSpacing = "0px";
	pC.style.width = "270px";
	pC.style.height = "100%";
	pCell.appendChild(pC);
	var pRow = pC.insertRow(-1);
	pRow.style.height = "9px";
	pT1 = pRow.insertCell(-1);
	pT1.style.backgroundImage = "url(images/windows/004_05.png)";
	var pRow = pC.insertRow(-1);
	pT2 = pRow.insertCell(-1);
	pT2.style.backgroundImage = "url(images/windows/004_06.png)";
	pT2.style.padding = "0px 9px 3px 9px";
	var pRow = pC.insertRow(-1);
	pRow.style.height = "8px";
	pT3 = pRow.insertCell(-1);
	pT3.style.backgroundImage = "url(images/windows/004_07.png)";
	
	pFrame = pT2.ownerDocument.createElement("DIV");
	pT2.appendChild(pFrame);
	pFrame.style.position = "relative";
	//pFrame.style.overflowX = "scroll";
	pFrame.style.left = "0px";
	pFrame.style.top = "0px";
	pFrame.style.width = "244px";
	pFrame.style.height = "100%";
	//pFrame.style.border = "solid 1px red";
	m_pViewFrame = pFrame;
		
	this.getViewFrame = function() {return m_pViewFrame;};
	this.getMainFrame = function() {return m_hObj;};
	this.putTitle = function(newVal) {pTitle.innerHTML = newVal;}
	this.FitFrameSize = function() 
	{
		m_hObj.style.width = m_pTbl.clientWidth + "px";
		m_hObj.style.height = m_pTbl.clientHeight + "px";
	}
	this.CenterWindow = function() 
	{
		m_hObj.style.left = ((pParentElem.clientWidth - m_pTbl.clientWidth) / 2) + "px";
		m_hObj.style.top = ((pParentElem.clientHeight - m_pTbl.clientHeight) / 2) + "px";
	}
	this.MoveWindow = function(nLeft, nTop) 
	{
		m_hObj.style.left = nLeft + "px";
		m_hObj.style.top = nTop + "px";
	}
	this.Show = function(bShow) {m_hObj.style.display = (bShow?'':"none")};
	this.FinalRelease = function()
	{
		if (m_pTbl)
			m_hObj.removeChild(m_pTbl);
		m_pTbl = null;
		if (m_hObj)
			pParentElem.removeChild(m_hObj);
		m_hObj = null;
		if (pDrag)
			pDrag.FinalRelease();
		pDrag = null;
	}
	
	this.Dock = function(nType)
	{
		m_hObj.style.left = (((nType&1)!=0)?"0px":"");
		m_hObj.style.right = (((nType&1)==0)?"0px":"");
		m_hObj.style.top = (((nType&8)==0)?"0px":"");
		m_hObj.style.bottom = (((nType&8)!=0)?"0px":"");
		m_pBG.Dock(nType);
	}
}

function SWGContextMenu(pParentElem, posX, posY, bSelfDelete)
{
	var m_ContextMenu = null;
    var m_Menu = null;
	var pFocusoutFunc = FuncAdapter(this, function() 
	{
		if (m_ContextMenu)
		{
			var pElem = event.toElement;
			while (pElem)
			{
				if (pElem == m_ContextMenu)
					break;
				pElem = pElem.parentElement;
			}
			if (pElem==null || event.toElement.tagName == "A")
			{
				DetachEvent(m_ContextMenu, "focusout", pFocusoutFunc, false);
				m_ContextMenu.style.display = "none";
				if (pElem)
					event.toElement.fireEvent("onclick");
			}
		}
		if (bSelfDelete)
			this.DestroyMenu();
	});
	
	this.DestroyMenu = function()
	{
		if (m_ContextMenu)
			pParentElem.removeChild(m_ContextMenu);
		m_ContextMenu = null;
	}
	
	this.AddItem = function(txtItem, clickEvent)
	{
		pA = m_Menu.ownerDocument.createElement("A");
		pA.href="javascript:;";
		if (clickEvent)
			AttachEvent(pA, "click", FuncAdapter(this, clickEvent), false);
		pA.appendChild(pA.ownerDocument.createTextNode(txtItem));
		m_Menu.appendChild(pA);
	}
    
    m_ContextMenu = pParentElem.ownerDocument.createElement("div");
	pParentElem.appendChild(m_ContextMenu);
	
	m_ContextMenu.style.position = "absolute";
    m_ContextMenu.style.width = "85px";
	m_ContextMenu.style.border = "solid 1px";
    m_ContextMenu.style.left = posX;
    m_ContextMenu.style.top = posY;
	
	m_Menu = m_ContextMenu.ownerDocument.createElement("DIV");
	m_Menu.className = "CB TC";
	m_ContextMenu.appendChild(m_Menu);
	
	AttachEvent(m_ContextMenu, "focusout", pFocusoutFunc, false);
	m_ContextMenu.focus();
}