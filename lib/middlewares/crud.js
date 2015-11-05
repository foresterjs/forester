export function register(rest, {collection}) {

    rest.registerEndpoint(
        {
            collectionName: collection.name,
            method: "get",
            route: "/",
            middlewares: [findAll({collection})],
            description: "find your elements"
        }
    );

    rest.registerEndpoint(
        {
            collectionName: collection.name,
            method: "get",
            route: "/:id",
            middlewares: [findById({collection})],
            description: "find an elements"
        }
    );

    rest.registerEndpoint(
        {
            collectionName: collection.name,
            method: "post",
            route: "/",
            middlewares: [create({collection})],
            description: "find your elements"
        }
    );

    rest.registerEndpoint(
        {
            collectionName: collection.name,
            method: "put",
            route: "/",
            middlewares: [update({collection})],
            description: "update an elements"
        }
    );

    rest.registerEndpoint(
        {
            collectionName: collection.name,
            method: "delete",
            route: "/:id",
            middlewares: [destroy({collection})],
            description: "delete an elements"
        }
    );
}


export function findAll({collection}) {
    return async function (req, res, next) {
        var options = req.query;

        var output = {
            items: await collection.findAll(options),
            total: await collection.count(),
            schema: {
                properties: collection.schema.properties,
                relations: collection.schema.relations
            }
        };

        res.json(output);

        await next();
    }
}

export function findById({collection}) {
    return async function (req, res, next) {
        var id = req.params.id;
        var item = await collection.findById(id);

        res.send(item);

        await next();
    }
}

export function create({collection}) {
    return async function (req, res, next) {
        var data = req.body;
        var item = await collection.create(data);

        res.send(item);

        await next();
    }
}

export function update({collection}) {
    return async function (req, res, next) {
        var id = req.params.id;
        var data = req.body;
        var item = await collection.update(id, data);

        res.send(item);

        await next();
    }
}

export function destroy({collection}) {
    return async function (req, res, next) {
        var id = req.params.id;
        var item = await collection.destroy(id);

        await next();
    }
}
