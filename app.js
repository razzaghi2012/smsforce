var app = require('express')(), 
	http = require('http'),
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
	var tropo = new tropowebapi.TropoWebAPI();
	
	if(!req.body.session.from) {
		io.sockets.emit('log', 'OUTBOUND: ' + req.body.session.parameters.msg);
        tropo.call(req.body.session.parameters.number, null, null, null, null, null, "SMS", null, null, null);
		tropo.say(req.body.session.parameters.msg);
		res.send(tropowebapi.TropoJSON(tropo));
		return;
	}

	var workerId = req.body.session.from.id;
	var message = req.body.session.initialText;
	
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
  	workers.sendMessageToWorkers(function(worker) {
		var token = '184ffe6388374c4d99084d89e141908d9d0b8508f38c3fadaa766549289ebaccffecf18542caa10cc0af1ac4',
			path = '/1.0/sessions?action=create&token=' + token + '&msg=' + message + '&number=' + worker.workerId;
			message = encodeURI(message);


			var options = {
			  hostname: 'api.tropo.com',
			  port: 80,
			  path: path,
			  method: 'GET'
			};

			console.log(options);

			var req = http.request(options, function(res) {
			  console.log('STATUS: ' + res.statusCode);
			  console.log('HEADERS: ' + JSON.stringify(res.headers));
			  res.setEncoding('utf8');
			  res.on('data', function (chunk) {
			    console.log('BODY: ' + chunk);
			  });
			});         
		});
	});
});
