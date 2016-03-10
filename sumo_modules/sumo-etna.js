// MODULES
var cv = require('opencv');
var Canvas = require('canvas')
  , Image = Canvas.Image
  , qrcode = require('/home/erwan/CODECAMP/node/node_modules/jsqrcode/src/qrcode.js')(Canvas)
var colorDifference =  require('color-difference');
var chooseColor = require("../sumo_modules/colordif").chooseColor;
var color   = require('color-thief');

// EVENTS
var EventEmitter = require("events").EventEmitter,
    util = require("util");

function MyEmitter() {
  EventEmitter.call(this);
}

util.inherits(MyEmitter, EventEmitter);

const myEmitter = new MyEmitter();
myEmitter.on('event', () => {
  console.log('an event occurred!');
});


// SHAPE DETECTION

function rgbToHex(tab) {
    var str="#", tmp, tmp2;

    for (var i=0; i < tab.length; i++) {
        tmp = tab[i].toString(16).toUpperCase();
        if (tmp.length < 2)
                tmp2 = tmp + ""+tmp;
        else
                tmp2 = tmp;
        str+=tmp2;
    }
    return str;
}

function getColorFromImage(im) {
    var colorMax = colorThief.getColor(im.toBuffer());
    var similar = JSON.stringify(chooseColor(rgbToHex(colorMax)));
//    var similar = chooseColor(rgbToHex(colorMax));
    return similar;
}

function compare(a,b) {
  if ((a.x + a.y) < (b.x + b.y))
    return -1;
  else if ((a.x + a.y) > (b.x + b.y))
    return 1;
  else
    return 0;
}

colorSquareDetection = function(buf) {
    var lowThresh  = 0;
    var highThresh = 100;
    var nIters     = 2;
    var minArea    = 2000;
    
    var BLUE  = [0, 255, 0]; //B, G, R
    var RED   = [0, 0, 255]; //B, G, R
    var GREEN = [0, 255, 0]; //B, G, R
    var WHITE = [255, 255, 255]; //B, G, R
    var display = false;

    var im = buf;
    var im_canny = im.copy();
    
    im_canny.canny(lowThresh, highThresh);
    im_canny.dilate(nIters);
    
    var contours = im_canny.findContours();
    var validAreas = 0;
    for(var i = 0; i < contours.size(); i++) {
	
        if(contours.area(i) < minArea) continue;
        validAreas ++;
        var arcLength = contours.arcLength(i, true);
        contours.approxPolyDP(i, 0.017 * arcLength, true);
	
        switch(contours.cornerCount(i)) {
        case 3:
            im.drawContour(contours, i, GREEN);
	    
            break;
        case 4:
            im.drawContour(contours, i, RED);
            var points = [
                contours.point(i, 0),
                contours.point(i, 1),
                contours.point(i, 2),
                contours.point(i, 3)
            ]
            points.sort(compare);
            if (Math.abs(Math.abs(points[0].x - points[3].x) - Math.abs(points[0].y - points[3].y)) < 50)
                display = true;
            break;
        default:
            break;
        }
    }

    if (display == true) {
        var im2 = im.crop(points[0].x, points[0].y, (points[3].x - points[0].x), (points[3].y - points[0].y));
        var color = getColorFromImage(im2);
	myEmitter.emit('event');
	return color;
    } 
}



// QR CODE DETECTION
var colorThief = new color();
var image = new Image();
var result = null;

var qrDetection = function(buf) {
    try {
	image.src = buf;
	result = qrcode.decode(image);
	return result;
    } catch(e) {
	return "";
    }
}


exports.qrDetection = qrDetection;
exports.colorSquareDetection  = colorSquareDetection;
