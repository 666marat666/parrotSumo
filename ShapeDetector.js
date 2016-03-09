"use strict";

var sumo = require('node-sumo');
var cv = require('opencv');
var drone = sumo.createClient();
var video = drone.getVideoStream();
var buf = null;
var w = new cv.NamedWindow("Video", 0);

drone.postureJumper();
console.log("Connecting...");
drone.connect(function() {
  console.log("Connected !");
  console.log("===== Starting Image Analysis =====\n");
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
	  	console.log("--- New Iteration ---\n");
	  	shapeDetection();

	  } catch(e) {
	    console.log(e);
	  }
	}, 500);
}


function shapeDetection() {
var lowThresh = 0;
var highThresh = 100;
var nIters = 2;
var minArea = 2000;

var BLUE = [0, 255, 0]; //B, G, R
var RED   = [0, 0, 255]; //B, G, R
var GREEN = [0, 255, 0]; //B, G, R
var WHITE = [255, 255, 255]; //B, G, R


cv.readImage(buf, function(err, im) {

	var out = new cv.Matrix(im.height(), im.width());

	//im.convertGrayscale();
	var im_canny = im.copy();

	im_canny.canny(lowThresh, highThresh);
	im_canny.dilate(nIters);

	var contours = im_canny.findContours();
	console.log("Contours count : " + contours.size())
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
			console.log("Point 0 : [" + points[0].x + ", " + points[0].y + "]");
			break;
		default:
			break;
			//im.drawContour(contours, i, WHITE);
		}
	}
	w.show(im);
	w.blockingWaitKey(0,50);
	console.log("Valid areas : " + validAreas)
	
//	out.save('./out.png');
});
}




