'use strict';

var EventEmitter = require('events');

class Collection {

    constructor({dataSource, collectionSchema}) {
        this.dataSource = dataSource;
        this.collectionSchema = collectionSchema;
        this.eventEmitter = new EventEmitter();

        this.sanitizer = new Sanitizer(); //TODO construct and inject config
        this.validator = new Validator(); //TODO construct and inject config
    }

    addMethod (name, handler) {
        this[name] = handler.bind(this);
    }

    async findAll({ where, orderBy, columns, page= 1, perPage= 20}) {
        var options = arguments[0];

        this.eventEmitter.emit('findAll:before', options);
        var items = await this.dataSource.findAll(options);
        this.eventEmitter.emit('findAll:after', options, items);

        return items;
    }

    async findById(id) {
        this.eventEmitter.emit('findById:before', id);
        var item = await this.dataSource.findById(id);
        this.eventEmitter.emit('findById:after', id, item);

        return item;
    }

    async create(data) {

        this.eventEmitter.emit('create:before', data);
        data = this.sanitizer.sanitize(data);
        var validation = this.validator.validate(data);

        if (validation !== true) {
            throw new Error('validation error'); //TODO should return validation errors
        }

        var item = await this.dataSource.create(data);
        this.eventEmitter.emit('create:after', data, item);

        return item;

    }

    async update(id, data) {

        this.eventEmitter.emit('update:before', data);
        data = this.sanitizer.sanitize(data);
        var validation = this.validator.validate(data);

        if (validation !== true) {
            throw new Error('validation error'); //TODO should return validation errors
        }

        var item = await this.dataSource.update(id, data);
        this.eventEmitter.emit('update:after', data, item);

        return item;
    }

    async destroy(id) {

        this.eventEmitter.emit('destroy:before', id);
        var item = await this.dataSource.destroy(id);
        this.eventEmitter.emit('destroy:after', id);

    }

    async exists(id) {
        //TODO
    }

    async count(where) {
        //TODO
    }

    async bulkUpdate(change, where) {
        //TODO
    }

    async bulkDestroy(where) {
        //TODO
    }

    on(event, callback){
        this.eventEmitter.on(event, callback);
    }
}

module.exports = Collection;