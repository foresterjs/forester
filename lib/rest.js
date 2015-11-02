'use strict';
var express = require('express');
var compose = require('./compose');
var middlewaresCrud = require('./middlewares/crud');
var middlewaresBelongsTo = require('./middlewares/belongs-to');
var middlewaresHasMany = require('./middlewares/has-many');
var middlewaresHasOne = require('./middlewares/has-one');
var middlewaresHasAndBelongsToMany = require('./middlewares/has-and-belongs-to-many');

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

        this.app.express.get(prefix + '/', compose([middlewaresCrud.findAll({collection})]));
        this.app.express.get(prefix + '/:id', compose([middlewaresCrud.findById({collection})]));
        this.app.express.post(prefix + '/', compose([middlewaresCrud.create({collection})]));
        this.app.express.put(prefix + '/:id', compose([middlewaresCrud.update({collection})]));
        this.app.express.delete(prefix + '/:id', compose([middlewaresCrud.destroy({collection})]));

    }

    registerRelations(collection) {

        var relations = collection.schema.relations;

        var relationType = {
            belongsTo: "registerBelongsTo",
            hasMany: "registerHasMany",
            hasOne: "registerHasOne",
            hasAndBelongsToMany: "registerHasAndBelongsToMany"
        };

        for (var fieldName in relations) {

            var options = relations[fieldName];
            var relType = options.type;
            var registrationMethod = relationType[relType];
            if(!registrationMethod){
                throw new Error("relation type "+ relType + " not valid");
            }

            this[registrationMethod](collection, fieldName, options);

        }

    }

    registerBelongsTo(collection, fieldName, options) {

        var prefix = '/' + collection.name;

        var foreignCollection = this.app.collections[options.collection];
        var foreignKey = options.foreignKey;

        this.app.express.get(
            prefix + '/:id/' + fieldName,
            compose([middlewaresBelongsTo.get({collection, foreignCollection, foreignKey})])
        );
    }

    registerHasMany(collection, fieldName, options) {

        var prefix = '/' + collection.name;

        var foreignCollection = this.app.collections[options.collection];
        var foreignKey = options.foreignKey;

        this.app.express.get(
            prefix + '/:id/' + fieldName,
            compose([middlewaresHasMany.findAll({collection, foreignCollection, foreignKey})])
        );

        this.app.express.get(
            prefix + '/:id/' + fieldName + '/:fk',
            compose([middlewaresHasMany.findById({collection, foreignCollection, foreignKey})])
        );

        this.app.express.post(
            prefix + '/:id/' + fieldName,
            compose([middlewaresHasMany.create({collection, foreignCollection, foreignKey})])
        );

        this.app.express.put(
            prefix + '/:id/' + fieldName + '/:fk',
            compose([middlewaresHasMany.update({collection, foreignCollection, foreignKey})])
        );

        this.app.express.delete(
            prefix + '/:id/' + fieldName + '/:fk',
            compose([middlewaresHasMany.destroy({collection, foreignCollection, foreignKey})])
        );
    }

    registerHasOne(collection, fieldName, options) {

        var prefix = '/' + collection.name;

        var foreignCollection = this.app.collections[options.collection];
        var foreignKey = options.foreignKey;

        this.app.express.get(
            prefix + '/:id/' + fieldName,
            compose([middlewaresHasOne.pick({collection, foreignCollection, foreignKey})])
        );
    }

    registerHasAndBelongsToMany(collection, fieldName, options) {

        var prefix = '/' + collection.name;

        var foreignCollection = this.app.collections[options.collection];
        var foreignKey = options.foreignKey;
        var key = options.key;
        var throughCollection = this.app.collections[options.through];

        this.app.express.get(
            prefix + '/:id/' + fieldName,
            compose([middlewaresHasAndBelongsToMany.find({collection, foreignCollection, throughCollection, key, foreignKey})])
        );
    }

}

module.exports = Rest;