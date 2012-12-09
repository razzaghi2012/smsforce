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
	io.sockets.emit('log', '/tropo/voice.json');
	var tropo = new tropowebapi.TropoWebAPI(); 
	tropo.say("Hello, World!");

    response.writeHead(200, { 'Content-Type': 'application/json' });
	response.end(tropowebapi.TropoJSON(tropo));
});

app.get('/tropo/text.json', function(req, res) {
	io.sockets.emit('log', '/tropo/text.json');
	var tropo = new tropowebapi.TropoWebAPI(); 
	tropo.say("Hello, World!");

    response.writeHead(200, { 'Content-Type': 'application/json' });
	response.end(tropowebapi.TropoJSON(tropo));
});

io.sockets.on('connection', function (socket) {
  socket.emit('log', 'connection');
});
