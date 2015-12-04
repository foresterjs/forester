'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Collection = require('./collection');
var Rest = require('./rest');
var Defender = require('./defender');
var DataSourceMongo = require('./data-source-mongo');
var koa = require('koa');
const router = require('koa-simple-router');
const convert = require('koa-convert');
var serve = require('koa-static');
var mount = require('koa-mount');
var bodyParser = require('koa-bodyparser');
const qs = require('koa-qs');

let Forester = (function () {
  function Forester() {
    _classCallCheck(this, Forester);

    this.collections = {};
    this.dataSources = {};
    this.mappings = [];
    this.config = {};
    this.dataSourceDrivers = {
      'mongo': DataSourceMongo
    };

    this.koa = new koa();
    this.koa.use(bodyParser());
    qs(this.koa);
    this.rest = new Rest(this);
  }

  _createClass(Forester, [{
    key: 'registerDataSource',
    value: function registerDataSource(_ref) {
      let name = _ref.name;
      let adapter = _ref.adapter;
      let options = _ref.options;

      var driver = this.dataSourceDrivers[adapter];
      if (!driver) throw new Error(adapter + ' is not supported');

      return this.dataSources[name] = new driver(options);
    }
  }, {
    key: 'registerDataSources',
    value: function registerDataSources(datasources) {
      datasources.forEach(this.registerDataSource.bind(this));
    }
  }, {
    key: 'registerCollection',
    value: function registerCollection(collectionSchema) {
      return this.collections[collectionSchema.name] = new Collection({ collectionSchema });
    }
  }, {
    key: 'registerCollections',
    value: function registerCollections(collections) {
      collections.forEach(this.registerCollection.bind(this));
    }
  }, {
    key: 'registerMapping',
    value: function registerMapping(mapping) {
      this.mappings.push(mapping);
      return mapping;
    }
  }, {
    key: 'registerMappings',
    value: function registerMappings(mappings) {
      mappings.forEach(this.registerMapping.bind(this));
    }
  }, {
    key: 'registerStaticRoute',
    value: function registerStaticRoute(_ref2) {
      let route = _ref2.route;
      let path = _ref2.path;

      if (route) this.koa.use(convert(mount(route, serve(path))));else this.koa.use(convert(serve(path)));
    }
  }, {
    key: 'registerEndpoint',
    value: function registerEndpoint(options) {
      this.rest.registerEndpoint(options);
    }
  }, {
    key: 'registerConfig',
    value: function registerConfig(config) {
      for (var key in config) {
        this.config[key] = config[key];
      }
    }
  }, {
    key: 'registerCheckMethod',
    value: function registerCheckMethod(name, middleware) {

      Defender.registerCheckMethod(name, middleware);
    }
  }, {
    key: 'registerDataSourceDriver',
    value: function registerDataSourceDriver(name, driver) {
      this.dataSourceDrivers[name] = driver;
    }
  }, {
    key: 'initCollections',
    value: function initCollections() {
      var _this = this;

      this.mappings.forEach(function (_ref3) {
        let collection = _ref3.collection;
        let datasource = _ref3.datasource;

        var collectionObj = _this.collections[collection];
        var dataSourceObj = _this.dataSources[datasource];

        if (!collectionObj) throw new Error('Mapping err: Collection ' + collection + ' not defined or registered');
        if (!dataSourceObj) throw new Error('Mapping err: Datasource ' + datasource + ' not defined or registered');

        collectionObj.dataSource = dataSourceObj;
      });

      for (var collectionName in this.collections) {
        var collectionObj = this.collections[collectionName];
        if (!collectionObj.dataSource) {
          throw new Error('Collection err: Collection ' + collectionName + ' is not mapped to any datasource');
        }
      }
    }
  }, {
    key: 'boot',
    value: (function () {
      var ref = _asyncToGenerator(function* () {

        this.initCollections();
        this.rest.boot();

        this.koa.use(router(function (_) {
          _.get('/', (function () {
            var ref = _asyncToGenerator(function* (ctx, next) {
              ctx.body = ['Hello! This is Forester!'];
              yield next();
            });

            return function (_x, _x2) {
              return ref.apply(this, arguments);
            };
          })());
        }));

        console.log("Forester is ready!");
      });

      return function boot() {
        return ref.apply(this, arguments);
      };
    })()
  }, {
    key: 'use',
    value: function use(plugin) {
      plugin(this);
    }
  }, {
    key: 'listen',
    value: function listen(_ref4) {
      var _this2 = this;

      let port = _ref4.port;

      return new Promise(function (resolve, reject) {
        _this2.server = _this2.koa.listen(port, function (err) {
          if (err) {
            reject(err);
            return;
          }

          resolve();
        });
      });
    }
  }, {
    key: 'close',
    value: function close() {
      var _this3 = this;

      return new Promise(function (resolve, reject) {
        _this3.server.close(function (err) {
          if (err) {
            reject(err);
            return;
          }

          resolve();
        });
      });
    }
  }]);

  return Forester;
})();

module.exports = Forester;
//# sourceMappingURL=forester.js.map