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

var mappings = require('./test/data/mappings/mapping.json');
//end example config



//example registration
app.registerCollection(require('./test/data/collections/users.json'));
app.registerCollection(require('./test/data/collections/articles.json'));
app.registerDataSource(dataSource);
app.registerMapping(mappings[0]);
app.registerMapping(mappings[1]);

//end registration


app.boot();

app.listen(3000);

