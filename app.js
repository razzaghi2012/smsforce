var app = require('express')(), 
	server = require('http').createServer(app),
	io = require('socket.io').listen(server),
	port = process.env.PORT || 3000,
	tropowebapi = require('tropo-webapi'),
	workers = require('./workers');

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

app.post('/tropo/', function(req, res) {
	var workerId = req.body.session.from.id;
	var message = req.body.session.initialText;
	var tropo = new tropowebapi.TropoWebAPI();

	if(message.toLowerCase() == 'unregister') {
		workers.removeWorker(workerId);
		tropo.say('You have been unregistered.');
		res.send(tropowebapi.TropoJSON(tropo));
		return;
	}

	var worker = workers.getWorker(workerId);
	if(worker) {
		io.sockets.emit('log', worker);
		if(worker.state == 'pending-username') {
			io.sockets.emit('log', 'setting username');
			worker.username = message;
			worker.state = 'pending-skills';
			tropo.say('Thank you. Please send us a list of skills that you would like to be listed for. For example, roofing, painting, carpentry.');
		} else if(worker.state == 'pending-skills') {
			io.sockets.emit('log', 'setting skills');
			worker.state = 'complete';
			tropo.say('Your profile is complete! You should start receiving job offers shortly.');
		}
	} else {
		worker = { workerId: workerId, rating: null, skills: '', state: 'pending-username', username: '' };
		workers.addWorker(worker);

		tropo.say('Thank you for registering. Please send us a name that you would like to be known by in the system.');
	}

    res.send(tropowebapi.TropoJSON(tropo));
});

io.sockets.on('connection', function (socket) {
  socket.emit('log', 'connection');
  socket.on('message', function(message) {
  	var url = 'https://api.tropo.com/1.0/sessions?action=create&token=TOKEN'

  	workers.sendMessageToWorkers(function(worker) {

	var token = '184ffe6388374c4d99084d89e141908d9d0b8508f38c3fadaa',
		msg = encodeURI('This is a test SMS message from Node.js.'),
		tropoSessionAPI = 'api.tropo.com',
		path = '/1.0/sessions?action=create&token=' + token + '&msg=' + message + '&number=' + worker.workerId;

		var tropo = http.createClient(80, tropoSessionAPI);
		var request = tropo.request('GET', path, {'host': tropoSessionAPI});

		request.end();

		request.on('response', function (response) {
		  response.setEncoding('utf8');
		  response.addListener('data', function (chunk) {
		  sys.log('Sent message. Tropo response code:' + response.statusCode + '. Body: ' + chunk);
			socket.emit('log', 'The message has been sent to ' + worker.username);
		  });
		});         
  	});
  });
});
