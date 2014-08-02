var express = require('express');
var server = require('./server/server.js');

var app = express([]);

app.use(express.static(__dirname + '/client'));

app.use('/api', server());

app.listen(8080);