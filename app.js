var sumoEtna = require("./sumo_modules/sumo-etna.js");
var sumo = require('node-sumo');
var drone = sumo.createClient();
var video = drone.getVideoStream();
var buf = null;
var cv = require('opencv');
var w = new cv.NamedWindow("Video", 0);
var WebSocketServer = require('ws').Server,
    server =  new WebSocketServer({port: 8080});
var clients = [];
function broadcast(json) {
    for (var i = 0; i < clients.length; i++) {
	clients[i].send(json);
    }    
}


drone.connect(function() {
    console.log("Connected...");
    drone.forward(20);
});

drone.on("battery", function(battery) {
    console.log("battery: " + battery);
    broadcast(JSON.stringify(["battery", battery]));
});

video.on("data", function(data) {
    buf = data;
});

function qrCodeAction(text) {
    console.log("QrCode : "+text);
    switch(text) {
    case "BACK":
	drone.stop();
	drone.backward(25);
	setTimeout(function(){drone.stop()}, 1000)
	break;
    case "RIGHT":
	drone.stop();
	drone.right(100);
	setTimeout(function(){drone.stop()}, 1000)

	break;
    default:
	drone.forward(100);
	setTimeout(function(){drone.stop}, 1000)
	break;
	
    }
    broadcast(JSON.stringify(["qr", "qr.jpg", text]));
}

function colorSquareAction(color) {
//    console.log("Color : "+color);
    drone.angle(-90);
}

setInterval(function() {
  if (buf == null) {
   return;
  }
  try {
    cv.readImage(buf, function(err, im) {
        try {
	    broadcast(JSON.stringify(["mainPictures",buf]));
//	    broadcast(buf.toString);
            if (!im.width() < 1 && !im.height() < 1) {
                w.show(im);
                w.blockingWaitKey(0, 50);

		// COLOR SQUARE
		var colorSquare = sumoEtna.colorSquareDetection(im);
		if (colorSquare != undefined)
		    colorSquareAction(colorSquare);

		// QR CODE
		var qrcode = sumoEtna.qrDetection(buf);
		if (qrcode != "") 
		    qrCodeAction(qrcode);

            }
        } catch(e) {

        }
    });
  } catch(e) {

  }
}, 70);


// WEBSOCKET

function leapMove(data) {
//    var newData = JSON.parse(data);
    var newData = data;
    if (newData[1] > -15 && newData[1] < 15)
	drone.angle(0);
    else
	drone.angle(newData[1] / 16);

    console.log("SPEED : "+newData[2]);
    if (newData[2] > 0)
	drone.forward(newData[2]);
    else
	drone.backward(newData[2]);
}

/*function wsMove(data) {
    if (data[1] != 90 && data[1] != -90 && data[1] != 180 && data[1] != 0) {
	if (data[1] > -90 && data[1] < 90) { // IF -90 < ANGLE < 90
	    drone.forward(data[2] / 4);
	    if (data[1] < 15 && data[1] > -15)
		drone.angle(0);
	    else
		drone.angle(data[1] / 4);
	}
	else { // ELSE
	    drone.backward(data[2] / 4);
	    if (data[1] > 0) {
		if (data[1] < -165 && data[1] > 165)
		    drone.angle(0);
		else
		    drone.angle((data[1] - 180) / 4);
	    } else {
		if (data[1] < -165 && data[1] > 165)
		    drone.angle(0);
		else
		    drone.angle((data[1] + 180) / 4);
	    }
	}
    }


    else {
	drone.angle(data[1]);
	if (data[2] > 0)
	    drone.forward(data[2]);
	else
	    drone.backward(data[2]);
    }
}*/


function wsMove(data) {
    if (data[1] != 90 && data[1] != -90 && data[1] != 180 && data[1] != 0) {
	if (data[1] > -90 && data[1] < 90) { // IF -90 < ANGLE < 90
	    drone.forward(data[2] / 4);
	    if (data[1] < 15 && data[1] > -15)
		drone.right(0);
	    else
		drone.right(data[1] / 4);
	}
	else { // ELSE
	    drone.backward(data[2] / 4);
	    if (data[1] > 0) {
		if (data[1] < -165 && data[1] > 165)
		    drone.left(0);
		else
		    drone.left((data[1] - 180) / 4);
	    } else {
		if (data[1] < -165 && data[1] > 165)
		    drone.left(0);
		else
		    drone.left((data[1] + 180) / 4);
	    }
	}
    }


    else {
	drone.angle(data[1]);
	if (data[2] > 0)
	    drone.forward(data[2]);
	else
	    drone.backward(data[2]);
    }
}


function wsAction(data) {
    switch(data) {
    case "LongJump":
	drone.animationsLongJump();
	break;
    case "HighJump":
	drone.animationsHighJump();
	break;
    case "Metronome":
	drone.animationsMetronome();
	break;
    case "Ondulation":
	drone.animationsOndulation();
	break;
    case "Spiral":
	drone.animationsSpiral();
	break;
    case "Slalom":	
	drone.animationsSlalom();
	break;
    }
}

function wsMessage(data) {
    console.log("Message from client : " + data);

    switch(JSON.parse(data)[0]) {
    case "action":
	wsAction(JSON.parse(data)[1]);
	break;
    case "move":
	wsMove(JSON.parse(data));
	break;
    case "leapMove":
	leapMove(JSON.parse(data));
	break;
    case "stop":
	console.log("STOPING...");
	drone.stop();
	break;
    }
}

server.on('connection', function (wss) {
    clients.push(wss);  // add client to the array

    wss.on('message', function (data) {
	wsMessage(data);
    });
    
    
    wss.on('close', function () { // remove client from the array
	var index = clients.indexOf(wss);
	if (index > -1) 
	    clients.splice(index, 1);
    });
});
