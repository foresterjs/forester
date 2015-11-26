
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
      middlewares: [find({
        collection,
        foreignCollection,
        throughCollection,
        key,
        foreignKey
      })],
      description: "find all " + relation.name
    }
  );

  rest.registerEndpoint(
    {
      action: "addAssociation",
      relation: relation.name,
      collectionName: collection.name,
      method: "post",
      route: '/:id/' + relation.name + '/:fk',
      middlewares: [addAssociation({
        collection,
        foreignCollection,
        throughCollection,
        key,
        foreignKey
      })],
      description: "add association with " + relation.name
    }
  );

  rest.registerEndpoint(
    {
      action: "destroyAssociation",
      relation: relation.name,
      collectionName: collection.name,
      method: "delete",
      route: '/:id/' + relation.name + '/:fk',
      middlewares: [destroyAssociation({
        collection,
        foreignCollection,
        throughCollection,
        key,
        foreignKey
      })],
      description: "remove association with " + relation.name
    }
  );
}

export function find({collection, foreignCollection, throughCollection, foreignKey, key}) {
  return async function ({request, response, params}, next) {

    var id = params.id;
    response.body = response.body || {};

    //TODO add check not found

    var joinList = await throughCollection.findAll({
      where: {
        [key]: id
      }
    });

    var ids = joinList.map(function (item) {
      return item[foreignKey];
    });

    var items = await foreignCollection.pick(ids);

    response.body.data = items;
    response.body.done = true;

    await next();
  }
}

export function addAssociation({collection, foreignCollection, throughCollection, foreignKey, key}) {
  return async function ({request, response, params}, next) {

    var id = params.id;
    var fk = params.fk;
    response.body = response.body || {};

    var existsItem = await collection.exists(id);
    var existsForeignItem = await foreignCollection.exists(fk);

    if (!existsItem || !existsForeignItem) {
      response.body.done = false;
      response.body.errors = ['not_found'];
      await next();
      return;
    }

    var joinList = await throughCollection.findAll({
      where: {
        [key]: id,
        [foreignKey]: fk
      }
    });

    if (joinList.length > 0) {
      response.body.done = false;
      response.body.errors = ['too_many'];
      await next();
      return;
    }

    var item = await throughCollection.create(
      {
        [key]: id,
        [foreignKey]: fk
      });

    response.body.data = item;
    response.body.done = true;

    await next();
  }
}

export function destroyAssociation({collection, foreignCollection, throughCollection, foreignKey, key}) {
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

    return next;
  }

}


