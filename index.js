var through = require('through2'),
	fs 		= require('fs'),
	path 	= require('path');

module.exports = function () {

	var stream = through.obj(function (file,enc,cb) {

		var reg 	= /\/\*.+?\*\/|\/\/.+(?:\r|\n)|__import\((['"])(.*?)\1\)/g,
			html 	= file.contents.toString();

		html = html.replace(reg, function (match,sub1,sub2,index) {
			if (!sub2) return match;

			var tplPath = path.resolve(file.path,sub2),
				content;

			if (!fs.existsSync(tplPath)) return match;

			content = fs.readFileSync(tplPath);
			return '\'' + content.toString().replace(/\r|\n|\t/g,'').replace(/'/g,'\\\'') + '\'';

		})

		file.contents = new Buffer(html);

		cb(null,file);

	})

	return stream;

}