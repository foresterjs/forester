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
        res.send(items);

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
