window.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.oRequestAnimationFrame;

function sgn(x) {	return (x>0) - (x<0); }

Array.prototype.min = function(f){ if(!this.length) return null; var min = this[0]; var minval = f(min); for(var i = this.length; i--;) {if (f(this[i]) < minval) {minval = f(this[i]); min = this[i]}} return min; }


Object.defineProperty(Object.prototype, "min", { 
  value: function(f) {
    var min = null; var minval = null; for(var i in this) { if (minval ==null || f(this[i]) < minval) {minval = f(this[i]); min = this[i]}} return min;
  },
  enumerable : false
});

function fadeOut(object, property, startVal, endVal, time, callback){
	var startTime = new Date().getTime();
	if(object['currentAnimationId']) startVal = object[property];
	object[property] = startVal;
	clearInterval(object['currentAnimationId']||0);
	var intId = setInterval(function(){
		var currentTime = new Date().getTime();
		if((currentTime-startTime)>=time){
			clearInterval(intId);
			object[property] = endVal;
			object['currentAnimationId'] = null;
			if (callback)
				callback();
		}
		else
			object[property] = startVal + (endVal - startVal)*(currentTime-startTime)/time;
	}, 60);
	object['currentAnimationId'] = intId;
}

function isPointWithin(a, p) { return a.x <= p.x && a.x + a.w > p.x && a.y <= p.y && a.y + a.h > p.y; }

function dist(a, b) {
	return Math.sqrt((a.tx-b.tx)*(a.tx-b.tx)+(a.ty-b.ty)*(a.ty-b.ty));
}

CanvasRenderingContext2D.prototype.drawRotatedImage = function(image, x, y, w, h, angle) {
	this.save(); 
	this.translate(x, y);
	this.init_angle = image.init_angle || 0;
	this.rotate(angle + this.init_angle);
	this.drawImage(image, -(image.width/2), -(image.height/2), w, h);
	this.restore();
}

CanvasRenderingContext2D.prototype.drawRotatedAnim = function(image, partX, partY, w, h, x, y, angle, size) {
	this.save(); 
	this.translate(x, y);
	this.rotate(angle);
	this.drawImage(image, partX, partY, w, h, -w/2*size, -h/2*size, w*size, h*size);
	this.restore();
}

function MovementQueue(map){
	this.currentPath = [];
  this.findPath = function(x, y, x_dest, y_dest){
		this.currentPath = findPath(map, [x, y], [x_dest, y_dest]);
		this.currentPath.shift();
  }
  this.queueMove = function(x, y){
  	this.currentPath = [[x, y]];
  }
  this.getLength = function(){
  	return this.currentPath.length;
	}
	this.getMove = function(){
		return this.currentPath.shift();
	}
}
function calcLineOfSight (start_x, start_y, end_x, end_y) {
  var coordinatesArray = [];
  var x1 = start_x;
  var y1 = start_y;
  var x2 = end_x;
  var y2 = end_y;
  var dx = Math.abs(x2 - x1);
  var dy = Math.abs(y2 - y1);
  var sx = (x1 < x2) ? 1 : -1;
  var sy = (y1 < y2) ? 1 : -1;
  var err = dx - dy;
  coordinatesArray.push([y1, x1]);
  // Main loop
  while (!((x1 == x2) && (y1 == y2))) {
    var e2 = err << 1;
    if (e2 > -dy) {
      err -= dy;
      x1 += sx;
    }
    if (e2 < dx) {
      err += dx;
      y1 += sy;
    }
    coordinatesArray.push([y1, x1]);
  }
  for(var i=0; i<coordinatesArray.length; i++){
  	var y = coordinatesArray[i][0];
  	var x = coordinatesArray[i][1];
  	if(!GAME.map.isShotValid(x, y)) return {isClear: false, obstacle: {x: x, y: y}};
  }
  return {isClear: true};
}