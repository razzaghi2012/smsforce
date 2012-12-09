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

app.use(require('connect').bodyParser());

app.get('/', function (req, res) {
  res.sendfile(__dirname + '/index.html');
});

var senders = {};

app.post('/tropo/', function(req, res) {
	var sender = req.body.session.from.id;
	var message = req.body.session.initialText;
	var tropo = new tropowebapi.TropoWebAPI();

	if(senders[sender]) {
		tropo.say('You are already registered.');
	} else {
		senders[sender] = { rating: null, skills: '' };
		tropo.say('Thank you for registering.');
	}

	tropo.say("Thank you for sending me a message (" + sender + ")! " + message);
    res.send(tropowebapi.TropoJSON(tropo));
});

io.sockets.on('connection', function (socket) {
  socket.emit('log', 'connection');
});
