'use strict';
var express = require('express');
var compose = require('./compose');
var middlewaresCrud = require('./middlewares/crud');
var middlewaresBelongsTo = require('./middlewares/belongs-to');
var middlewaresHasMany = require('./middlewares/has-many');
var middlewaresHasOne = require('./middlewares/has-one');
var middlewaresHasAndBelongsToMany = require('./middlewares/has-and-belongs-to-many');
var middlewaresHasManyThrough = require('./middlewares/has-many-through');

class Rest {

  constructor(app) {

    this.app = app;
    this.routesDescription = {};

    this.registrationsMethod = {
      crud: middlewaresCrud._register,
      relations: {
        belongsTo: middlewaresBelongsTo._register,
        hasMany: middlewaresHasMany._register,
        hasOne: middlewaresHasOne._register,
        hasAndBelongsToMany: middlewaresHasAndBelongsToMany._register,
        hasManyThrough: middlewaresHasManyThrough._register
      }
    };

    for (var collectionName in app.collections) {
      var collection = app.collections[collectionName];

      this.registerCrud(collection);

      this.registerRelations(collection);

    }

  }

  registerEndpoint({collectionName, method, route, middlewares, description }) {

    var prefix = '/api/' + collectionName;

    this.app.express[method](prefix + route, compose(middlewares));

    this.routesDescription[collectionName] = this.routesDescription[collectionName] || [];

    this.routesDescription[collectionName].push({
      method: method,
      url: prefix + route,
      description: description
    });
  }

  registerCrud(collection) {
    this.registrationsMethod.crud(this, {collection});
  }

  registerRelations(collection) {
    var relations = collection.schema.relations;
    for (var fieldName in relations) {

      var options = relations[fieldName];
      var relType = options.type;

      var regMethod = this.registrationsMethod.relations[relType];

      if (!regMethod) {
        throw new Error("relation type " + relType + " not valid");
      }

      regMethod(this,
        {
          collections: this.app.collections,
          collection: collection,
          fieldName: fieldName,
          options: options
        });

    }
  }


}

module.exports = Rest;
