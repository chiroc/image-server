var http = require('http');
var url = require('url');
var path = require('path');
var fs = require('fs');
// var util = require('util');// sys = require('sys'),//as the same interface
var qs = require('querystring');

var util = require('./util.js').util;
var fs = require('fs');

// mongodb ////////////////////////////////////////
var mongo = require('mongodb');
var Server = mongo.Server;
var Db = mongo.Db;

var database = 'foo';
var host = '192.168.15.37';
var port = 27017;

var db = new Db(database, new Server(host, port, {
	safe : true,
	strict : false,
	auto_reconnect : true,
	poolSize : 15
}));

var cnn = null;
db.open(function(err, db) {
	if (!err) {
		console.log("\nNode.js connected to mongodb at " + host + ':' + port
				+ '/' + database + '\n');
		cnn = db;
	} else {
		console.log("Open db error:" + err.toString());
	}
});
// mongodb///////////////////////////////////////

/**
 * HTTP 服务器
 */
var httpServer = http
		.createServer(function(req, res) {
			var uri = url.parse(req.url).pathname;

			var filePath = "im" + uri;
			if (filePath.substring(filePath.length - 1) === '/') {
				filePath += 'index.html';
			}
			console.log('uri:' + uri);

			var ext = MimeUtil.fileExt(filePath);
			var contentType = MimeUtil.contentType(ext);

			// 参数过虑
			var params = {};
			if (req.method == 'GET') {
				var url_parts = url.parse(req.url, true);
				params = url_parts.query;
				if (params.name && params.name == 'top10') {
					fs
							.readFile(
									'./im/top10.png',
									function(err, data) {
										if (err)
											throw err;
										if (params.dl == 1) {
											res
													.writeHead(
															200,
															{
																'Content-disposition' : 'attachment; filename=top10-x.png',
																'Content-Length' : data.length,
																'Content-Type' : MimeUtil
																		.contentType('png')
															});
										} else {
											res.writeHead(200, MimeUtil
													.contentType('png'));
										}
										res.write(data, "binary");
										res.end();
									});

				} else if (params.mongodb) {
					if (params.mongodb == 'i') {
						fs.readFile('./im/font.zip', function(err, data) {
							if (err)
								throw err;
							file.saveFile(data);
							res.writeHead(200, MimeUtil.fileExt('txt'));
							res.write("file saved.");
							res.end();
						});
					} else if (params.mongodb == 'r') {
						file.readFile(res);
					}
				} else {
					fs.exists(filePath, function(ex) {
						if (!ex) {
							res.writeHead(404, MimeUtil.fileExt('txt'));
							res.write("404 - File not found: " + uri);
							res.end();
							return;
						}
						fs.readFile(filePath, "binary", function(error,
								fileContent) {
							if (error) {
								res.writeHead(500, MimeUtil.contentType(ext));
								res.write("500 - Could not read " + filePath
										+ " from file system!");
							} else {
								res.writeHead(200, contentType);
								res.write(fileContent, "binary");
							}
							res.end();
						});
					});
				}
			}

		});

var port = process.argv[2] ? process.argv[2] : 80;
httpServer.listen(port);
console.log('iTsai-WebIM Server running at port:', port, '\n');

var file = {
	saveFile : function(data) {
		cnn.collection("image", function(err, coll) {
			if (!err) {
				var count = 10000;
				var len = count + 1;
				for ( var i = 1; i < len; i++) {
					var doc = {
						seq : i,
						dt : util.getDatetime(),
						image : data
					};
					coll.insert(doc);
				}
			} else {
				console.log("Insert collection image error:" + err.toString());
			}
		});
	},
	readFile : function(res) {
		cnn.collection("image", function(err, coll) {
			if (!err) {
				coll.findOne({
					seq : 1
				}, function(err, item) {
					console.log('seq:', item.seq, '\t dt:', item.dt);
					res.writeHead(200, MimeUtil.contentType('png'));
					res.write(item.image.buffer, "binary");
					res.end();
				});
			} else {
				console.log("Read collection image error:" + err.toString());
			}
		});
	}
};

var MimeUtil = {
	/**
	 * 根据文件路径获取文件扩展名称
	 * 
	 * @param {文件路径，如："doc/server.js"}
	 *            path
	 * @return {文件扩展名称（不包含：'.'）}
	 */
	fileExt : function(path) {
		var ext = '';
		if (!path)
			return ext;
		ext = path.match(/\.[a-zA-Z]+$/);
		return ext ? ext[0].toLowerCase().replace('.', '') : '';
	},
	/**
	 * Content-Type
	 */
	fileType : {
		html : 'text/html',
		txt : 'text/plain',
		json : 'text/json',
		js : 'text/javascript',
		css : 'text/css',
		xml : 'text/xml',
		pdf : 'application/pdf',
		png : 'image/png',
		jpg : 'image/jpg',
		jpeg : 'image/jpeg',
		gif : 'image/gif',
		mp4 : 'video/mp4'
	},
	/**
	 * 根据文件扩展名生成相应的Content-Type.(根据需要将不断增加...)
	 * 
	 * @param fileExt
	 *            文件扩展名（不包含'.'）
	 */
	contentType : function(fileExt) {
		var ft = this.fileType[fileExt];
		return {
			'Content-Type' : !ft ? 'text/plain' : ft
		};
	}
};