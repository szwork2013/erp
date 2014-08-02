var express = require('express');
var server = require('./server/server.js');

var settings = require('./settings.json');

var app = express([]);

app.use(express.static(__dirname + '/client'));
app.use('/api', server());

app.listen(settings.port);