var http = require('http');
var fs = require('fs');

var PORT = 7000;

function handleRequest (req, res) {
	fs.readFile("index.html", function(err, data){

		if(err){
			res.writeHead(404,{"Content-Type": "text/html"});
			res.end('error');
		}

		res.writeHead(200,{"Content-Type": "text/html"});
		res.end(data);
	});
}

var server = http.createServer(handleRequest);

server.listen(PORT, function(){
	console.log("hello");
})