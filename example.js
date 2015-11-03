"use strict";

var Forester = require('./lib/forester.js');
var app = new Forester();

app.registerCollection(require('./test/fixture/join-articles-users.json'));
app.registerCollection(require('./test/fixture/users.json'));
app.registerCollection(require('./test/fixture/articles.json'));
app.registerDataSource(require('./test/fixture/db1.json'));
app.registerMappings(require('./test/fixture/mappings.json'));

app.boot();

app.listen({port:3000});

