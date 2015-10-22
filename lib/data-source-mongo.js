'use strict';

var pmongo = require('promised-mongo');

class DataSourceMongo {

    constructor(connectionUri) {

        this.db = pmongo(connectionUri);

    }

    async updateSchema(collectionName) {
        console.log('here', collectionName);
        await this.db.createCollection(collectionName);
    }

    async findAll(collectionName, { page, perPage, where, orderBy, fields} = {}) {

        //TODO implement fields

        var cursor;

        if (typeof where === 'undefined') {
            cursor = this.db.collection(collectionName).find();
        } else {
            cursor = this.db.collection(collectionName).find(this._mongoWhere(where));
        }

        if (typeof orderBy !== 'undefined') {
            cursor.sort(this._mongoOrderBy());
        }

        if (typeof page !== 'undefined' && typeof perPage !== 'undefined') {
            var skip = (perPage * (page - 1))

            cursor.limit(perPage);
            cursor.skip(skip);
        }

        return await cursor.toArray();
    }

    async findById(collectionName, id) {
        var item = await this.db.collection(collectionName).findOne({'_id': new pmongo.ObjectId(id)});
        return item;
    }

    async create(collectionName, data) {
        var item = await this.db.collection(collectionName).insert(data);
        return item;
    }

    async update(collectionName, id, data) {
        var item = this.db.collection(collectionName).findAndModify({
            'query': {'_id': new pmongo.ObjectId(id)},
            'update': data,
            'new': true
        });
        return item;
    }

    async destroy(collectionName, id) {
        this.db.collection(collectionName).remove({'_id': new pmongo.ObjectId(id)});
    }


    async exists(collectionName, id) {
        //TODO
    }

    async count(collectionName, where) {
        //TODO
    }

    async bulkUpdate(collectionName, changes, where) {
        //TODO
    }

    async bulkDelete(collectionName, where) {
        //TODO
    }


    _mongoOrderBy(orderBy) {

        var orderByMap = {
            ASC: 1,
            DESC: -1
        };

        var result = [];

        for (var field in orderBy) {
            var value = orderByMap[orderBy[field]];
            if (!value) throw new Error('orderBy not recognized');

            result[field] = value;

        }

        return result;
    }

    _mongoWhere(where) {
        return where;
    }

}

module.exports = DataSourceMongo;