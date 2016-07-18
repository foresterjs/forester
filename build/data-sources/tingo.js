'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var tingodb = require('tingodb')();

var DataSourceTingoDB = function () {
  function DataSourceTingoDB(options) {
    _classCallCheck(this, DataSourceTingoDB);

    this.db = new tingodb.Db(options.path, options);
  }

  _createClass(DataSourceTingoDB, [{
    key: 'updateSchema',
    value: function () {
      var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(collectionName) {
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function updateSchema(_x) {
        return _ref.apply(this, arguments);
      }

      return updateSchema;
    }()
  }, {
    key: 'findAll',
    value: function () {
      var _ref2 = _asyncToGenerator(regeneratorRuntime.mark(function _callee2(collectionName) {
        var _this = this;

        var _ref3 = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

        var page = _ref3.page;
        var perPage = _ref3.perPage;
        var where = _ref3.where;
        var orderBy = _ref3.orderBy;
        var fields = _ref3.fields;
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                return _context2.abrupt('return', new Promise(function (resolve, reject) {
                  var cursor;

                  if (where) {
                    cursor = _this.db.collection(collectionName).find(DataSourceTingoDB.mongoWhere(where));
                  } else {
                    cursor = _this.db.collection(collectionName).find();
                  }

                  if (orderBy) {
                    cursor.sort(DataSourceTingoDB.mongoOrderBy(orderBy));
                  }

                  if (page && perPage) {
                    var skip = perPage * (page - 1);

                    cursor.limit(perPage);
                    cursor.skip(skip);
                  }

                  cursor.toArray(function (err, docs) {
                    if (!err) resolve(DataSourceTingoDB.unwrapId(docs));else reject(false);
                  });
                }));

              case 1:
              case 'end':
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function findAll(_x2, _x3) {
        return _ref2.apply(this, arguments);
      }

      return findAll;
    }()
  }, {
    key: 'pick',
    value: function () {
      var _ref4 = _asyncToGenerator(regeneratorRuntime.mark(function _callee3(collectionName, ids) {
        var _this2 = this;

        return regeneratorRuntime.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                if (!Array.isArray(ids)) {
                  _context3.next = 4;
                  break;
                }

                return _context3.abrupt('return', new Promise(function (resolve, reject) {

                  ids = ids.map(function (id) {
                    return new tingodb.ObjectID(id);
                  });

                  _this2.db.collection(collectionName).find({ _id: { $in: ids } }).toArray(function (err, data) {
                    if (!err) {
                      resolve(DataSourceTingoDB.unwrapId(data));
                    } else {
                      reject(false);
                    }
                  });
                }));

              case 4:
                return _context3.abrupt('return', new Promise(function (resolve, reject) {

                  var id = ids;
                  _this2.db.collection(collectionName).findOne({ _id: new tingodb.ObjectID(id) }, function (err, data) {
                    if (!err) {
                      resolve(data === null ? false : DataSourceTingoDB.unwrapId(data));
                    } else {
                      reject(false);
                    }
                  });
                }));

              case 5:
              case 'end':
                return _context3.stop();
            }
          }
        }, _callee3, this);
      }));

      function pick(_x5, _x6) {
        return _ref4.apply(this, arguments);
      }

      return pick;
    }()
  }, {
    key: 'create',
    value: function () {
      var _ref5 = _asyncToGenerator(regeneratorRuntime.mark(function _callee4(collectionName, data) {
        var _this3 = this;

        return regeneratorRuntime.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                return _context4.abrupt('return', new Promise(function (resolve, reject) {
                  _this3.db.collection(collectionName).insert(data, function (err, result) {
                    if (!err) resolve(DataSourceTingoDB.unwrapId(result));else reject(false);
                  });
                }));

              case 1:
              case 'end':
                return _context4.stop();
            }
          }
        }, _callee4, this);
      }));

      function create(_x7, _x8) {
        return _ref5.apply(this, arguments);
      }

      return create;
    }()
  }, {
    key: 'update',
    value: function () {
      var _ref6 = _asyncToGenerator(regeneratorRuntime.mark(function _callee5(collectionName, id, data) {
        var _this4 = this;

        return regeneratorRuntime.wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                return _context5.abrupt('return', new Promise(function (resolve, reject) {

                  _this4.db.collection(collectionName).findAndModify([{ _id: new tingodb.ObjectID(id) }], [['_id', 1]], { $set: data }, { 'new': true }, function (err, doc) {
                    if (!err) {
                      resolve(DataSourceTingoDB.unwrapId(doc));
                    } else {
                      reject(false);
                    }
                  });
                }));

              case 1:
              case 'end':
                return _context5.stop();
            }
          }
        }, _callee5, this);
      }));

      function update(_x9, _x10, _x11) {
        return _ref6.apply(this, arguments);
      }

      return update;
    }()
  }, {
    key: 'destroy',
    value: function () {
      var _ref7 = _asyncToGenerator(regeneratorRuntime.mark(function _callee6(collectionName, ids) {
        var _this5 = this;

        return regeneratorRuntime.wrap(function _callee6$(_context6) {
          while (1) {
            switch (_context6.prev = _context6.next) {
              case 0:
                if (!Array.isArray(ids)) {
                  _context6.next = 4;
                  break;
                }

                return _context6.abrupt('return', new Promise(function (resolve, reject) {

                  ids = ids.map(function (id) {
                    return tingodb.ObjectID(id);
                  });

                  _this5.db.collection(collectionName).remove({ _id: { $in: ids } }, function (err, data) {
                    if (!err) {
                      resolve(true);
                    } else {
                      reject(false);
                    }
                  });
                }));

              case 4:
                return _context6.abrupt('return', new Promise(function (resolve, reject) {

                  var id = ids;
                  _this5.db.collection(collectionName).remove({ _id: new tingodb.ObjectID(id) }, function (err, data) {
                    if (!err) {
                      resolve(data === 1);
                    } else {
                      reject(false);
                    }
                  });
                }));

              case 5:
              case 'end':
                return _context6.stop();
            }
          }
        }, _callee6, this);
      }));

      function destroy(_x12, _x13) {
        return _ref7.apply(this, arguments);
      }

      return destroy;
    }()
  }, {
    key: 'exists',
    value: function () {
      var _ref8 = _asyncToGenerator(regeneratorRuntime.mark(function _callee7(collectionName, id) {
        var _this6 = this;

        return regeneratorRuntime.wrap(function _callee7$(_context7) {
          while (1) {
            switch (_context7.prev = _context7.next) {
              case 0:
                return _context7.abrupt('return', new Promise(function (resolve, reject) {
                  _this6.db.collection(collectionName).findOne({ '_id': new tingodb.ObjectID(id) }, function (err, data) {
                    if (!err) resolve(data !== null);else reject(false);
                  });
                }));

              case 1:
              case 'end':
                return _context7.stop();
            }
          }
        }, _callee7, this);
      }));

      function exists(_x14, _x15) {
        return _ref8.apply(this, arguments);
      }

      return exists;
    }()
  }, {
    key: 'count',
    value: function () {
      var _ref9 = _asyncToGenerator(regeneratorRuntime.mark(function _callee8(collectionName, where) {
        var _this7 = this;

        return regeneratorRuntime.wrap(function _callee8$(_context8) {
          while (1) {
            switch (_context8.prev = _context8.next) {
              case 0:
                return _context8.abrupt('return', new Promise(function (resolve, reject) {
                  _this7.db.collection(collectionName).count(where, function (err, data) {
                    if (!err) resolve(data);else reject(false);
                  });
                }));

              case 1:
              case 'end':
                return _context8.stop();
            }
          }
        }, _callee8, this);
      }));

      function count(_x16, _x17) {
        return _ref9.apply(this, arguments);
      }

      return count;
    }()
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
        return docs.map(DataSourceTingoDB.unwrapId);
      }

      var doc = docs;
      doc.id = doc._id.toString();
      delete doc._id;
      return doc;
    }
  }]);

  return DataSourceTingoDB;
}();

module.exports = DataSourceTingoDB;
//# sourceMappingURL=tingo.js.map