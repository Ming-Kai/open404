OpenLayers.Control.MagnifyingGlass = OpenLayers.Class(OpenLayers.Control, {
autoActivate: true,
initialize: function(){
OpenLayers.Control.prototype.initialize.apply(this, arguments);
},

draw: function(){
OpenLayers.Control.prototype.draw.apply(this, arguments);
this.handler = new OpenLayers.Handler.MouseWheel(this, {
"down": this.magnifyingglassZoomOut,
"up": this.magnifyingglassZoomIn
});
this.initDiv();

},

initDiv: function(){
var a = OpenLayers.Util.createDiv("map_magnifyingglass");
a.style.borderRight = "medium none";
a.style.borderTop = "medium none";
a.style.borderLeft = "medium none";
a.style.borderBottom = "medium none";
a.style.width = "111px";
a.style.height = "74px";
a.style.display = "none";
a.style.unselectable = "on";
var c = OpenLayers.Util.createDiv();
c.style.lineHeight = "1px";
c.style.width = "4px";
c.style.height = "4px";
c.style.left = "0";
var b = OpenLayers.Util.createDiv();
b.style.lineHeight = "1px";
b.style.width = "4px";
b.style.height = "4px";
b.style.right = "0";
var d = OpenLayers.Util.createDiv();
d.style.lineHeight = "1px";
d.style.width = "4px";
d.style.height = "4px";
d.style.right = "0";
d.style.top = "40px";
var e = OpenLayers.Util.createDiv();
e.style.lineHeight = "1px";
e.style.width = "4px";
e.style.height = "4px";
e.style.left = "0";
e.style.top = "40px";
a.appendChild(c);
a.appendChild(b);
a.appendChild(d);
a.appendChild(e);
this.map.viewPortDiv.appendChild(a)
},

bw_out: null,
bw_in: null,
variable: 1,
getTimeout: function(a, b, c){
return window.setTimeout(function(){
b.apply(a)
}, c)
},
magnifyingglassZoomOut: function(a){
if (this.variable == 1) {
var b = OpenLayers.Util.getElement("map_magnifyingglass");
if (b) {
b.style.width = 111;
b.style.height = 74;
this.evt = a;
this.out()
}
}
},
magnifyingglassZoomIn: function(a){
if (this.variable == 1) {
var b = OpenLayers.Util.getElement("map_magnifyingglass");
if (b) {
b.style.width = "27px";
b.style.height = "24px";
this.evt = a;
this.in_()
}
}
},
out: function(){
this.Rx1(true)
},
in_: function(){
this.Rx1(false)
},
Rx1: function(a){
var b = OpenLayers.Util.getElement("map_magnifyingglass");
if (this.variable <= 4) {
if (b) {
var c = 1, d;
if (a) {
d = parseInt(b.style.width);
obj_h = parseInt(b.style.height);
c *= 15;
if (d >= 30) {
if (d && c) 
b.style.width = Math.abs(d - (c + 6)) + "px";
if (obj_h >= 25) 
if (obj_h && c) 
b.style.height = Math.abs(obj_h - c) + "px";
b.style.left = this.evt.xy.x -
parseInt(b.style.width) /
2 +
"px";
b.style.top = this.evt.xy.y -
parseInt(b.style.height) /
2 +
"px";
b.childNodes[0].style.borderWidth = "0px 2px 2px 0px";
b.childNodes[0].style.borderStyle = "solid";
b.childNodes[0].style.borderColor = "red";
b.childNodes[1].style.borderWidth = "0px 0px 2px 2px";
b.childNodes[1].style.borderStyle = "solid";
b.childNodes[1].style.borderColor = "red";
b.childNodes[2].style.borderWidth = "2px 0px 0px 2px";
b.childNodes[2].style.borderStyle = "solid";
b.childNodes[2].style.borderColor = "red";
b.childNodes[3].style.borderWidth = "2px 2px 0px 0px";
b.childNodes[3].style.borderStyle = "solid";
b.childNodes[3].style.borderColor = "red";
b.childNodes[2].style.top = b.style.height;
b.childNodes[3].style.top = b.style.height;
b.style.display = "";
b.style.zIndex = 1010
}
this.variable++;
this.bw_out = this.getTimeout(this, a ? this.out : this.in_, 60)
}
else {
d = parseInt(b.style.width);
obj_h = parseInt(b.style.height);
c *= 15;
if (d <= 111) {
b.style.width = Math.abs(d + c) + "px";
if (obj_h <= 64) 
b.style.height = Math.abs(obj_h + c) + "px";
b.style.left = this.evt.xy.x -
parseInt(b.style.width) /
2 +
"px";
b.style.top = this.evt.xy.y -
parseInt(b.style.height) /
2 +
"px";
b.childNodes[0].style.borderWidth = "2px 0px 0px 2px";
b.childNodes[0].style.borderStyle = "solid";
b.childNodes[0].style.borderColor = "red";
b.childNodes[1].style.borderWidth = "2px 2px 0px 0px";
b.childNodes[1].style.borderStyle = "solid";
b.childNodes[1].style.borderColor = "red";
b.childNodes[2].style.borderWidth = "0px 2px 2px 0px";
b.childNodes[2].style.borderStyle = "solid";
b.childNodes[2].style.borderColor = "red";
b.childNodes[3].style.borderWidth = "0px 0px 2px 2px";
b.childNodes[3].style.borderStyle = "solid";
b.childNodes[3].style.borderColor = "red";
b.childNodes[2].style.top = b.style.height;
b.childNodes[3].style.top = b.style.height;
b.style.display = "";
b.style.zIndex = 1010
}
this.variable++;
this.bw_in = this.getTimeout(this, a ? this.out : this.in_, 100)
}
}
}
else {
if (a) {
window.clearTimeout(this.bw_out);
this.bw_out = null
}
else {
window.clearTimeout(this.bw_in);
this.bw_in = null
}
this.variable = 1;
b.style.display = "none";
b.style.zIndex = 0;
b.style.width = "111px";
b.style.height = "74px"
}
}
});