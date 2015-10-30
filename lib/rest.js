'use strict';
var express = require('express');
var compose = require('./compose');
var middlewareCrud = require('./middlewares-crud');

class Rest {

    constructor(app) {

        this.app = app;
        this.registerCrud();

    }

    registerCrud(){
        var app = this.app;

        for (var collectionName in app.collections) {

            var prefix = '/' + collectionName;
            var collection = app.collections[collectionName];

            app.express.get(prefix + '/', compose([middlewareCrud.findAll({collection})]));
            app.express.get(prefix + '/:id', compose([middlewareCrud.findById({collection})]));
            app.express.post(prefix + '/', compose([middlewareCrud.create({collection})]));
            app.express.put(prefix + '/:id', compose([middlewareCrud.update({collection})]));
            app.express.delete(prefix + '/:id', compose([middlewareCrud.destroy({collection})]));
        }
    }

}

module.exports = Rest;