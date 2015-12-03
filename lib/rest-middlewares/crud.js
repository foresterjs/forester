"use strict";

var commonMiddlewares = require('./common');
const ValidationFail = require('../validation-fail');

module.exports = function (rest, {collection}) {

  rest.registerEndpoint(
    {
      action: "find",
      collectionName: collection.name,
      method: "get",
      route: "/",
      middlewares: [
        collection.defender.acl("find"),
        commonMiddlewares.showSchema({collection}),
        commonMiddlewares.showCount({collection}),
        commonMiddlewares.showPagesCount({collection}),
        commonMiddlewares.showUser({collection}),
        findAll({collection})],
      description: "find your elements"
    }
  );

  rest.registerEndpoint(
    {
      action: "pick",
      collectionName: collection.name,
      method: "get",
      route: "/:id",
      middlewares: [
        collection.defender.acl("pick"),
        commonMiddlewares.showSchema({collection}),
        pick({collection})
      ],
      description: "find elements"
    }
  );

  rest.registerEndpoint(
    {
      action: "create",
      collectionName: collection.name,
      method: "post",
      route: "/",
      middlewares: [
        collection.defender.acl("create"),
        create({collection})
      ],
      description: "create an element"
    }
  );

  rest.registerEndpoint(
    {
      action: "update",
      collectionName: collection.name,
      method: "put",
      route: "/:id",
      middlewares: [
        collection.defender.acl("update"),
        update({collection})
      ],
      description: "update an element"
    }
  );

  rest.registerEndpoint(
    {
      action: "destroy",
      collectionName: collection.name,
      method: "delete",
      route: "/:id",
      middlewares: [
        collection.defender.acl("destroy"),
        destroy({collection})
      ],
      description: "delete an element"
    }
  );

};


export function findAll({collection}) {
  return async function ({request, response}, next) {
    var options = request.query;
    response.body = response.body || {};

    var items = await collection.findAll(options);

    response.body.data = items;
    response.body.done = true;

    await next();
  }
}

export function pick({collection}) {
  return async function ({request, response, params}, next) {
    var id = params.id;
    response.body = response.body || {};

    var item = await collection.pick(id);


    if (item) {
      response.body.data = item;
      response.body.done = true;
    } else {
      response.body.done = false;
      response.body.errors = ['not_found'];
    }

    await next();
  }
}

export function create({collection}) {
  return async function ({request, response}, next) {

    var data = request.body;

    response.body = response.body || {};

    try{
      var item = await collection.create(data);
      response.body.data = item;
      response.body.done = true;
      await next();

    }catch (err){
      if(err instanceof ValidationFail){

        response.body.errors = err.errors;
        response.body.done = false;
        await next();
        return;
      }

      throw err;
    }

  }
}

export function update({collection}) {
  return async function ({request, response, params}, next) {

    var id = params.id;
    var data = request.body;
    response.body = response.body || {};

    try{
      var item = await collection.update(id, data);

      if (item) {
        response.body.data = item;
        response.body.done = true;
      } else {
        response.body.done = false;
        response.body.errors = ['not_found'];
      }

      await next();

    }catch (err){

      if(err instanceof ValidationFail){

        response.body.errors = err.errors;
        response.body.done = false;
        await next();
        return;
      }

      throw err;
    }
  }
}

export function destroy({collection}) {
  return async function ({request, response, params}, next) {

    var id = params.id;
    response.body = response.body || {};

    var result = await collection.destroy(id);

    response.body.done = result;

    if (!result) response.body.errors = ['not_found'];

    await next();
  }
}
