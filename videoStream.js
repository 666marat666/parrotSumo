"use strict";
/* WEBSOCKET */
var WebSocketServer = require('ws').Server,
    server =  new WebSocketServer({port: 8080});
var clients = [];

/* QR CODE */
var Canvas = require('canvas')
  , Image = Canvas.Image
  , qrcode = require('/home/erwan/CODECAMP/node/node_modules/jsqrcode/src/qrcode.js')(Canvas)

var sumo = require('node-sumo');
var cv = require('opencv');
var color   = require('color-thief');
var chooseColor = require('./sumo_modules/colordif').chooseColor;

var drone = sumo.createClient();
var video = drone.getVideoStream();
var buf = null;
var w = new cv.NamedWindow("Video", 0);

drone.connect(function() {
    console.log("Connected...");
    setInterval(function() {drone.forward(40); setTimeout(function(){drone.stop()}, 700)}, 2000)
});

drone.on("battery", function(battery) {
    console.log("battery: " + battery);
    sendAll(JSON.stringify(["battery", battery]));
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
var image = new Image();
var result = null;

function turnLeft() {
    drone.left(70);
    setTimeout(function(){drone.stop()}, 500);
}

function turnRight() {
    drone.right(25);
    setTimeout(function(){drone.stop()}, 500);
}

setInterval(function() {
  if (buf == null) {
   return;
  }
  try {
    cv.readImage(buf, function(err, im) {
	try {
	    if (!im.width() < 1 && !im.height() < 1) {
		w.show(im);
		w.blockingWaitKey(0, 50);

		//	    if (err) console.log(err);
		
		/* QR CODE */
		image.src= buf;
		result = qrcode.decode(image);
		console.log('NW QR CODE : ' + result);
		if (result == "LEFT")
		    turnLeft();
		else if (result == "RIGHT")
		    turnRight();
		sendAll(JSON.stringify(["qr", "qr.png", result]));
	    }
	} catch(e) {

	}
    });
  } catch(e) {

  }
}, 70);


/* WEBSOCKET CODE */
function sendAll(json) {
    for (var i = 0; i < clients.length; i++) {
	clients[i].send(json);
    }    
}

server.on('connection', function (wss) {
    clients.push(wss);  // add client to the array

    wss.on('message', function (data) {
	console.log(data);
    });
    
    wss.on('close', function () { // remove client from the array
	var index = clients.indexOf(wss);
	if (index > -1) {
	        clients.splice(index, 1);
	    }
    });
});
