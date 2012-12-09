
var workers = {};

export.addWorker = function(worker) {
	workers[worker.workerId] = worker;
}

export.removeWorker = function(workerId) {
	delete workers[workerId];
}

export.getWorker = function(workerId) {
	return workers[workerId];
}

export.updateWorker = function(workerId, worker) {
	workers[workerId] = worker;
}

export.getWorkers = function() {
	return workers;
}

export.sendMessageToWorkers = function(message) {
		
}
