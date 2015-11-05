export function schema({collections, rest}) {
  return async function (next) {

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

    this.body = endpointsDescription;

    await next;
  }
}

export function hello() {
  return async function (next) {
    this.body = ['Hello! This is Forester!'];
    await next;
  };
}
