"use strict";

var sumo = require('node-sumo');
var cv = require('opencv');
var color   = require('color-thief');
var sumoColorModule = require('./sumo_modules/sumo-color');
var sumoShapeModule = require('./sumo_modules/sumo-shape');

var sumoColor = new sumoColorModule();
var sumoShape = new sumoShapeModule();

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
	if (buf == null)
	    return;
	try {
	    shapeDetection();
	} catch(e) {
	    console.log(e);
	}
    }, 500);
}


function shapeDetection() {
    cv.readImage(buf, function(err, im) {
	var tabPoints  = sumoShape.detectPoints(im);
	var tabSquares = sumoShape.detectSquare(im, tabPoints);
    });
}




function calibrate(points) {
    var xA = points[0].x;
    var xB = Math.abs(points[0].x - points[1].x) < 50 ? points[1].x : points[2].x;

    console.log(xA+" , "+xB)

    console.log(((320-((xA-xB)/2)-xA)*95)/640);
    drone.angle(-((320-((xA-xB)/2)-xA)*95)/640);
}

function comparePoints(a,b) {
    if (a.x + a.y < b.x + b.y)
        return -1;
    else if (a.x + a.y > b.x + b.y)
        return 1;
    else
        return 0;
}
