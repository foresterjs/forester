export function _register(rest, {collections, collection, fieldName, options}) {

  var foreignCollection = collections[options.collection];
  var foreignKey = options.foreignKey;
  var key = options.key;
  var throughCollection = collections[options.through];

  rest.registerEndpoint(
    {
      collectionName: collection.name,
      method: "get",
      route: '/:id/' + fieldName,
      middlewares: [find({
        collection,
        foreignCollection,
        throughCollection,
        key,
        foreignKey
      })],
      description: "find " + fieldName
    }
  );

  rest.registerEndpoint(
    {
      collectionName: collection.name,
      method: "post",
      route: '/:id/' + fieldName + '/:fk',
      middlewares: [addAssociation({
        collection,
        foreignCollection,
        throughCollection,
        key,
        foreignKey
      })],
      description: "add association with " + fieldName
    }
  );

  rest.registerEndpoint(
    {
      collectionName: collection.name,
      method: "delete",
      route: '/:id/' + fieldName + '/:fk',
      middlewares: [destroyAssociation({
        collection,
        foreignCollection,
        throughCollection,
        key,
        foreignKey
      })],
      description: "remove association with " + fieldName
    }
  );
}

export function find({collection, foreignCollection, throughCollection, foreignKey, key}) {
  return async function (req, res, next) {

    var id = req.params.id;

    var options = {
      where: {
        [key]: id
      }
    };

    var joinList = await throughCollection.findAll(options);

    var items = await Promise.all(joinList.map(function (item) {
      return foreignCollection.findById(item[foreignKey]);
    }));

    var output = {
      items: items
    };

    res.json(output);

    await next();
  }
}

export function addAssociation({collection, foreignCollection, throughCollection, foreignKey, key}) {
  return async function (req, res, next) {

    var id = req.params.id;
    var fk = req.params.fk;

    var existsItem = await collection.exists(id);
    var existsForeignItem = await foreignCollection.exists(fk);

    if (!existsItem || !existsForeignItem) {
      res.sendStatus(404);
      return next();
    }

    var joinList = await throughCollection.findAll({
      where: {
        [key]: id,
        [foreignKey]: fk
      }
    });

    if (joinList.length > 0) {
      res.json(joinList[0]);
      return next();
    }

    var item = await throughCollection.create(
      {
        [key]: id,
        [foreignKey]: fk
      });

    res.json(item);

    return next();
  }
}

export function destroyAssociation({collection, foreignCollection, throughCollection, foreignKey, key}) {
  return async function (req, res, next) {
    var id = req.params.id;
    var fk = req.params.fk;

    var joinList = await throughCollection.findAll({
      where: {
        [key]: id,
        [foreignKey]: fk
      }
    });

    if (joinList.length === 0) {
      res.sendStatus(404);
      return next();
    }

    await Promise.all(joinList.map(function (item) {
      return throughCollection.destroy(item._id.valueOf().toString());
    }));

    res.sendStatus(200);

    return next();
  }
}


