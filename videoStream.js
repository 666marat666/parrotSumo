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

drone.connect(function() {
    console.log("Connected...");
//    drone.postureJumper();
    setTimeout(function() {
//	drone.animationsHighJump();
    }, 5000);

});

drone.on("battery", function(battery) {
  console.log("battery: " + battery);
});

video.on("data", function(data) {
  buf = data;
});


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
    console.log("REAL   : "+colorMax);
    console.log("STEVEN : "+similar);
}

var colorThief = new color();
setInterval(function() {
  if (buf == null) {
   return;
  }
  try {
    cv.readImage(buf, function(err, im) {
	if (err) console.log(err);
	if (im.width() < 1 || im.height() < 1) console.log('Image has no size');
	try {
	    getColorFromImage(im);
	    w.show(im);
	    w.blockingWaitKey(0, 50);
	} catch(e) {
//	    console.log(e);
	}
    });
  } catch(e) {
//      console.log(e);
  }
}, 100);
