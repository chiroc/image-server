var util = require('./util.js').util;
var fs = require('fs');

// mongodb ////////////////////////////////////////
var mongo = require('mongodb');
var Server = mongo.Server;
var Db = mongo.Db;

var database = 'foo';
var host = 'localhost';
var port = 27017;
var cnns = 1;

var db = new Db(database, new Server(host, port, {
	safe : true,
	strict : false,
	auto_reconnect : true,
	poolSize : cnns
}));
// mongodb///////////////////////////////////////

db.open(function(err, db) {
	if (!err) {
		console.log("\nNode.js connected to mongodb at " + host + ':' + port
				+ '/' + database + '\n');
		// TODO
		crud.insert(db);

		// TODO
	} else {
		console.log("Open db error:" + err.toString());
	}
});

var file = {
	save : function() {
		ImageFileProvider.prototype.insert = function(data, callback) {
			// process.nextTick(function(){
			var gridStore = new GridStore(db, new ObjectID(), 'w', {
				'content_type' : 'image/png',
				'chunk_size' : data.length
			});

			gridStore.open(function(err, gridStore) {
				gridStore.write(data, function() {
					gridStore.close(function(err, result) {
						if (err) {
							console.log(err);
						} else {
							console.log('insert ok.');
							callback(result);
						}
					});
				});
			});
			// });
		};
	},
	read : function() {
		ImageFileProvider.prototype.read = function(fileId, callback) {
			console.log('read …' + fileId);
			var gridStore = new GridStore(this.db, new ObjectID(fileId));
			console.log('gridStore …' + gridStore);
			gridStore.open(function(err, gridStore) {
				if (err) {
					console.log(err);
				} else {
					console.log('open …');
					gridStore.read(function(err, data) {
						if (err) {
							console.log(err);
						} else {
							console.log('read ok');
							callback(data);
						}
					});
				}
			});
		};
	}
};

var crud = {
	_ : function(db) {
		db.collection(coll, function(err, collection) {

		});
	},
	insert : function(db) {
		db.collection("image", function(err, coll) {
			if (!err) {
				var timestamp_s = util.getTimestamp();
				var count = 1;
				var len = count + 1;
				for ( var i = 1; i < len; i++) {
					var doc = {
						seq : i,
						dt : util.getDatetime()
					};
					coll.insert(doc);
				}
				var totaltime = util.getTimestamp() - timestamp_s;
				console.log('结束:' + util.getDatetimes());
				console.log('总共耗时:', totaltime, 'ms(', (totaltime / 1000),
						's)', '每条耗时:', (totaltime / count), 'ms;每秒处理:',
						(count / (totaltime / 1000)));
				console.log('总数据:', count);

				process.exit(0);
			} else {
				console.log("Insert collection image error:" + err.toString());
			}
		});
	}
};