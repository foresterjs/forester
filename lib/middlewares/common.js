export function schema({collections, rest}) {
  return async function (req, res, next) {

    var endpointsDescription = [];

    for (var collectionName in collections) {
      var collectionSchema = collections[collectionName].schema;
      endpointsDescription.push({
        name: collectionName,
        properties: collectionSchema.properties,
        relations: collectionSchema.relations,
        endpoints: rest.routesDescription[collectionName] || []
      });
    }

    res.json(endpointsDescription);

    await next();
  }
}

export function hello() {
  return async function (req, res, next) {
    res.send('Hello! This is Forester!');
  };
}
