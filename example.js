"use strict";

var Forester = require('./lib/forester.js');
var app = new Forester();
var fs = require('fs');


app.registerCollection(require('./test/data/collections/users.json'));
app.registerCollection(require('./test/data/collections/articles.json'));
app.registerDataSource(require('./test/data/data-source/dbrome.json'));
app.registerMappings(require('./test/data/mappings/mapping.json'));

app.boot();

app.listen(3000);

