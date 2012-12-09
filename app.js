var app = require('express')(), 
	server = require('http').createServer(app),
	io = require('socket.io').listen(server),
	port = process.env.PORT || 3000,
	tropowebapi = require('tropo-webapi');

server.listen(port);

process.on('uncaughtException', function(err) {
  io.sockets.emit('log', 'zomgwtf? ' + err);
});

app.get('/', function (req, res) {
  res.sendfile(__dirname + '/index.html');
});

app.get('/tropo/voice.json', function(req, res) {
	io.sockets.emit('log', 'voice request');
	
	var tropo = new tropowebapi.TropoWebAPI(); 
	tropo.say("Hello, World!");

	var tropoJson = tropowebapi.TropoJSON(tropo);
    io.sockets.emit('log', tropoJson);
    res.send(tropoJson);
});

app.get('/tropo/text.json', function(req, res) {
	io.sockets.emit('log', 'text request');
	var tropo = new tropowebapi.TropoWebAPI(); 
	tropo.say("Hello, World!");

	var tropoJson = tropowebapi.TropoJSON(tropo);
    io.sockets.emit('log',  tropoJson);
    res.send(tropoJson);
});

io.sockets.on('connection', function (socket) {
  socket.emit('log', 'connection');
});
