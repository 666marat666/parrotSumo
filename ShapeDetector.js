"use strict";

var sumo = require('node-sumo');
var cv = require('opencv');
var color   = require('color-thief');
var chooseColor = require('./sumo_modules/colordif').chooseColor;

var colorThief = new color();
var drone = sumo.createClient();
var video = drone.getVideoStream();
var buf = null;
var w = new cv.NamedWindow("Video", 0);

drone.postureJumper();
console.log("Connecting...");
drone.connect(function() {
  console.log("Connected !");
  launchShapeDetection();
});

drone.on("battery", function(battery) {
  console.log("battery: " + battery);
});

video.on("data", function(data) {
  buf = data;
});


function launchShapeDetection () {
    setInterval(function() {
	if (buf == null) {
	    return;
	}
	
	try {
	    shapeDetection();
	    
	} catch(e) {
	    console.log(e);
	}
    }, 500);
}


function shapeDetection() {
    var lowThresh  = 0;
    var highThresh = 100;
    var nIters     = 2;
    var minArea    = 2000;
    
    var BLUE  = [0, 255, 0]; //B, G, R
    var RED   = [0, 0, 255]; //B, G, R
    var GREEN = [0, 255, 0]; //B, G, R
    var WHITE = [255, 255, 255]; //B, G, R
    
    var display = false;

    cv.readImage(buf, function(err, im) {
	var out = new cv.Matrix(im.height(), im.width());
	
	//im.convertGrayscale();
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
		//im.drawContour(contours, i, WHITE);
	    }
	}
	
	if (display == true) {
	    var im2 = im.crop(points[0].x, points[0].y, (points[3].x - points[0].x), (points[3].y - points[0].y));
	    getColorFromImage(im2);
	    w.show(im2);
	} else
	    w.show(im);
	w.blockingWaitKey(0,50);
	
	//	out.save('./out.png');
    });
}




function compare(a,b) {
  if ((a.x + a.y) < (b.x + b.y))
    return -1;
  else if ((a.x + a.y) > (b.x + b.y))
    return 1;
  else 
    return 0;
}

function getColorFromImage(im) {
    var colorMax = colorThief.getColor(im.toBuffer());
    var similar = JSON.stringify(chooseColor(rgbToHex(colorMax)));
//    console.log("REAL   : "+colorMax);
    console.log("ChoosenColor : "+similar);
}

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
