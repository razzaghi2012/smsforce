var app = require('express')(), 
	server = require('http').createServer(app),
	io = require('socket.io').listen(server),
	port = process.env.PORT || 3000,
	tropowebapi = require('tropo-webapi');

server.listen(port);

io.set('transports', [
	'flashsocket', 
	'htmlfile',
	'xhr-polling',
	'jsonp-polling'
]);
io.set('log level', 0);

app.get('/', function (req, res) {
  res.sendfile(__dirname + '/index.html');
});

app.get('/tropo/voice.json', function(req, res) {
	var tropo = new tropowebapi.TropoWebAPI();
	tropo.say("Hello World! voice");
    res.send(tropowebapi.TropoJSON(tropo));
});

app.get('/tropo/text.json', function(req, res) {
	var tropo = new tropowebapi.TropoWebAPI();
	tropo.say("Hello World! text");
    res.send(tropowebapi.TropoJSON(tropo));
});

io.sockets.on('connection', function (socket) {
  socket.emit('log', 'connection');
});
