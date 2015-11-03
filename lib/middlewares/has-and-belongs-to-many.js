

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

export function addAssociation({collection, foreignCollection, throughCollection, foreignKey, key}) {
    return async function (req, res, next) {

        var id = req.params.id;
        var fk = req.params.fk;

        var existsItem = await collection.exists(id);
        var existsForeignItem = await foreignCollection.exists(fk);

        if (!existsItem || !existsForeignItem) {
            res.sendStatus(404);
            return next();
        }

        var joinList = await throughCollection.findAll({
            where: {
                [key]: id,
                [foreignKey]: fk
            }
        });

        if (joinList.length > 0) {
            res.json(joinList[0]);
            return next();
        }

        var item = await throughCollection.create(
            {
                [key]: id,
                [foreignKey]: fk
            });

        res.json(item);

        return next();
    }
}

export function destroyAssociation({collection, foreignCollection, throughCollection, foreignKey, key}) {
    return async function (req, res, next) {
        var id = req.params.id;
        var fk = req.params.fk;

        var joinList = await throughCollection.findAll({
            where: {
                [key]: id,
                [foreignKey]: fk
            }
        });

        if (joinList.length === 0) {
            res.sendStatus(404);
            return next();
        }

        await Promise.all(joinList.map(function (item) {
            return throughCollection.destroy(item._id.valueOf().toString());
        }));

        res.sendStatus(200);

        return next();
    }
}


