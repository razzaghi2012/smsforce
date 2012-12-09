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

app.post('/tropo/voice.json', function(req, res) {
	var tropo = new tropowebapi.TropoWebAPI();
	tropo.say("The voice protocol is not supported at this time.");
    res.send(tropowebapi.TropoJSON(tropo));
});

app.post('/tropo/text.json', function(req, res) {
	io.sockets.emit('log', 'WORKK!!!!' + req.body);
	var tropo = new tropowebapi.TropoWebAPI();
	tropo.say("text");
    res.send(tropowebapi.TropoJSON(tropo));
});

io.sockets.on('connection', function (socket) {
  socket.emit('log', 'connection');
});
