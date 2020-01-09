const express = require('express'),
    bodyParser = require('body-parser'),
    http = require('http');

const application = express(),
    server;

application.use('/', express.static(__dirname + '/dist'));
application.use(bodyParser.json());
require('./server/game')(application);
application.all('/*', serveIndex);

http.createServer(application).listen(3060, () => console.log('HTTP server listening in port 3060'));

function serveIndex (request, response) {
    response.sendFile(__dirname + '/dist/index.html');
}