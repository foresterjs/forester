'use strict';

var pmongo = require('promised-mongo');

class DataSourceMongo {

  constructor({connectionUri}) {

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
      cursor = this.db.collection(collectionName).find(DataSourceMongo.mongoWhere(where));
    }

    if (typeof orderBy !== 'undefined') {
      cursor.sort(DataSourceMongo.mongoOrderBy(orderBy));
    }

    if (typeof page !== 'undefined' && typeof perPage !== 'undefined') {
      var skip = (perPage * (page - 1))

      cursor.limit(perPage);
      cursor.skip(skip);
    }

    return await cursor.toArray();
  }

  async pick(collectionName, ids) {

    if(Array.isArray(ids)){

      ids = ids.map(function(id){
        return pmongo.ObjectId(id)
      });

      var items = await this.db.collection(collectionName).find({_id: {$in: ids}});
      return items;

    }else{

      var id = ids;
      try {
        var item = await this.db.collection(collectionName).findOne({_id: new pmongo.ObjectId(id)});
        item = (item === null) ? false : item;
      } catch (e) {
        console.error(e);
        return false;
      }

      return item;

    }
  }

  async create(collectionName, data) {
    var item = await this.db.collection(collectionName).insert(data);
    return item;
  }

  async update(collectionName, id, data) {
    try {
      var item = await this.db.collection(collectionName).findAndModify({
        'query': {'_id': new pmongo.ObjectId(id)},
        'update': data,
        'new': true
      });

      item = (item.lastErrorObject.n === 0) ? false : item.value;

    } catch (e) {
      console.error(e);
      return false;
    }

    return item;
  }

  async destroy(collectionName, ids) {

    if (Array.isArray(ids)) {

      ids = ids.map(function (id) {
        return pmongo.ObjectId(id)
      });

      await this.db.collection(collectionName).remove({_id: {$in: ids}});
      return true;

    } else {

      try {

        var id = ids;
        var result = await this.db.collection(collectionName).remove({'_id': new pmongo.ObjectId(id)});

        return result.n === 1;

      } catch (e) {
        console.error(e);
        return false;
      }

    }
  }


  async exists(collectionName, id) {
    try {
      var item = await this.db.collection(collectionName).findOne({'_id': new pmongo.ObjectId(id)});
      return (item !== null);
    }catch (e){
      console.error(e);
      return false;
    }
  }

  async count(collectionName, where) {
    var count = await this.db.collection(collectionName).count(where);
    return count;
  }


  static mongoOrderBy(orderBy) {

    var orderByMap = {
      ASC: 1,
      DESC: -1
    };

    var result = {};

    for (var field in orderBy) {
      var value = orderByMap[orderBy[field]];
      if (!value) throw new Error('orderBy not recognized');

      result[field] = value;

    }

    return result;
  }

  static mongoWhere(where) {
    return where;
  }

}

module.exports = DataSourceMongo;
