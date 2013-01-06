var fs = require('fs');
fs.readFile('E:/Weekly.txt', function(err, data) {
	if (err)
		throw err;
	console.log(data);
});
