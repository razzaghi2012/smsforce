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

	if(message.toLowerCase() == 'unregister') {
		delete senders[sender];
		tropo.say('You have been unregistered.');
		res.send(tropowebapi.TropoJSON(tropo));
		return;
	}

	if(senders[sender]) {
		io.sockets.emit('log', senders[sender]);
		if(senders[sender].state == 'pending-username') {
			io.sockets.emit('log', 'setting username');
			senders[sender].username = message;
			senders[sender].state = 'pending-skills';
			tropo.say('Thank you. Please send us a list of skills that you would like to be listed for. For example, "roofing, painting, carpentry".');
		} else if(senders[sender].state == 'pending-skills') {
			io.sockets.emit('log', 'setting skills');
			senders[sender].state = 'complete';
			tropo.say('Your profile is complete! You should start receiving job offers shortly.');
		}
	} else {
		senders[sender] = { rating: null, skills: '', state: 'pending-username', username: '' };
		tropo.say('Thank you for registering. Please send us a name that you would like to be known by in the system.');
	}

    res.send(tropowebapi.TropoJSON(tropo));
});

io.sockets.on('connection', function (socket) {
  socket.emit('log', 'connection');
});
