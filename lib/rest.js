'use strict';

var router = require('koa-router');

var crudMiddlewares = require('./middlewares/crud');

var relationsMiddlewares = {
  belongsTo: require('./middlewares/belongs-to'),
  hasMany: require('./middlewares/has-many'),
  hasOne: require('./middlewares/has-one'),
  hasAndBelongsToMany: require('./middlewares/has-and-belongs-to-many'),
  hasManyThrough: require('./middlewares/has-many-through')
};

class Rest {

  constructor(app) {

    this.app = app;
    this.routes = {};
    this.router = router();
    this.app.koa.use(this.router.routes());
  }

  boot(){
    this.registerCollections(this.app.collections);
  }

  registerEndpoint({ collectionName, method, route, middlewares, description }) {
    var prefix = '/api/' + collectionName;

    this.router[method](prefix + route, ...middlewares);

    this.routes[collectionName] = this.routes[collectionName] || [];

    this.routes[collectionName].push({
      method: method,
      url: prefix + route,
      description: description
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
