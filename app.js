var sumoEtna = require("./sumo_modules/sumo-etna.js");
var sumo = require('node-sumo');
var drone = sumo.createClient();
var video = drone.getVideoStream();
var buf = null;
var cv = require('opencv');
var w = new cv.NamedWindow("Video", 0);

drone.connect(function() {
    console.log("Connected...");
});

drone.on("battery", function(battery) {
    console.log("battery: " + battery);
});

video.on("data", function(data) {
    buf = data;
});

function qrCodeAction(text) {
    console.log("QrCode : "+text);
}

function colorSquareAction(color) {
    console.log("Color : "+color);
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
