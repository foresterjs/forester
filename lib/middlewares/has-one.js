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