"use strict";

var koa = require('koa');
var Forester = require('./lib/forester.js');


var app = koa();
var forester = new Forester();
app.experimental = true;




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


//example registration
forester.registerCollection(usersCollection);
forester.registerCollection(articlesCollection);
forester.registerDataSource(dataSource);
forester.registerMapping(mappings[0]);
forester.registerMapping(mappings[1]);
//end registration


forester.boot(app);


app.listen(3000);