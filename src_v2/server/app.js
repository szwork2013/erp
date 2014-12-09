var express = require('express');
var bodyParser = require('body-parser');

var app = express([]);

var mongoose = require('mongoose');
var settings = require('./settings.json');
mongoose.connect(settings.mongodb.connectionstring);

app.use(function (req, res, next) {
    res.set('Content-Type', 'application/json');
    next();
});

app.use(bodyParser.json());
var contactsRouter = express.Router();
require('./ContactsApi.js')(contactsRouter);
app.use('/contacts', contactsRouter);

var accountingRouter = express.Router();
require('./AccountingApi.js')(accountingRouter);
app.use('/accounting', accountingRouter);

app.listen(process.env.PORT || 23456);