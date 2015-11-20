
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

    response.body.count = await collection.count();

    await next();
  }
}

export function showPagesCount({collection}) {
  return async function ({request, response, params}, next) {

    response.body = response.body || {};

    var count = response.body.count || (await collection.count());
    var perPage = request.query.perPage || collection.defaults.perPage;

    response.body.pages = Math.ceil(count / perPage);

    await next();
  }
}
