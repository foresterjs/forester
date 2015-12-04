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

let Collection = (function () {
  function Collection(_ref) {
    let dataSource = _ref.dataSource;
    let collectionSchema = _ref.collectionSchema;

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
      var ref = _asyncToGenerator(function* (_ref2) {
        let where = _ref2.where;
        let orderBy = _ref2.orderBy;
        let columns = _ref2.columns;
        let page = _ref2.page;
        let perPage = _ref2.perPage;

        var options = arguments[0];

        options.page = options.page || this.defaults.page;
        options.perPage = options.perPage || this.defaults.perPage;

        this.eventEmitter.emit('findAll:before', options);
        var items = yield this.dataSource.findAll(this.name, options);
        this.eventEmitter.emit('findAll:after', options, items);

        return items;
      });

      return function findAll(_x) {
        return ref.apply(this, arguments);
      };
    })()
  }, {
    key: 'pick',
    value: (function () {
      var ref = _asyncToGenerator(function* (id) {
        this.eventEmitter.emit('pick:before', id);
        var item = yield this.dataSource.pick(this.name, id);
        this.eventEmitter.emit('pick:after', id, item);

        return item;
      });

      return function pick(_x2) {
        return ref.apply(this, arguments);
      };
    })()
  }, {
    key: 'create',
    value: (function () {
      var ref = _asyncToGenerator(function* (data) {

        this.eventEmitter.emit('create:before', data);
        data = yield this.sanitizer.sanitize(data);

        var validation = yield this.validator.validate(data);

        if (validation) {
          var item = yield this.dataSource.create(this.name, data);
          this.eventEmitter.emit('create:after', data, item);
          return item;
        }
      });

      return function create(_x3) {
        return ref.apply(this, arguments);
      };
    })()
  }, {
    key: 'update',
    value: (function () {
      var ref = _asyncToGenerator(function* (id, data) {

        this.eventEmitter.emit('update:before', data);
        data = yield this.sanitizer.sanitize(data);

        var validation = yield this.validator.validate(data);

        if (validation) {
          var item = yield this.dataSource.update(this.name, id, data);
          this.eventEmitter.emit('update:after', data, item);
          return item;
        }
      });

      return function update(_x4, _x5) {
        return ref.apply(this, arguments);
      };
    })()
  }, {
    key: 'destroy',
    value: (function () {
      var ref = _asyncToGenerator(function* (id) {

        this.eventEmitter.emit('destroy:before', id);
        var result = yield this.dataSource.destroy(this.name, id);
        this.eventEmitter.emit('destroy:after', id, result);
        return result;
      });

      return function destroy(_x6) {
        return ref.apply(this, arguments);
      };
    })()
  }, {
    key: 'exists',
    value: (function () {
      var ref = _asyncToGenerator(function* (id) {
        this.eventEmitter.emit('exists:before', id);
        var exists = yield this.dataSource.exists(this.name, id);
        this.eventEmitter.emit('exists:after', id, exists);
        return exists;
      });

      return function exists(_x7) {
        return ref.apply(this, arguments);
      };
    })()
  }, {
    key: 'count',
    value: (function () {
      var ref = _asyncToGenerator(function* () {
        let where = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

        var count = yield this.dataSource.count(this.name, where);
        return count;
      });

      return function count(_x8) {
        return ref.apply(this, arguments);
      };
    })()
  }, {
    key: 'bulkUpdate',
    value: (function () {
      var ref = _asyncToGenerator(function* (change, where) {
        //TODO
      });

      return function bulkUpdate(_x10, _x11) {
        return ref.apply(this, arguments);
      };
    })()
  }, {
    key: 'bulkDestroy',
    value: (function () {
      var ref = _asyncToGenerator(function* (where) {
        //TODO
      });

      return function bulkDestroy(_x12) {
        return ref.apply(this, arguments);
      };
    })()
  }, {
    key: 'on',
    value: function on(event, callback) {
      this.eventEmitter.on(event, callback);
    }
  }, {
    key: 'name',
    get: function () {
      return this.collectionSchema.name;
    }
  }, {
    key: 'schema',
    get: function () {
      return this.collectionSchema;
    }
  }]);

  return Collection;
})();

module.exports = Collection;
//# sourceMappingURL=collection.js.map