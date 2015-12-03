"use strict";

const ValidationFail = require('../validation-fail');

module.exports = function (rest, {collections, collection, relation}) {

  var foreignCollection = collections[relation.collection];
  var foreignKey = relation.foreignKey;

  rest.registerEndpoint(
    {
      action: "find",
      relation: relation.name,
      collectionName: collection.name,
      method: "get",
      route: "/:id/" + relation.name,
      middlewares: [
        collection.defender.acl("find", relation.name),
        find({collection, foreignCollection, foreignKey})
      ],
      description: "get " + relation.name
    }
  );

  rest.registerEndpoint(
    {
      action: "pick",
      relation: relation.name,
      collectionName: collection.name,
      method: "get",
      route: '/:id/' + relation.name + '/:fk',
      middlewares: [
        collection.defender.acl("pick", relation.name),
        pick({collection, foreignCollection, foreignKey})
      ],
      description: "get " + relation.name
    }
  );

  rest.registerEndpoint(
    {
      action: "create",
      relation: relation.name,
      collectionName: collection.name,
      method: "post",
      route: '/:id/' + relation.name,
      middlewares: [
        collection.defender.acl("create", relation.name),
        create({collection, foreignCollection, foreignKey})
      ],
      description: "create " + relation.name
    }
  );

  rest.registerEndpoint(
    {
      action: "update",
      relation: relation.name,
      collectionName: collection.name,
      method: "put",
      route: '/:id/' + relation.name + '/:fk',
      middlewares: [
        collection.defender.acl("update", relation.name),
        update({collection, foreignCollection, foreignKey})
      ],
      description: "create " + relation.name
    }
  );

  rest.registerEndpoint(
    {
      action: "destroy",
      relation: relation.name,
      collectionName: collection.name,
      method: "delete",
      route: '/:id/' + relation.name + '/:fk',
      middlewares: [
        collection.defender.acl("destroy", relation.name),
        destroy({collection, foreignCollection, foreignKey})
      ],
      description: "destroy " + relation.name
    }
  );
}


export function find({collection, foreignCollection, foreignKey}) {
  return async function ({request, response, params}, next) {

    var id = params.id;
    var options = request.query;
    response.body = response.body || {};

    options.where = options.where || {};
    options.where[foreignKey] = id;

    var items = await foreignCollection.findAll(options);

    response.body.data = items;
    response.body.done = true;


    await next();
  }
}


export function pick({collection, foreignCollection, foreignKey}) {
  return async function ({request, response, params}, next) {
    var id = params.id;
    var fk = params.fk;
    response.body = response.body || {};

    var item = await foreignCollection.pick(fk);


    if (item && item[foreignKey] === id) {
      response.body.data = item;
      response.body.done = true;
    } else {
      response.body.done = false;
      response.body.errors = ['not_found'];
    }

    await next();
  }
}

export function create({collection, foreignCollection, foreignKey}) {
  return async function ({request, response, params}, next) {

    var id = params.id;
    var data = request.body;
    response.body = response.body || {};

    data[foreignKey] = id;

    try {
      var item = await foreignCollection.create(data);

      if (item) {
        response.body.data = item;
        response.body.done = true;
      } else {
        response.body.done = false;
        response.body.errors = ['not_saved'];
      }

      await next();

    } catch (err) {
      if (err instanceof ValidationFail) {

        response.body.errors = err.errors;
        response.body.done = false;
        await next();
        return;
      }

      throw err;
    }
  }
}

export function update({collection, foreignCollection, foreignKey}) {
  return async function ({request, response, params}, next) {

    var id = params.id;
    var fk = params.fk;
    var data = request.body;
    response.body = response.body || {};

    data[foreignKey] = id;

    //check
    var item = await foreignCollection.pick(fk);
    if (!item[foreignKey] === id) {
      request.body.done = false;
      request.body.errors = ['not_found', 'not_saved'];
      await next();
      return;
    }

    //update
    try {
      var item = await foreignCollection.update(fk, data);
      if (item) {
        response.body.data = item;
        response.body.done = true;
      } else {
        response.body.done = false;
        response.body.errors = ['not_saved'];
      }
      await next();

    } catch (err) {
      if (err instanceof ValidationFail) {

        response.body.errors = err.errors;
        response.body.done = false;
        await next();
        return;
      }

      throw err;
    }
  }
}

export function destroy({collection, foreignCollection, foreignKey}) {
  return async function ({request, response, params}, next) {
    var id = params.id;
    var fk = params.fk;
    response.body = response.body || {};

    //check
    var item = await foreignCollection.pick(fk);
    if (!(item && item[foreignKey] === id)) {
      response.body.done = false;
      response.body.errors = ['not_found'];
      await next();
      return;
    }

    //delete
    var result = await foreignCollection.destroy(fk);
    response.body.done = result;
    await next();
  }
}
