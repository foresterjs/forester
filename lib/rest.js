'use strict';

const router = require('koa-simple-router');
const compose = require('koa-compose');

var crudMiddlewares = require('./rest-middlewares/crud');

var relationsMiddlewares = {
  belongsTo: require('./rest-middlewares/belongs-to'),
  hasMany: require('./rest-middlewares/has-many'),
  hasOne: require('./rest-middlewares/has-one'),
  hasAndBelongsToMany: require('./rest-middlewares/has-and-belongs-to-many'),
  hasManyThrough: require('./rest-middlewares/has-many-through')
};

class Rest {

  constructor(app) {

    this.app = app;
    this.routes = {};

  }

  boot(){
    this.registerCollections(this.app.collections);
  }

  registerEndpoint({ collectionName, method, route, middlewares, description, action, relation }) {

    var prefix = '/api/' + collectionName;

    this.app.koa.use(router({prefix}, _ => {
      _[method](route, compose(middlewares));
    }));

    this.routes[collectionName] = this.routes[collectionName] || [];

    this.routes[collectionName].push({
      method: method,
      url: prefix + route,
      description: description,
      action: action,
      relation: relation
    });
  }

  registerCollections(collections) {
    for (var collectionName in collections) {
      var collection = collections[collectionName];

      this.registerCrud(collection);

      this.registerRelations(collection);
    }
  }

  registerCrud(collection) {
    crudMiddlewares(this, {collection});
  }


  registerRelations(collection) {
    var relations = collection.schema.relations;
    for (var relationName in relations) {

      var relation = relations[relationName];
      relation.name = relationName;

      var middleware = relationsMiddlewares[relation.type];

      if (!middleware) {
        throw new Error("relation type " + relationType + " not valid");
      }

      middleware(this, {
        collections: this.app.collections,
        collection: collection,
        relation: relation
      });

    }
  }



}

module.exports = Rest;
