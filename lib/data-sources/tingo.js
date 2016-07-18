'use strict';

var tingodb = require('tingodb')();

class DataSourceTingoDB {

  constructor(options) {
    this.db = new tingodb.Db(options.path, options);
  }

  async updateSchema(collectionName) {

  }

  async findAll(collectionName, { page, perPage, where, orderBy, fields} = {}) {

    return new Promise((resolve, reject) => {
      var cursor;

      if (where) {
        cursor = this.db.collection(collectionName).find(DataSourceTingoDB.mongoWhere(where));
      } else {
        cursor = this.db.collection(collectionName).find();
      }

      if (orderBy) {
        cursor.sort(DataSourceTingoDB.mongoOrderBy(orderBy));
      }

      if (page && perPage) {
        var skip = (perPage * (page - 1));

        cursor.limit(perPage);
        cursor.skip(skip);
      }

      cursor.toArray(function (err, docs) {
        if (!err)
          resolve(DataSourceTingoDB.unwrapId(docs));
        else
          reject(false);
      });
    });

  }

  async pick(collectionName, ids) {

    if (Array.isArray(ids)) {

      return new Promise((resolve, reject) => {

        ids = ids.map(function (id) {
          return new tingodb.ObjectID(id)
        });

        this.db.collection(collectionName).find({_id: {$in: ids}}, function (err, data) {
          if (!err) {
            resolve(DataSourceTingoDB.unwrapId(data));
          } else {
            reject(false);
          }
        });
      });

    } else {

      return new Promise((resolve, reject) => {

        var id = ids;
        this.db.collection(collectionName).findOne({_id: new tingodb.ObjectID(id)}, function (err, data) {
          if (!err) {
            resolve((data === null) ? false : DataSourceTingoDB.unwrapId(data));
          } else {
            reject(false);
          }
        });
      });

    }
  }

  async create(collectionName, data) {

    return new Promise((resolve, reject) => {
      this.db.collection(collectionName).insert(data, function (err, result) {
        if (!err)
          resolve(DataSourceTingoDB.unwrapId(result));
        else
          reject(false);
      });
    });

  }

  async update(collectionName, id, data) {

    return new Promise((resolve, reject) => {

      this.db.collection(collectionName).findAndModify(
        [{_id: new tingodb.ObjectID(id)}], [['_id', 1]], {$set: data}, {'new': true},
        function (err, doc) {
          if (!err) {
            resolve(DataSourceTingoDB.unwrapId(doc));
          } else {
            reject(false);
          }
        });
    })

  }

  async destroy(collectionName, ids) {

    if (Array.isArray(ids)) {

      return new Promise((resolve, reject) => {

        ids = ids.map(function (id) {
          return tingodb.ObjectID(id)
        });

        this.db.collection(collectionName).remove({_id: {$in: ids}}, function (err, data) {
          if (!err) {
            resolve(true);
          } else {
            reject(false);
          }
        });
      });

    } else {

      return new Promise((resolve, reject) => {

        var id = ids;
        this.db.collection(collectionName).remove({_id: new tingodb.ObjectID(id)}, function (err, data) {
          if (!err) {
            resolve(data === 1);
          } else {
            reject(false);
          }
        });
      });

    }
  }

  async exists(collectionName, id) {
    return new Promise((resolve, reject) => {
      this.db.collection(collectionName).findOne({'_id': new tingodb.ObjectID(id)}, function (err, data) {
        if (!err)
          resolve(data !== null);
        else
          reject(false);
      });
    });
  }

  async count(collectionName, where) {
    return new Promise((resolve, reject) => {
      this.db.collection(collectionName).count(where, function (err, data) {
        if (!err)
          resolve(data)
        else
          reject(false);
      });
    });
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

  static unwrapId(docs) {
    if (Array.isArray(docs)) {
      return docs.map(DataSourceTingoDB.unwrapId);
    }

    var doc = docs;
    doc.id = doc._id.toString();
    delete doc._id;
    return doc;
  }

}

module.exports = DataSourceTingoDB;
