import wrap from '../koa-ctx';

module.exports = function (rest, {collection}) {

  rest.registerEndpoint(
    {
      collectionName: collection.name,
      method: "get",
      route: "/",
      middlewares: [wrap(findAll({collection}))],
      description: "find your elements"
    }
  );

  rest.registerEndpoint(
    {
      collectionName: collection.name,
      method: "get",
      route: "/:id",
      middlewares: [wrap(pick({collection}))],
      description: "find elements"
    }
  );

  rest.registerEndpoint(
    {
      collectionName: collection.name,
      method: "post",
      route: "/",
      middlewares: [wrap(create({collection}))],
      description: "find an element"
    }
  );

  rest.registerEndpoint(
    {
      collectionName: collection.name,
      method: "post",
      route: "/:id",
      middlewares: [wrap(update({collection}))],
      description: "update an element"
    }
  );

  rest.registerEndpoint(
    {
      collectionName: collection.name,
      method: "del",
      route: "/:id",
      middlewares: [wrap(destroy({collection}))],
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

    await next;
  }
}

export function pick({collection}) {
  return async function ({request, response, params}, next) {
    var id = params.id;
    response.body = response.body || {};

    var item = await collection.pick(id);


    if(item) {
      response.body.data = item;
      response.body.done = true;
    }else{
      response.body.done = false;
      response.body.errors = ['not_found'];
    }

    await next;
  }
}

export function create({collection}) {
  return async function ({request, response}, next) {
    var data = request.body;
    response.body = response.body || {};

    var item = await collection.create(data);

    response.body.data = item;
    response.body.done = true;

    await next;
  }
}

export function update({collection}) {
  return async function ({request, response, params}, next) {

    var id = params.id;
    var data = request.body;
    response.body = response.body || {};

    var item = await collection.update(id, data);

    if(item) {
      response.body.data = item;
      response.body.done = true;
    }else{
      response.body.done = false;
      response.body.errors = ['not_found'];
    }

    await next;
  }
}

export function destroy({collection}) {
  return async function ({request, response, params}, next) {

    var id = params.id;
    response.body = response.body || {};

    var result = await collection.destroy(id);

    response.body.done = result;

    if(!result) response.body.errors = ['not_found'];

    await next;
  }
}
