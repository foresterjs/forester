export function _register(rest, {collections, collection, fieldName, options}) {

    var foreignCollection = collections[options.collection];
    var foreignKey = options.foreignKey;

    rest.registerEndpoint(
        {
            collectionName: collection.name,
            method: "get",
            route: '/:id/' + fieldName,
            middlewares: [pick({collection, foreignCollection, foreignKey})],
            description: "find " + fieldName
        }
    );

}


export function pick({collection, foreignCollection, foreignKey}) {
    return async function (req, res, next) {

        var id = req.params.id;

        var item = await collection.findById(id);
        var foreignId = item[foreignKey];
        var foreignItem = await foreignCollection.findById(foreignId);

        res.send(foreignItem);

        await next();
    }
}