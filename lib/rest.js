'use strict';
var express = require('express');
var compose = require('./compose');
var middlewareCrud = require('./middlewares-crud');
var middlewareRelBelongsTo = require('./middlewares-rel-belongs-to');
var middlewareRelHasMany = require('./middlewares-rel-has-many');

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

                case "HasMany":

                    this.registerHasMany(collection, fieldName, options);

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

    registerHasMany(collection, fieldName, options) {

        var prefix = '/' + collection.name;

        var foreignCollection = this.app.collections[options.collection];
        var foreignKey = options.foreignKey;

        this.app.express.get(
            prefix + '/:id/' + fieldName,
            compose([middlewareRelHasMany.findAll({collection, foreignCollection, foreignKey})])
        );

        this.app.express.get(
            prefix + '/:id/' + fieldName + '/:fk',
            compose([middlewareRelHasMany.findById({collection, foreignCollection, foreignKey})])
        );

        this.app.express.post(
            prefix + '/:id/' + fieldName,
            compose([middlewareRelHasMany.create({collection, foreignCollection, foreignKey})])
        );

        this.app.express.put(
            prefix + '/:id/' + fieldName + '/:fk',
            compose([middlewareRelHasMany.update({collection, foreignCollection, foreignKey})])
        );

        this.app.express.delete(
            prefix + '/:id/' + fieldName + '/:fk',
            compose([middlewareRelHasMany.destroy({collection, foreignCollection, foreignKey})])
        );
    }

}

module.exports = Rest;