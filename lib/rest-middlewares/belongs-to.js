"use strict";

module.exports = function (rest, {collections, collection, relation}) {

  var foreignCollection = collections[relation.collection];
  var foreignKey = relation.foreignKey;

  rest.registerEndpoint(
    {
      action: "pick",
      relation: relation.name,
      collectionName: collection.name,
      method: "get",
      route: "/:id/" + relation.name,
      middlewares: [
        collection.defender.acl("pick", relation.name),
        get({collection, foreignCollection, foreignKey})
      ],
      description: "pick " + relation.name
    }
  );

}


export function get({collection, foreignCollection, foreignKey}) {
  return async function ({request, response, params}, next) {

    var id = params.id;
    response.body = response.body || {};

    //pick obj
    var item = await collection.pick(id);
    if(!item){
      response.body.done = false;
      response.body.errors = ['not_found'];
      await next();
      return;
    }

    //check
    var foreignId = item[foreignKey];
    if(!foreignId){
      response.body.done = false;
      response.body.errors = ['not_found'];
      await next();
      return;
    }

    //pick foreign obj
    var foreignItem = await foreignCollection.pick(foreignId);
    if(foreignItem){
      response.body.done = true;
      response.body.data = foreignItem;
    }else{
      response.body.done = false;
      response.body.errors = ['not_found'];
    }
  }
}
