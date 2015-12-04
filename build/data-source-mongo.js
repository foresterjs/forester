'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var pmongo = require('promised-mongo');

let DataSourceMongo = (function () {
  function DataSourceMongo(_ref) {
    let connectionUri = _ref.connectionUri;

    _classCallCheck(this, DataSourceMongo);

    this.db = pmongo(connectionUri);
  }

  _createClass(DataSourceMongo, [{
    key: 'updateSchema',
    value: (function () {
      var ref = _asyncToGenerator(function* (collectionName) {
        console.log('here', collectionName);
        yield this.db.createCollection(collectionName);
      });

      return function updateSchema(_x) {
        return ref.apply(this, arguments);
      };
    })()
  }, {
    key: 'findAll',
    value: (function () {
      var ref = _asyncToGenerator(function* (collectionName) {
        var _ref2 = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

        let page = _ref2.page;
        let perPage = _ref2.perPage;
        let where = _ref2.where;
        let orderBy = _ref2.orderBy;
        let fields = _ref2.fields;

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
          var skip = perPage * (page - 1);

          cursor.limit(perPage);
          cursor.skip(skip);
        }

        return DataSourceMongo.unwrapId((yield cursor.toArray()));
      });

      return function findAll(_x2, _x3) {
        return ref.apply(this, arguments);
      };
    })()
  }, {
    key: 'pick',
    value: (function () {
      var ref = _asyncToGenerator(function* (collectionName, ids) {

        if (Array.isArray(ids)) {

          ids = ids.map(function (id) {
            return pmongo.ObjectId(id);
          });

          var items = yield this.db.collection(collectionName).find({ _id: { $in: ids } });
          return DataSourceMongo.unwrapId(items);
        } else {

          var id = ids;
          try {
            var item = yield this.db.collection(collectionName).findOne({ _id: new pmongo.ObjectId(id) });
            item = item === null ? false : item;
          } catch (e) {
            console.error(e);
            return false;
          }

          return DataSourceMongo.unwrapId(item);
        }
      });

      return function pick(_x5, _x6) {
        return ref.apply(this, arguments);
      };
    })()
  }, {
    key: 'create',
    value: (function () {
      var ref = _asyncToGenerator(function* (collectionName, data) {
        var item = yield this.db.collection(collectionName).insert(data);
        return DataSourceMongo.unwrapId(item);
      });

      return function create(_x7, _x8) {
        return ref.apply(this, arguments);
      };
    })()
  }, {
    key: 'update',
    value: (function () {
      var ref = _asyncToGenerator(function* (collectionName, id, data) {
        try {
          var item = yield this.db.collection(collectionName).findAndModify({
            'query': { '_id': new pmongo.ObjectId(id) },
            'update': data,
            'new': true
          });

          item = item.lastErrorObject.n === 0 ? false : item.value;
        } catch (e) {
          console.error(e);
          return false;
        }

        return DataSourceMongo.unwrapId(item);
      });

      return function update(_x9, _x10, _x11) {
        return ref.apply(this, arguments);
      };
    })()
  }, {
    key: 'destroy',
    value: (function () {
      var ref = _asyncToGenerator(function* (collectionName, ids) {

        if (Array.isArray(ids)) {

          ids = ids.map(function (id) {
            return pmongo.ObjectId(id);
          });

          yield this.db.collection(collectionName).remove({ _id: { $in: ids } });
          return true;
        } else {

          try {

            var id = ids;
            var result = yield this.db.collection(collectionName).remove({ '_id': new pmongo.ObjectId(id) });

            return result.n === 1;
          } catch (e) {
            console.error(e);
            return false;
          }
        }
      });

      return function destroy(_x12, _x13) {
        return ref.apply(this, arguments);
      };
    })()
  }, {
    key: 'exists',
    value: (function () {
      var ref = _asyncToGenerator(function* (collectionName, id) {
        try {
          var item = yield this.db.collection(collectionName).findOne({ '_id': new pmongo.ObjectId(id) });
          return item !== null;
        } catch (e) {
          console.error(e);
          return false;
        }
      });

      return function exists(_x14, _x15) {
        return ref.apply(this, arguments);
      };
    })()
  }, {
    key: 'count',
    value: (function () {
      var ref = _asyncToGenerator(function* (collectionName, where) {
        var count = yield this.db.collection(collectionName).count(where);
        return count;
      });

      return function count(_x16, _x17) {
        return ref.apply(this, arguments);
      };
    })()
  }], [{
    key: 'mongoOrderBy',
    value: function mongoOrderBy(orderBy) {

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
  }, {
    key: 'mongoWhere',
    value: function mongoWhere(where) {
      return where;
    }
  }, {
    key: 'unwrapId',
    value: function unwrapId(docs) {
      if (Array.isArray(docs)) {
        return docs.map(DataSourceMongo.unwrapId);
      }

      var doc = docs;
      doc.id = doc._id.toString();
      delete doc._id;
      return doc;
    }
  }]);

  return DataSourceMongo;
})();

module.exports = DataSourceMongo;
//# sourceMappingURL=data-source-mongo.js.map