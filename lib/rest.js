'use strict';
var express = require('express');
var compose = require('./compose');
var middlewareCrud = require('./middlewares-crud');

class Rest {

    constructor(app) {

        this.app = app;

        for (var collectionName in app.collections) {
            var collection = app.collections[collectionName];

            this.registerCrud(collection);
        }

    }

    registerCrud(collection){

        var prefix = '/' + collection.name;

        this.app.express.get(prefix + '/', compose([middlewareCrud.findAll({collection})]));
        this.app.express.get(prefix + '/:id', compose([middlewareCrud.findById({collection})]));
        this.app.express.post(prefix + '/', compose([middlewareCrud.create({collection})]));
        this.app.express.put(prefix + '/:id', compose([middlewareCrud.update({collection})]));
        this.app.express.delete(prefix + '/:id', compose([middlewareCrud.destroy({collection})]));

    }

}

module.exports = Rest;