'use strict';

var pmongo = require('promised-mongo');

class DataSourceMongo {

    constructor(connectionUri, collectionName) {
        this.collectionName = collectionName;

        this.db = pmongo(connectionUri);
        this.collection = this.db.collection(collectionName);
    }

    async updateSchema() {
        this.db.createCollection(this.collectionName);
    }

    async findAll({ page, perPage, where, orderBy, columns}) {

        //TODO implement columns

        var cursor;

        if (typeof where === 'undefined') {
            cursor = this.collection.find();
        } else {
            cursor = this.collection.find(this._mongoWhere(where));
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

    async findById(id) {
        var item = await this.collection.findOne({'_id': new pmongo.ObjectId(id)});
        return item;
    }

    async create(data) {
        var item = await this.collection.insert(data);
        return item;
    }

    async update(id, data) {
        var item = this.collection.findAndModify({
            'query': {'_id': new pmongo.ObjectId(id)},
            'update': data,
            'new': true
        });
        return item;
    }

    async destroy(id) {
        this.collection.remove({'_id': new pmongo.ObjectId(id)});
    }


    async exists(id) {
        //TODO
    }

    async count(where) {
        //TODO
    }

    async bulkUpdate(changes, where) {
        //TODO
    }

    async bulkDelete(where) {
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