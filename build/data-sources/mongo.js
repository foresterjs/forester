'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var pmongo = require('promised-mongo');

var DataSourceMongo = (function () {
  function DataSourceMongo(_ref) {
    var connectionUri = _ref.connectionUri;

    _classCallCheck(this, DataSourceMongo);

    this.db = pmongo(connectionUri);
  }

  _createClass(DataSourceMongo, [{
    key: 'updateSchema',
    value: (function () {
      var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(collectionName) {
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                console.log('here', collectionName);
                _context.next = 3;
                return this.db.createCollection(collectionName);

              case 3:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      return function updateSchema(_x) {
        return ref.apply(this, arguments);
      };
    })()
  }, {
    key: 'findAll',
    value: (function () {
      var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee2(collectionName) {
        var _ref2 = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

        var page = _ref2.page;
        var perPage = _ref2.perPage;
        var where = _ref2.where;
        var orderBy = _ref2.orderBy;
        var fields = _ref2.fields;
        var cursor, skip;
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:

                if (typeof where === 'undefined') {
                  cursor = this.db.collection(collectionName).find();
                } else {
                  cursor = this.db.collection(collectionName).find(DataSourceMongo.mongoWhere(where));
                }

                //TODO implement fields

                if (typeof orderBy !== 'undefined') {
                  cursor.sort(DataSourceMongo.mongoOrderBy(orderBy));
                }

                if (typeof page !== 'undefined' && typeof perPage !== 'undefined') {
                  skip = perPage * (page - 1);

                  cursor.limit(perPage);
                  cursor.skip(skip);
                }

                _context2.t0 = DataSourceMongo;
                _context2.next = 6;
                return cursor.toArray();

              case 6:
                _context2.t1 = _context2.sent;
                return _context2.abrupt('return', _context2.t0.unwrapId.call(_context2.t0, _context2.t1));

              case 8:
              case 'end':
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      return function findAll(_x2, _x3) {
        return ref.apply(this, arguments);
      };
    })()
  }, {
    key: 'pick',
    value: (function () {
      var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee3(collectionName, ids) {
        var items, id, item;
        return regeneratorRuntime.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                if (!Array.isArray(ids)) {
                  _context3.next = 8;
                  break;
                }

                ids = ids.map(function (id) {
                  return pmongo.ObjectId(id);
                });

                _context3.next = 4;
                return this.db.collection(collectionName).find({ _id: { $in: ids } });

              case 4:
                items = _context3.sent;
                return _context3.abrupt('return', DataSourceMongo.unwrapId(items));

              case 8:
                id = ids;
                _context3.prev = 9;
                _context3.next = 12;
                return this.db.collection(collectionName).findOne({ _id: new pmongo.ObjectId(id) });

              case 12:
                item = _context3.sent;

                item = item === null ? false : item;
                _context3.next = 20;
                break;

              case 16:
                _context3.prev = 16;
                _context3.t0 = _context3['catch'](9);

                console.error(_context3.t0);
                return _context3.abrupt('return', false);

              case 20:
                return _context3.abrupt('return', DataSourceMongo.unwrapId(item));

              case 21:
              case 'end':
                return _context3.stop();
            }
          }
        }, _callee3, this, [[9, 16]]);
      }));

      return function pick(_x5, _x6) {
        return ref.apply(this, arguments);
      };
    })()
  }, {
    key: 'create',
    value: (function () {
      var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee4(collectionName, data) {
        var item;
        return regeneratorRuntime.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                _context4.next = 2;
                return this.db.collection(collectionName).insert(data);

              case 2:
                item = _context4.sent;
                return _context4.abrupt('return', DataSourceMongo.unwrapId(item));

              case 4:
              case 'end':
                return _context4.stop();
            }
          }
        }, _callee4, this);
      }));

      return function create(_x7, _x8) {
        return ref.apply(this, arguments);
      };
    })()
  }, {
    key: 'update',
    value: (function () {
      var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee5(collectionName, id, data) {
        var item;
        return regeneratorRuntime.wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                _context5.prev = 0;
                _context5.next = 3;
                return this.db.collection(collectionName).findAndModify({
                  'query': { '_id': new pmongo.ObjectId(id) },
                  'update': data,
                  'new': true
                });

              case 3:
                item = _context5.sent;

                item = item.lastErrorObject.n === 0 ? false : item.value;

                _context5.next = 11;
                break;

              case 7:
                _context5.prev = 7;
                _context5.t0 = _context5['catch'](0);

                console.error(_context5.t0);
                return _context5.abrupt('return', false);

              case 11:
                return _context5.abrupt('return', DataSourceMongo.unwrapId(item));

              case 12:
              case 'end':
                return _context5.stop();
            }
          }
        }, _callee5, this, [[0, 7]]);
      }));

      return function update(_x9, _x10, _x11) {
        return ref.apply(this, arguments);
      };
    })()
  }, {
    key: 'destroy',
    value: (function () {
      var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee6(collectionName, ids) {
        var id, result;
        return regeneratorRuntime.wrap(function _callee6$(_context6) {
          while (1) {
            switch (_context6.prev = _context6.next) {
              case 0:
                if (!Array.isArray(ids)) {
                  _context6.next = 7;
                  break;
                }

                ids = ids.map(function (id) {
                  return pmongo.ObjectId(id);
                });

                _context6.next = 4;
                return this.db.collection(collectionName).remove({ _id: { $in: ids } });

              case 4:
                return _context6.abrupt('return', true);

              case 7:
                _context6.prev = 7;
                id = ids;
                _context6.next = 11;
                return this.db.collection(collectionName).remove({ '_id': new pmongo.ObjectId(id) });

              case 11:
                result = _context6.sent;
                return _context6.abrupt('return', result.n === 1);

              case 15:
                _context6.prev = 15;
                _context6.t0 = _context6['catch'](7);

                console.error(_context6.t0);
                return _context6.abrupt('return', false);

              case 19:
              case 'end':
                return _context6.stop();
            }
          }
        }, _callee6, this, [[7, 15]]);
      }));

      return function destroy(_x12, _x13) {
        return ref.apply(this, arguments);
      };
    })()
  }, {
    key: 'exists',
    value: (function () {
      var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee7(collectionName, id) {
        var item;
        return regeneratorRuntime.wrap(function _callee7$(_context7) {
          while (1) {
            switch (_context7.prev = _context7.next) {
              case 0:
                _context7.prev = 0;
                _context7.next = 3;
                return this.db.collection(collectionName).findOne({ '_id': new pmongo.ObjectId(id) });

              case 3:
                item = _context7.sent;
                return _context7.abrupt('return', item !== null);

              case 7:
                _context7.prev = 7;
                _context7.t0 = _context7['catch'](0);

                console.error(_context7.t0);
                return _context7.abrupt('return', false);

              case 11:
              case 'end':
                return _context7.stop();
            }
          }
        }, _callee7, this, [[0, 7]]);
      }));

      return function exists(_x14, _x15) {
        return ref.apply(this, arguments);
      };
    })()
  }, {
    key: 'count',
    value: (function () {
      var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee8(collectionName, where) {
        var count;
        return regeneratorRuntime.wrap(function _callee8$(_context8) {
          while (1) {
            switch (_context8.prev = _context8.next) {
              case 0:
                _context8.next = 2;
                return this.db.collection(collectionName).count(where);

              case 2:
                count = _context8.sent;
                return _context8.abrupt('return', count);

              case 4:
              case 'end':
                return _context8.stop();
            }
          }
        }, _callee8, this);
      }));

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
//# sourceMappingURL=mongo.js.map