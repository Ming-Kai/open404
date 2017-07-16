OpenLayers.Control.MapSwitch = OpenLayers.Class(OpenLayers.Control, {
    div: null,
    initialize: function (options) {        
        OpenLayers.Control.prototype.initialize.apply(this, arguments);
    },
    draw: function () {
        OpenLayers.Control.prototype.draw.apply(this, arguments);
        this.initDiv();
    },
    initDiv: function(){
        OpenLayers.Control.prototype.draw.apply(this, arguments);
        this.div = OpenLayers.Util.createDiv("divMapSwitch");
        this.div.style.position = "absolute";
        this.div.style.zIndex = 1100;
        this.div.style.right = 10;
        this.div.style.top = 10;
        //this.div.style.display = "none";
        //this.div.innerHTML = '<img src="../images/WEGIS/target.png" width="32" height="32"></img>';
        this.map.viewPortDiv.appendChild(this.div);
        
        // 地圖事件
//        this.map.events.register('movestart', this, this.moveStart);
//        this.map.events.register('moveend', this, this.moveEnd);
    },
    moveStart: function(){
        if(this.map.getCenter()) {
            var center = this.map.getPixelFromLonLat(this.map.getCenter());
            
            this.div.style.left = center.x -16 + "px";
            this.div.style.top = center.y -16 + "px";
            this.div.style.display = "inline";
        }
    },
    moveEnd: function(){
        this.div.style.display = "none";
    },
    CLASS_NAME: "OpenLayers.Control.MapSwitch"
});