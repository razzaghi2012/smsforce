
var mongo = require('mongodb'),
	db = new mongo.Db('chat', new mongo.Server('hc.io', 27017, { autoreconnect: true }));

module.exports.open = function(callback) {
	db.open(callback);
}

module.exports.close = function() {
	db.close();
}

module.exports.getUsersCollection = function() {
	return db.collection('users');
}

module.exports.getAuthCollection = function() {
	return db.collection('userauths');
}

module.exports.getRoomsCollection = function() {
	return db.collection('rooms');
}

module.exports.getMessagesCollection = function(roomId) {
	return db.collection('room_' + roomId);
}

module.exports.getUsersInRoomCollection = function(roomId) {
	return db.collection('users_' + roomId);
}

module.exports.getAttachmentsCollection = function(roomId) {
	return db.collection('attachments_' + roomId);
}

module.db = db;

module.exports.Long = mongo.Long;
module.exports.ObjectID = mongo.ObjectID;
module.exports.Timestamp = mongo.Timestamp;
module.exports.Binary = mongo.Binary;
module.exports.Code = mongo.Code;
module.exports.Symbol = mongo.Symbol;
module.exports.MinKey = mongo.MinKey;
module.exports.MaxKey = mongo.MaxKey;
module.exports.Double = mongo.Double;
