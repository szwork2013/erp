var mongoose = require('mongoose');
var settings = require('../settings.json');

mongoose.connect(settings.mongodb.connectionstring);