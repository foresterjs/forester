"use strict";

var Forester = require('./lib/forester.js');
var app = new Forester();
var fs = require('fs');


var dataSource = {
    "name":"dbrome",
    "adapter": "mongo",
    "options": {
        "connectionUri": "mongodb://forester_db_1:27017"
    }
};



app.registerCollection(require('./test/data/collections/users.json'));
app.registerCollection(require('./test/data/collections/articles.json'));
app.registerDataSource(dataSource);
app.registerMappings(require('./test/data/mappings/mapping.json'));


app.boot();

app.listen(3000);

