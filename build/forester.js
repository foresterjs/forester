'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Collection = require('./collection');
var Rest = require('./rest');
var Defender = require('./defender');
var DataSourceMongo = require('./data-source-mongo');
var koa = require('koa');
var router = require('koa-simple-router');
var convert = require('koa-convert');
var serve = require('koa-static');
var mount = require('koa-mount');
var bodyParser = require('koa-bodyparser');
var qs = require('koa-qs');
var assert = require("assert");
var compose = require("koa-compose");
var koaSend = require("koa-send");

var Forester = (function () {
  function Forester() {
    _classCallCheck(this, Forester);

    this.collections = {};
    this.dataSources = {};
    this.mappings = [];
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
      var name = _ref.name;
      var adapter = _ref.adapter;
      var options = _ref.options;

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
      return this.collections[collectionSchema.name] = new Collection({ collectionSchema: collectionSchema });
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
      var _ref2$route = _ref2.route;
      var route = _ref2$route === undefined ? "/" : _ref2$route;
      var path = _ref2.path;
      var failback = _ref2.failback;

      assert(path, "Path not defined");

      var failbackMiddleware = convert(regeneratorRuntime.mark(function _callee() {
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                if (!this.body) {
                  _context.next = 2;
                  break;
                }

                return _context.abrupt('return');

              case 2:
                _context.prev = 2;
                _context.next = 5;
                return koaSend(this, failback, { root: path });

              case 5:
                _context.next = 10;
                break;

              case 7:
                _context.prev = 7;
                _context.t0 = _context['catch'](2);

                console.log(_context.t0);

              case 10:
                console.log(this.body);

              case 11:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this, [[2, 7]]);
      }));

      var serveMiddleware = convert(serve(path));

      if (failback) {
        this.koa.use(mount(route, compose([serveMiddleware, failbackMiddleware])));
      } else {
        this.koa.use(mount(route, serveMiddleware));
      }
    }
  }, {
    key: 'registerEndpoint',
    value: function registerEndpoint(options) {
      this.rest.registerEndpoint(options);
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
        var collection = _ref3.collection;
        var datasource = _ref3.datasource;

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
      var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee3() {
        return regeneratorRuntime.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:

                this.initCollections();
                this.rest.boot();

                this.koa.use(router(function (_) {
                  _.get('/', (function () {
                    var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee2(ctx, next) {
                      return regeneratorRuntime.wrap(function _callee2$(_context2) {
                        while (1) {
                          switch (_context2.prev = _context2.next) {
                            case 0:
                              ctx.body = ['Hello! This is Forester!'];
                              _context2.next = 3;
                              return next();

                            case 3:
                            case 'end':
                              return _context2.stop();
                          }
                        }
                      }, _callee2, this);
                    }));

                    return function (_x, _x2) {
                      return ref.apply(this, arguments);
                    };
                  })());
                }));

                console.log("Forester is ready!");

              case 4:
              case 'end':
                return _context3.stop();
            }
          }
        }, _callee3, this);
      }));

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

      var port = _ref4.port;

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