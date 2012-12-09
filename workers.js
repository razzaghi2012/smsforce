
var workers = {};

exports.addWorker = function(worker) {
	workers[worker.workerId] = worker;
}

exports.removeWorker = function(workerId) {
	delete workers[workerId];
}

exports.getWorker = function(workerId) {
	return workers[workerId];
}

exports.updateWorker = function(workerId, worker) {
	workers[workerId] = worker;
}

exports.getWorkers = function() {
	return workers;
}

exports.sendMessageToWorkers = function(fn) {
	for(var workerId in workers) {
		fn(workers[workerId]);
	}
}
