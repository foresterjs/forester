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
    this.routesDescription = {};
    this.router = router();
    this.app.koa.use(this.router.routes());

    this.registerCollections(app.collections);
  }

  registerEndpoint({ collectionName, method, route, middlewares, description }) {
    var prefix = '/api/' + collectionName;

    //TODO support middlewares
    this.router[method](prefix + route, middlewares[0]);

    this.routesDescription[collectionName] = this.routesDescription[collectionName] || [];

    this.routesDescription[collectionName].push({
      method: method,
      url: prefix + route,
      description: description
    });
  }

  registerCollections(collections) {
    for (var collectionName in collections) {
      var collection = collections[collectionName];

      this.registerCrud(collection);

      //this.registerRelations(collection);
    }
  }

  registerCrud(collection) {
    crudMiddlewares(this, {collection});
  }

  /*
  registerRelations(collection) {
    var relations = collection.schema.relations;
    for (var relationName in relations) {

      var relation = relations[relationName];
      var relationType = relation.type;
      var middleware = Rest.relations[relationType];

      if (!middleware) {
        throw new Error("relation type " + relationType + " not valid");
      }

      relation.name = relationName;

      middleware(this, {
        collections: this.app.collections,
        collection: collection,
        relation: relation
      });

    }
  }
  */


}

module.exports = Rest;
