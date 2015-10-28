"use strict";

//example config
var usersCollection = {
    "name":"users"
};

var articlesCollection = {
    "name":"articles"
};


var dataSource = {
    "name":"dbrome",
    "adapter": "mongo",
    "options": {
        "connectionUri": "mongodb://forester_db_1:27017"
    }
};

var mappings = [
    {
        "collection": "users",
        "datasource": "dbrome"
    },
    {
        "collection": "articles",
        "datasource": "dbrome"
    }
];
//end example config




var Forester = require('./lib/forester.js');
var app = new Forester();

//example registration
app.registerCollection(usersCollection);
app.registerCollection(articlesCollection);
app.registerDataSource(dataSource);
app.registerMapping(mappings[0]);
app.registerMapping(mappings[1]);
//end registration


app.boot();

app.listen(3000);

