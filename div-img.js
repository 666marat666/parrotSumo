"use strict";

var cv = require('opencv');
var w = new cv.NamedWindow("Video", 0);

/*
setInterval(function(){
    cv.readImage("test.jpg", function(err, im) {
	if (err) {
            console.log(err);
	} else {
            if (im.width() < 1 || im.height() < 1) {
		console.log("no width or height");
		return;
            }
	    var img2 = getTopRightImg(im, 200, 200); 
            w.show(img2);
            w.blockingWaitKey(0, 50);
	}
    });
}, 1000);
*/

function getCenterImg(img, width, height) {
    var x   = img.width()/2 - width/2;
    var y   = img.height/2 - height/2;
    var res = img.crop(x, y, width, height);
    
    return (res);
}

function getLeftImg(img) {
    var x      = 0;
    var y      = 0;
    var width  = img.width()/2;
    var height = img.height();
    var res    = img.crop(x, y, width, height);

    return (res);
}

function getRightImg(img) {
    var x      = img.width()/2;
    var y      = 0;
    var width  = img.width()/2;
    var height = img.height();
    var res    = img.crop(x, y, width, height);

    return (res);
}

function getTopLeftImg(img, width, height) {
    var x   = 0;
    var y   = 0;
    var res = img.crop(x, y, width, height);

    return (res);
}

function getTopRightImg(img, width, height) {
    var x   = img.width() - width;
    var y   = 0;
    var res = img.crop(x, y, width, height);

    return (res);
}

function getBotLeftImg(img, width, height) {
    var x   = 0;
    var y   = img.height() - height;
    var res = img.crop(x, y, width, height);

    return (res);
}

function getBotRightImg(img, width, height) {
    var x   = img.width() - width;
    var y   = img.height() - height;
    var res = img.crop(x, y, width, height);

    return (res);
}
