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
  console.log("===== Starting Image Analysis =====");
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
	  	console.log("--- New Iteration ---");
	  	shapeDetection();

	  } catch(e) {
	    console.log(e);
	  }
	}, 100);
}




function shapeDetection() {
var lowThresh = 0;
var highThresh = 100;
var nIters = 4;
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
		contours.approxPolyDP(i, 0.01 * arcLength, true);
		console.log("ApproxPoly Contours count : " + contours.size())

		switch(contours.cornerCount(i)) {
		case 3:
			im.drawContour(contours, i, GREEN);
			break;
		case 4:
			im.drawContour(contours, i, RED);
			break;
		default:
			break;
			//im.drawContour(contours, i, WHITE);
		}
	}
	console.log("Valid areas : " + validAreas)
	w.show(im);
	w.blockingWaitKey(0,50);
//	out.save('./out.png');
});
}


