'use strict';
var express = require('express');
var compose = require('./compose');
var middlewareCrud = require('./middlewares-crud');
var middlewareRelBelongsTo = require('./middlewares-rel-belongs-to');

class Rest {

    constructor(app) {

        this.app = app;

        for (var collectionName in app.collections) {
            var collection = app.collections[collectionName];

            this.registerCrud(collection);
            this.registerRelations(collection);
        }

    }

    registerCrud(collection) {

        var prefix = '/' + collection.name;

        this.app.express.get(prefix + '/', compose([middlewareCrud.findAll({collection})]));
        this.app.express.get(prefix + '/:id', compose([middlewareCrud.findById({collection})]));
        this.app.express.post(prefix + '/', compose([middlewareCrud.create({collection})]));
        this.app.express.put(prefix + '/:id', compose([middlewareCrud.update({collection})]));
        this.app.express.delete(prefix + '/:id', compose([middlewareCrud.destroy({collection})]));

    }

    registerRelations(collection) {

        var prefix = '/' + collection.name;

        var relations = collection.schema.relations;

        for (var fieldName in relations) {

            var options = relations[fieldName];

            switch (options.type) {
                case "BelongsTo":

                    this.registerBelongsTo(collection, fieldName, options);

                    break;

                default:
                //TODO should throw exception?
            }
        }

    }

    registerBelongsTo(collection, fieldName, options) {

        var prefix = '/' + collection.name;

        var foreignCollection = this.app.collections[options.collection];
        var foreignKey = options.foreignKey;

        this.app.express.get(
            prefix + '/:id/' + fieldName,
            compose([middlewareRelBelongsTo.get({collection, foreignCollection, foreignKey})])
        );
    }

}

module.exports = Rest;