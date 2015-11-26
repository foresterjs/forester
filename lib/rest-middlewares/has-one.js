
module.exports = function (rest, {collections, collection, relation}) {

  var foreignCollection = collections[relation.collection];
  var foreignKey = relation.foreignKey;

  rest.registerEndpoint(
    {
      action: "get",
      relation: relation.name,
      collectionName: collection.name,
      method: "get",
      route: '/:id/' + relation.name,
      middlewares: [pick({collection, foreignCollection, foreignKey})],
      description: "find " + collection.name
    }
  );

}


export function pick({collection, foreignCollection, foreignKey}) {
  return async function ({request, response, params}, next) {

    var id = params.id;
    var options = request.query;
    response.body = response.body || {};

    options.where = options.where || {};
    options.where[foreignKey] = id;

    var items = await foreignCollection.findAll(options);

    if(items.length === 0){
      response.body.done = false;
      response.body.errors = ['not_found'];
      await next();
      return;
    }

    if(items.length > 1){
      response.body.done = false;
      response.body.errors = ['too_many'];
      await next();
      return;
    }

    response.body.data = items;
    response.body.done = true;

    await next();
  }
}
