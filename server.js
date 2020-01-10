const express = require('express'),
    bodyParser = require('body-parser'),
    http = require('http');

const application = express();

//application.use('/', express.static(__dirname + '/dist'));
application.use(bodyParser.json());
application.use(express.json()); // for parsing application/json
application.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded
application.use((request, response, next) => {
    response.header('Access-Control-Allow-Origin', '*'); // update to match the domain you will make the request from
    response.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});

application.get('/', serveIndex);
require('./server/game')(application);

http.createServer(application).listen(3060, () => console.log('HTTP server listening in port 3060'));

function serveIndex (request, response) {
    response.sendFile(__dirname + '/dist/index.html');
}