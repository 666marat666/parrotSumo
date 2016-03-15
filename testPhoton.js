var WebSocketServer = require('ws').Server,
    server =  new WebSocketServer({port: 8080});
var clients = [];
function broadcast(json) {
    for (var i = 0; i < clients.length; i++) {
	clients[i].send(json);
    }    
}


server.on('connection', function (wss) {
    console.log("connected");
    clients.push(wss);  // add client to the array

//    setInterval(function(){broadcast("testFromServer");}, 1000);

    wss.on('message', function (data) {
	try {
	    console.log("MSG FROM CLIENT: "+data);
	} catch(e) {
	    console.log("ERROR : "+e);
	}
    });
    
    
    wss.on('close', function () { // remove client from the array
	var index = clients.indexOf(wss);
	if (index > -1) 
	    clients.splice(index, 1);
    });
});
