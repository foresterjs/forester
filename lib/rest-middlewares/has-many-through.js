const ValidationFail = require('../validation-fail');

module.exports = function (rest, {collections, collection, relation}) {

  var foreignCollection = collections[relation.collection];
  var foreignKey = relation.foreignKey;
  var key = relation.key;
  var throughCollection = collections[relation.through];

  rest.registerEndpoint(
    {
      action: "find",
      relation: relation.name,
      collectionName: collection.name,
      method: "get",
      route: '/:id/' + relation.name,
      middlewares: [
        collection.defender.acl("find", relation.name),
        find({
          collection,
          foreignCollection,
          throughCollection,
          key,
          foreignKey
        })],
      description: "find all " + relation.name + " about an " + collection.name
    }
  );

  rest.registerEndpoint(
    {
      action: "findOn",
      relation: relation.name,
      collectionName: collection.name,
      method: "get",
      route: '/:id/' + relation.name + '/:fk/',
      middlewares: [
        collection.defender.acl("findOn", relation.name),
        findOn({
          collection,
          foreignCollection,
          throughCollection,
          key,
          foreignKey
        })],
      description: "find all " + relation.name + " about an " + collection.name + " on a " + foreignCollection.name
    }
  );

  rest.registerEndpoint(
    {
      action: "create",
      relation: relation.name,
      collectionName: collection.name,
      method: "post",
      route: '/:id/' + relation.name + '/:fk',
      middlewares: [
        collection.defender.acl("create", relation.name),
        create({
          collection,
          foreignCollection,
          throughCollection,
          key,
          foreignKey
        })],
      description: "add a " + relation.name
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
        destroy({
          collection,
          foreignCollection,
          throughCollection,
          key,
          foreignKey
        })],
      description: "remove all " + relation.name + " about an " + collection.name
    }
  );
}

export function find({collection, foreignCollection, throughCollection, foreignKey, key}) {
  return async function ({request, response, params}, next) {

    var id = params.id;
    response.body = response.body || {};

    var items = await throughCollection.findAll({
      where: {
        [key]: id
      }
    });

    response.body.done = true;
    response.body.data = items;

    await next();
  }
}

export function findOn({collection, foreignCollection, throughCollection, foreignKey, key}) {
  return async function ({request, response, params}, next) {

    var id = params.id;
    var fk = params.fk;
    response.body = response.body || {};

    var items = await throughCollection.findAll({
      where: {
        [key]: id,
        [foreignKey]: fk
      }
    });

    response.body.done = true;
    response.body.data = items;

    await next();

  }
}

export function create({collection, foreignCollection, throughCollection, foreignKey, key}) {
  return async function ({request, response, params}, next) {

    var id = params.id;
    var fk = params.fk;
    var data = request.body;
    response.body = response.body || {};

    var existsItem = await collection.exists(id);
    var existsForeignItem = await foreignCollection.exists(fk);

    if (!existsItem || !existsForeignItem) {
      response.body.done = false;
      response.body.errors = ['not_found'];
      await next();
      return;
    }

    data[key] = id;
    data[foreignKey] = fk;

    try {
      var item = await throughCollection.create(data);
      response.body.done = true;
      response.body.data = item;

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

export function destroy({collection, foreignCollection, throughCollection, foreignKey, key}) {
  return async function ({request, response, params}, next) {

    var id = params.id;
    var fk = params.fk;
    response.body = response.body || {};

    var joinList = await throughCollection.findAll({
      where: {
        [key]: id,
        [foreignKey]: fk
      }
    });

    if (joinList.length === 0) {
      response.body.done = false;
      response.body.errors = ['not_found'];
      await next();
      return;
    }

    var ids = joinList.map(function (item) {
      return item.id;
    });

    var result = await throughCollection.destroy(ids);
    response.body.done = result;

    await next();
  }

}


