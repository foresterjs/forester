

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

