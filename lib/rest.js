'use strict';
var express = require('express');
var compose = require('./compose');

class Rest {

    constructor({collection}) {
        this.collection = collection;
        this.express = express();

        //this.express.get('/', compose([this.injectCollection.bind(this), this.f2]));

        this.express.get('/', compose([this.injectCollection.bind(this), this.findAll]));
        this.express.get('/:id', compose([this.injectCollection.bind(this), this.findById]));
        this.express.post('/', compose([this.injectCollection.bind(this), this.create]));
        this.express.put('/:id', compose([this.injectCollection.bind(this), this.update]));
        this.express.delete('/:id', compose([this.injectCollection.bind(this), this.destroy]));
    }


    async injectCollection (req, res, next) {
        console.log(1);
        req.collection = this.collection;
        await next();
        console.log(4);
    }

    async f2 (req, res, next) {
        console.log(2);
        //await next();
        console.log(3);
    }


    async findAll(req, res, next) {
        var options = req.query;
        var items = await req.collection.findAll(options);

        res.send(items);

        //await next();
    }

    async findById(req, res, next) {
        var id = req.params.id;
        var item = await req.collection.findById(id);

        res.send(item);

        //await next();
    }

    async create(req, res, next) {
        var data = req.body;
        var item = await req.collection.create(data);

        res.send(item);

        //await next();
    }

    async update(req, res, next) {
        var id = req.params.id;
        var data = req.body;
        var item = await req.collection.update(id, data);

        res.send(item);

        //await next();
    }

    async destroy(req, res, next) {
        var id = req.params.id;
        var item = await req.collection.destroy(id);

        //await next();
    }

}

module.exports = Rest;