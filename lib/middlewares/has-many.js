export function register(rest, {collections, collection, fieldName, options}) {

    var foreignCollection = collections[options.collection];
    var foreignKey = options.foreignKey;

    rest.registerEndpoint(
        {
            collectionName: collection.name,
            method: "get",
            route: "/:id/" + fieldName,
            middlewares: [findAll({collection, foreignCollection, foreignKey})],
            description: "get " + fieldName
        }
    );

    rest.registerEndpoint(
        {
            collectionName: collection.name,
            method: "get",
            route: '/:id/' + fieldName + '/:fk',
            middlewares: [findById({collection, foreignCollection, foreignKey})],
            description: "get " + fieldName
        }
    );

    rest.registerEndpoint(
        {
            collectionName: collection.name,
            method: "post",
            route: '/:id/' + fieldName,
            middlewares: [create({collection, foreignCollection, foreignKey})],
            description: "create " + fieldName
        }
    );

    rest.registerEndpoint(
        {
            collectionName: collection.name,
            method: "put",
            route: '/:id/' + fieldName + '/:fk',
            middlewares: [update({collection, foreignCollection, foreignKey})],
            description: "create " + fieldName
        }
    );

    rest.registerEndpoint(
        {
            collectionName: collection.name,
            method: "delete",
            route: '/:id/' + fieldName + '/:fk',
            middlewares: [destroy({collection, foreignCollection, foreignKey})],
            description: "destroy " + fieldName
        }
    );
}


export function findAll({collection, foreignCollection, foreignKey}) {
    return async function (req, res, next) {

        var id = req.params.id;
        var options = req.query;

        if(options.hasOwnProperty('where')){
            options['where'][foreignKey] = id;
        }else{
            options['where'] = {};
            options['where'][foreignKey] = id;
        }

        var items = await foreignCollection.findAll(options);

        var output = {
            items: items
        };

        res.json(output);

        await next();
    }
}


export function findById({collection, foreignCollection, foreignKey}) {
    return async function (req, res, next) {
        var id = req.params.id;
        var fk = req.params.fk;

        var item = await foreignCollection.findById(fk);

        if(item[foreignKey] === id){
            res.send(item);
        }else{
            res.sendStatus(404);
        }

        await next();
    }
}

export function create({collection, foreignCollection, foreignKey}) {
    return async function (req, res, next) {
        var id = req.params.id;
        var data = req.body;

        data[foreignKey] = id;

        var item = await foreignCollection.create(data);

        res.send(item);

        await next();
    }
}

export function update({collection, foreignCollection, foreignKey}) {
    return async function (req, res, next) {

        var id = req.params.id;
        var fk = req.params.fk;
        var data = req.body;

        data[foreignKey] = id;

        var item = await foreignCollection.findById(fk);

        if(item[foreignKey] === id){
            item = await foreignCollection.update(fk, data);
            res.send(item);
        }else{
            res.sendStatus(404);
        }

        await next();
    }
}

export function destroy({collection, foreignCollection, foreignKey}) {
    return async function (req, res, next) {
        var id = req.params.id;
        var fk = req.params.fk;

        var item = await foreignCollection.findById(fk);

        if(item[foreignKey] === id){
            foreignCollection.destroy(fk);
            res.sendStatus(200);
        }else{
            res.sendStatus(404);
        }

        await next();
    }
}
