
var Canvas = require('canvas')
  , Image = Canvas.Image
  , qrcode = require('/home/erwan/CODECAMP/node/node_modules/jsqrcode/src/qrcode.js')(Canvas)


var filename = '/home/erwan/CODECAMP/node/qrcode.jpg'

var image = new Image()
image.onload = function(){
  var result;
  try{
    result = qrcode.decode(image)
    console.log('result of qr code: ' + result);
  }catch(e){
    console.log('unable to read qr code');
  }
}
image.src = filename
