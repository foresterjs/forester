export function register(rest, {collections, collection, fieldName, options}) {

    var foreignCollection = collections[options.collection];
    var foreignKey = options.foreignKey;
    var key = options.key;
    var throughCollection = collections[options.through];

    rest.registerEndpoint(
        {
            collectionName: collection.name,
            method: "get",
            route: '/:id/' + fieldName,
            middlewares: [find({
                collection,
                foreignCollection,
                throughCollection,
                key,
                foreignKey
            })],
            description: "find all " + fieldName
        }
    );

    rest.registerEndpoint(
        {
            collectionName: collection.name,
            method: "get",
            route: '/:id/' + fieldName + '/:fk/',
            middlewares: [findById({
                collection,
                foreignCollection,
                throughCollection,
                key,
                foreignKey
            })],
            description: "find a " + fieldName
        }
    );

    rest.registerEndpoint(
        {
            collectionName: collection.name,
            method: "post",
            route: '/:id/' + fieldName + '/:fk',
            middlewares: [create({
                collection,
                foreignCollection,
                throughCollection,
                key,
                foreignKey
            })],
            description: "add association with " + fieldName
        }
    );

    rest.registerEndpoint(
        {
            collectionName: collection.name,
            method: "delete",
            route: '/:id/' + fieldName + '/:fk',
            middlewares: [destroy({
                collection,
                foreignCollection,
                throughCollection,
                key,
                foreignKey
            })],
            description: "remove all " + fieldName
        }
    );
}

export function find({collection, foreignCollection, throughCollection, foreignKey, key}) {
    return async function (req, res, next) {

        var id = req.params.id;

        var options = {
            where: {
                [key]: id
            }
        };

        var items = await throughCollection.findAll(options);

        var output = {
            items: items
        };

        res.json(output);

        await next();
    }
}

export function findById({collection, foreignCollection, throughCollection, foreignKey, key}) {
    return async function (req, res, next) {

        var id = req.params.id;
        var fk = req.params.fk;

        var options = {
            where: {
                [key]: id
            }
        };

        var item = await throughCollection.findById(fk);

        if(item[key] !== id){
            res.sendStatus(404);
            await next();
            return;
        }


        var output = {
            data: item
        };

        res.json(output);

        await next();
    }
}

export function create({collection, foreignCollection, throughCollection, foreignKey, key}) {
    return async function (req, res, next) {

        var id = req.params.id;
        var fk = req.params.fk;
        var data = req.body;

        var existsItem = await collection.exists(id);
        var existsForeignItem = await foreignCollection.exists(fk);

        if (!existsItem || !existsForeignItem) {
            res.sendStatus(404);
            return next();
        }

        data[key]= id;
        data[foreignKey]= fk;

        var item = await throughCollection.create(data);
        res.json(item);

        return next();
    }
}

export function destroy({collection, foreignCollection, throughCollection, foreignKey, key}) {
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


