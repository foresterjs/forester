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
        this.routesDescription = {};

        var relationType = {
            belongsTo: "registerBelongsTo",
            hasMany: "registerHasMany",
            hasOne: "registerHasOne",
            hasAndBelongsToMany: "registerHasAndBelongsToMany"
        };

        for (var collectionName in app.collections) {
            var collection = app.collections[collectionName];

            this.registerCrud(collection);

            var relations = collection.schema.relations;
            for (var fieldName in relations) {

                var options = relations[fieldName];
                var relType = options.type;
                var registrationMethod = relationType[relType];
                if (!registrationMethod) {
                    throw new Error("relation type " + relType + " not valid");
                }

                this[registrationMethod](collection, fieldName, options);

            }
        }

    }

    registerEndpoint({collectionName, method, route, middlewares, description }) {

        var prefix = '/' + collectionName;

        this.app.express[method](prefix + route, compose(middlewares));

        this.routesDescription[collectionName] = this.routesDescription[collectionName] || [];

        this.routesDescription[collectionName].push({
            method: method,
            route: route,
            description: description
        });
    }

    registerCrud(collection) {

        this.registerEndpoint(
            {
                collectionName: collection.name,
                method: "get",
                route: "/",
                middlewares: [middlewaresCrud.findAll({collection})],
                description: "find your elements"
            }
        );

        this.registerEndpoint(
            {
                collectionName: collection.name,
                method: "get",
                route: "/:id",
                middlewares: [middlewaresCrud.findById({collection})],
                description: "find an elements"
            }
        );

        this.registerEndpoint(
            {
                collectionName: collection.name,
                method: "post",
                route: "/",
                middlewares: [middlewaresCrud.create({collection})],
                description: "find your elements"
            }
        );

        this.registerEndpoint(
            {
                collectionName: collection.name,
                method: "put",
                route: "/",
                middlewares: [middlewaresCrud.update({collection})],
                description: "update an elements"
            }
        );

        this.registerEndpoint(
            {
                collectionName: collection.name,
                method: "delete",
                route: "/:id",
                middlewares: [middlewaresCrud.destroy({collection})],
                description: "delete an elements"
            }
        );
    }

    registerBelongsTo(collection, fieldName, options) {

        var foreignCollection = this.app.collections[options.collection];
        var foreignKey = options.foreignKey;

        this.registerEndpoint(
            {
                collectionName: collection.name,
                method: "get",
                route: "/:id/" + fieldName,
                middlewares: [middlewaresBelongsTo.get({collection, foreignCollection, foreignKey})],
                description: "get " + fieldName
            }
        );

    }

    registerHasMany(collection, fieldName, options) {

        var foreignCollection = this.app.collections[options.collection];
        var foreignKey = options.foreignKey;

        this.registerEndpoint(
            {
                collectionName: collection.name,
                method: "get",
                route: "/:id/" + fieldName,
                middlewares: [middlewaresHasMany.findAll({collection, foreignCollection, foreignKey})],
                description: "get " + fieldName
            }
        );

        this.registerEndpoint(
            {
                collectionName: collection.name,
                method: "get",
                route: '/:id/' + fieldName + '/:fk',
                middlewares: [middlewaresHasMany.findById({collection, foreignCollection, foreignKey})],
                description: "get " + fieldName
            }
        );

        this.registerEndpoint(
            {
                collectionName: collection.name,
                method: "post",
                route: '/:id/' + fieldName,
                middlewares: [middlewaresHasMany.create({collection, foreignCollection, foreignKey})],
                description: "create " + fieldName
            }
        );

        this.registerEndpoint(
            {
                collectionName: collection.name,
                method: "put",
                route: '/:id/' + fieldName + '/:fk',
                middlewares: [middlewaresHasMany.update({collection, foreignCollection, foreignKey})],
                description: "create " + fieldName
            }
        );

        this.registerEndpoint(
            {
                collectionName: collection.name,
                method: "delete",
                route: '/:id/' + fieldName + '/:fk',
                middlewares: [middlewaresHasMany.destroy({collection, foreignCollection, foreignKey})],
                description: "destroy " + fieldName
            }
        );
    }

    registerHasOne(collection, fieldName, options) {

        var foreignCollection = this.app.collections[options.collection];
        var foreignKey = options.foreignKey;

        this.registerEndpoint(
            {
                collectionName: collection.name,
                method: "get",
                route: '/:id/' + fieldName,
                middlewares: [middlewaresHasOne.pick({collection, foreignCollection, foreignKey})],
                description: "find " + fieldName
            }
        );

    }

    registerHasAndBelongsToMany(collection, fieldName, options) {

        var foreignCollection = this.app.collections[options.collection];
        var foreignKey = options.foreignKey;
        var key = options.key;
        var throughCollection = this.app.collections[options.through];

        this.registerEndpoint(
            {
                collectionName: collection.name,
                method: "get",
                route: '/:id/' + fieldName,
                middlewares: [middlewaresHasAndBelongsToMany.find({
                    collection,
                    foreignCollection,
                    throughCollection,
                    key,
                    foreignKey
                })],
                description: "find " + fieldName
            }
        );

        this.registerEndpoint(
            {
                collectionName: collection.name,
                method: "post",
                route: '/:id/' + fieldName + '/:fk',
                middlewares: [middlewaresHasAndBelongsToMany.addAssociation({
                    collection,
                    foreignCollection,
                    throughCollection,
                    key,
                    foreignKey
                })],
                description: "add association with " + fieldName
            }
        );

        this.registerEndpoint(
            {
                collectionName: collection.name,
                method: "delete",
                route: '/:id/' + fieldName + '/:fk',
                middlewares: [middlewaresHasAndBelongsToMany.destroyAssociation({
                    collection,
                    foreignCollection,
                    throughCollection,
                    key,
                    foreignKey
                })],
                description: "remove association with " + fieldName
            }
        );
    }

}

module.exports = Rest;