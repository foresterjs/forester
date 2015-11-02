export function findAll({collection}) {
    return async function (req, res, next) {
        var options = req.query;

        var output = {
            items: await collection.findAll(options)
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
