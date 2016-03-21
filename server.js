var http = require('http');
var fs = require('fs');
var path = require('path');
var util = require('util');

//need these lines to work with openshift
var ipaddr = process.env.OPENSHIFT_NODEJS_IP || "127.0.0.1";
var port = process.env.OPENSHIFT_NODEJS_PORT || 3000;


function send404(response) {
    response.writeHead(404, { 'Content-Type': 'text/plain' });
    response.write('Error 404: Resource not found.');
    response.end();
}

var mimeLookup = {
    '.js': 'application/javascript',
    '.html': 'text/html'
};

var server = http.createServer(function (req, res) {

    if (req.method == 'GET') {

        // resolve file path to filesystem path
        var fileurl;
        if (req.url == '/') fileurl = '/index.html';
        else fileurl = req.url;
        var filepath = path.resolve('./public' + fileurl);

        // lookup mime type
        var fileExt = path.extname(filepath);
        var mimeType = mimeLookup[fileExt];
        if (!mimeType) {
	        send404(res);
            return;
        }

        // see if we have that file
        fs.exists(filepath, function (exists) {

            // if not
            if (!exists) {
				send404(res);
                return;
            };

            // finally stream the file
            res.writeHead(200, { 'content-type': mimeType });
            fs.createReadStream(filepath).pipe(res);
        });
    }
    else {
		send404(res);
    }

//modify these lines to work with openshift ports
}).listen(port, ipaddr);
util.log('Server running on port ', port, ' and IP ', ipaddr);
