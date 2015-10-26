'use strict';
var router = require('koa-router');

class Rest {

    constructor({collection}) {
        this.collection = collection;
        this.router = router();

        this.router.prefix('/' + collection.name);

        this.router.get('/', this.findAll);
        this.router.get('/:id', this.findById);
        this.router.post('/', this.create);
        this.router.put('/:id', this.update);
        this.router.delete('/:id', this.destroy);
    }

    middleware(){
        return this.router.routes();
    }

    get findAll() {
        var collection = this.collection;
        return async function (next) {

            var options = this.query;
            var items = await collection.findAll(options);
            this.body = items;

            await next;
        };
    }

    get findById() {
        var collection = this.collection;
        return async function (next) {

            var id = this.params.id;
            var item = await collection.findById(id);

            this.body = item;

            await next;
        };
    }

    get create() {
        var collection = this.collection;
        return async function (next) {

            var data = this.request.body;
            var item = await collection.create(data);

            this.body = item;

            await next;
        };
    }

    get update() {
        var collection = this.collection;
        return async function (next) {

            var id = this.params.id;
            var data = this.request.body;
            var item = await collection.update(id, data);

            this.body = item;

            await next;
        };
    }

    get destroy() {
        var collection = this.collection;
        return async function (next) {

            var id = this.params.id;
            var item = await collection.findById(id);

            this.body = item;

            await next;
        };
    }

}

module.exports = Rest;