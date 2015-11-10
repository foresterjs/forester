"use strict";

import wrap from '../../lib/koa-ctx';
var router = require('koa-router');

module.exports = function (forester) {

  forester.registerStaticRoute({route: '/explorer', path: __dirname + '/public'});

  var routes = router();
  routes.get('/schema', wrap(schema({collections: forester.collections, rest: forester.rest})));
  forester.koa.use(routes.routes());
};


export function schema({collections, rest}) {
  return async function ({request, response}, next) {
    var endpointsDescription = [];

    for (var collectionName in collections) {
      var collectionSchema = collections[collectionName].schema;
      endpointsDescription.push({
        name: collectionName,
        properties: collectionSchema.properties,
        relations: collectionSchema.relations,
        endpoints: rest.routesDescription[collectionName] || []
      });
    }

    response.body = endpointsDescription;

    await next;
  }
}
