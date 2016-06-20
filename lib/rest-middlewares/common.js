"use strict";

export function showSchema({collection}) {
  return async function ({request, response, params}, next) {

    response.body = response.body || {};

    var schema = collection.schema;

    response.body.schema = {
      name: schema.name,
      description: schema.description,
      properties: schema.properties,
      relations: schema.relations
    };

    await next();
  }
}

export function showCount({collection}) {
  return async function ({request, response, params}, next) {

    response.body = response.body || {};

    response.body.collectionCount = await collection.count();

    await next();
  }
}

export function showPagesCount({collection}) {
  return async function ({request, response, params}, next) {

    var query = request.query || {};

    response.body = response.body || {};

    var count;
    if(query.hasOwnProperty("where")){
      count = await collection.count(query.where);
    }else{
      count = response.body.collectionCount;
    }

    var perPage = request.query.perPage || collection.defaults.perPage;

    response.body.pages = Math.ceil(count / perPage);
    response.body.count = count;

    await next();
  }
}

export function showUser({collection}) {
  return async function ({request, response, user}, next) {

    response.body = response.body || {};

    response.body.user = user;

    await next();
  }
}
