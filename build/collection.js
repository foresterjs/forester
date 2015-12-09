'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _validator = require('./validator');

var _validator2 = _interopRequireDefault(_validator);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var EventEmitter = require('events');
var Sanitizer = require('./sanitizer');
var Defender = require('./defender');

var Collection = (function () {
  function Collection(_ref) {
    var dataSource = _ref.dataSource;
    var collectionSchema = _ref.collectionSchema;

    _classCallCheck(this, Collection);

    this.defaults = {
      page: 1,
      perPage: 20
    };

    this.dataSource = dataSource;
    this.collectionSchema = collectionSchema;
    this.eventEmitter = new EventEmitter();

    this.sanitizer = new Sanitizer(this.schema.properties);
    this.validator = new _validator2.default(this.schema.properties);
    this.defender = new Defender(this);
  }

  _createClass(Collection, [{
    key: 'addMethod',
    value: function addMethod(name, handler) {
      this[name] = handler.bind(this);
    }
  }, {
    key: 'findAll',
    value: (function () {
      var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(_ref2) {
        var where = _ref2.where;
        var orderBy = _ref2.orderBy;
        var columns = _ref2.columns;
        var page = _ref2.page;
        var perPage = _ref2.perPage;
        var options,
            items,
            _args = arguments;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                options = _args[0];

                options.page = options.page || this.defaults.page;
                options.perPage = options.perPage || this.defaults.perPage;

                this.eventEmitter.emit('findAll:before', options);
                _context.next = 6;
                return this.dataSource.findAll(this.name, options);

              case 6:
                items = _context.sent;

                this.eventEmitter.emit('findAll:after', options, items);

                return _context.abrupt('return', items);

              case 9:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      return function findAll(_x) {
        return ref.apply(this, arguments);
      };
    })()
  }, {
    key: 'pick',
    value: (function () {
      var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee2(id) {
        var item;
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                this.eventEmitter.emit('pick:before', id);
                _context2.next = 3;
                return this.dataSource.pick(this.name, id);

              case 3:
                item = _context2.sent;

                this.eventEmitter.emit('pick:after', id, item);

                return _context2.abrupt('return', item);

              case 6:
              case 'end':
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      return function pick(_x2) {
        return ref.apply(this, arguments);
      };
    })()
  }, {
    key: 'create',
    value: (function () {
      var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee3(data) {
        var validation, item;
        return regeneratorRuntime.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:

                this.eventEmitter.emit('create:before', data);
                _context3.next = 3;
                return this.sanitizer.sanitize(data);

              case 3:
                data = _context3.sent;
                _context3.next = 6;
                return this.validator.validate(data);

              case 6:
                validation = _context3.sent;

                if (!validation) {
                  _context3.next = 13;
                  break;
                }

                _context3.next = 10;
                return this.dataSource.create(this.name, data);

              case 10:
                item = _context3.sent;

                this.eventEmitter.emit('create:after', data, item);
                return _context3.abrupt('return', item);

              case 13:
              case 'end':
                return _context3.stop();
            }
          }
        }, _callee3, this);
      }));

      return function create(_x3) {
        return ref.apply(this, arguments);
      };
    })()
  }, {
    key: 'update',
    value: (function () {
      var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee4(id, data) {
        var validation, item;
        return regeneratorRuntime.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:

                this.eventEmitter.emit('update:before', data);
                _context4.next = 3;
                return this.sanitizer.sanitize(data);

              case 3:
                data = _context4.sent;
                _context4.next = 6;
                return this.validator.validate(data);

              case 6:
                validation = _context4.sent;

                if (!validation) {
                  _context4.next = 13;
                  break;
                }

                _context4.next = 10;
                return this.dataSource.update(this.name, id, data);

              case 10:
                item = _context4.sent;

                this.eventEmitter.emit('update:after', data, item);
                return _context4.abrupt('return', item);

              case 13:
              case 'end':
                return _context4.stop();
            }
          }
        }, _callee4, this);
      }));

      return function update(_x4, _x5) {
        return ref.apply(this, arguments);
      };
    })()
  }, {
    key: 'destroy',
    value: (function () {
      var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee5(id) {
        var result;
        return regeneratorRuntime.wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:

                this.eventEmitter.emit('destroy:before', id);
                _context5.next = 3;
                return this.dataSource.destroy(this.name, id);

              case 3:
                result = _context5.sent;

                this.eventEmitter.emit('destroy:after', id, result);
                return _context5.abrupt('return', result);

              case 6:
              case 'end':
                return _context5.stop();
            }
          }
        }, _callee5, this);
      }));

      return function destroy(_x6) {
        return ref.apply(this, arguments);
      };
    })()
  }, {
    key: 'exists',
    value: (function () {
      var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee6(id) {
        var exists;
        return regeneratorRuntime.wrap(function _callee6$(_context6) {
          while (1) {
            switch (_context6.prev = _context6.next) {
              case 0:
                this.eventEmitter.emit('exists:before', id);
                _context6.next = 3;
                return this.dataSource.exists(this.name, id);

              case 3:
                exists = _context6.sent;

                this.eventEmitter.emit('exists:after', id, exists);
                return _context6.abrupt('return', exists);

              case 6:
              case 'end':
                return _context6.stop();
            }
          }
        }, _callee6, this);
      }));

      return function exists(_x7) {
        return ref.apply(this, arguments);
      };
    })()
  }, {
    key: 'count',
    value: (function () {
      var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee7() {
        var where = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
        var count;
        return regeneratorRuntime.wrap(function _callee7$(_context7) {
          while (1) {
            switch (_context7.prev = _context7.next) {
              case 0:
                _context7.next = 2;
                return this.dataSource.count(this.name, where);

              case 2:
                count = _context7.sent;
                return _context7.abrupt('return', count);

              case 4:
              case 'end':
                return _context7.stop();
            }
          }
        }, _callee7, this);
      }));

      return function count(_x8) {
        return ref.apply(this, arguments);
      };
    })()
  }, {
    key: 'bulkUpdate',
    value: (function () {
      var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee8(change, where) {
        return regeneratorRuntime.wrap(function _callee8$(_context8) {
          while (1) {
            switch (_context8.prev = _context8.next) {
              case 0:
              case 'end':
                return _context8.stop();
            }
          }
        }, _callee8, this);
      }));

      return function bulkUpdate(_x10, _x11) {
        return ref.apply(this, arguments);
      };
    })()
  }, {
    key: 'bulkDestroy',

    //TODO
    value: (function () {
      var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee9(where) {
        return regeneratorRuntime.wrap(function _callee9$(_context9) {
          while (1) {
            switch (_context9.prev = _context9.next) {
              case 0:
              case 'end':
                return _context9.stop();
            }
          }
        }, _callee9, this);
      }));

      return function bulkDestroy(_x12) {
        return ref.apply(this, arguments);
      };
    })()
  }, {
    key: 'on',

    //TODO
    value: function on(event, callback) {
      this.eventEmitter.on(event, callback);
    }
  }, {
    key: 'name',
    get: function get() {
      return this.collectionSchema.name;
    }
  }, {
    key: 'schema',
    get: function get() {
      return this.collectionSchema;
    }
  }]);

  return Collection;
})();

module.exports = Collection;
//# sourceMappingURL=collection.js.map