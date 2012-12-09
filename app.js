var app = require('express')(), 
	server = require('http').createServer(app),
	io = require('socket.io').listen(server),
	port = process.env.PORT || 3000,
	tropoWebApi = require('tropo-webapi');

server.listen(port);

app.get('/', function (req, res) {
  res.sendfile(__dirname + '/index.html');
});

app.get('/tropo/voice.json', function(req, res) {
	var tropo = new tropowebapi.TropoWebAPI(); 
	tropo.say("Hello, World!");

    response.writeHead(200, { 'Content-Type': 'application/json' });
	response.end(tropowebapi.TropoJSON(tropo));
});

app.get('/tropo/text.json', function(req, res) {
	var tropo = new tropowebapi.TropoWebAPI(); 
	tropo.say("Hello, World!");

    response.writeHead(200, { 'Content-Type': 'application/json' });
	response.end(tropowebapi.TropoJSON(tropo));
});

io.sockets.on('connection', function (socket) {
  socket.emit('news', { hello: 'world' });
  socket.on('my other event', function (data) {
    console.log(data);
  });
});
