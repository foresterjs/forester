import wrap from '../koa-ctx';

export function _register(rest, {collection}) {

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
      middlewares: [pick({collection})],
      description: "find elements"
    }
  );

  rest.registerEndpoint(
    {
      collectionName: collection.name,
      method: "post",
      route: "/",
      middlewares: [create({collection})],
      description: "find an element"
    }
  );

  rest.registerEndpoint(
    {
      collectionName: collection.name,
      method: "post",
      route: "/:id",
      middlewares: [update({collection})],
      description: "update an element"
    }
  );

  rest.registerEndpoint(
    {
      collectionName: collection.name,
      method: "del",
      route: "/:id",
      middlewares: [destroy({collection})],
      description: "delete an element"
    }
  );

}


export function findAll({collection}) {
  return async function ({request, response}, next) {
    var options = request.query;

    var items = await collection.findAll(options);

    response.body = response.body || {};
    response.body.data = items;
    response.body.done = true;

    await next;
  }
}

export function pick({collection}) {
  return async function (next) {
    var id = this.params.id;

    var item = await collection.pick(id);

    this.body = this.body || {};

    if(item) {
      this.body.data = item;
      this.body.done = true;
    }else{
      this.body.done = false;
      this.body.errors = ['not_found'];
    }

    await next;
  }
}

export function create({collection}) {
  return async function (next) {
    var data = this.request.body;

    var item = await collection.create(data);

    this.body = this.body || {};
    this.body.data = item;
    this.body.done = true;

    await next;
  }
}

export function update({collection}) {
  return async function (next) {

    var id = this.params.id;
    var data = this.request.body;

    var item = await collection.update(id, data);

    this.body = this.body || {};
    if(item) {
      this.body.data = item;
      this.body.done = true;
    }else{
      this.body.done = false;
      this.body.errors = ['not_found'];
    }

    await next;
  }
}

export function destroy({collection}) {
  return async function (next) {

    var id = this.params.id;

    var result = await collection.destroy(id);

    this.body = this.body || {};
    this.body.done = result;

    if(!result) this.body.errors = ['not_found'];

    await next;
  }
}
