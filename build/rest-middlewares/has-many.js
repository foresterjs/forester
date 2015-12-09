"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.find = find;
exports.pick = pick;
exports.create = create;
exports.update = update;
exports.destroy = destroy;

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } step("next"); }); }; }

var ValidationFail = require('../validation-fail');

module.exports = function (rest, _ref) {
  var collections = _ref.collections;
  var collection = _ref.collection;
  var relation = _ref.relation;

  var foreignCollection = collections[relation.collection];
  var foreignKey = relation.foreignKey;

  rest.registerEndpoint({
    action: "find",
    relation: relation.name,
    collectionName: collection.name,
    method: "get",
    route: "/:id/" + relation.name,
    middlewares: [collection.defender.acl("find", relation.name), find({ collection: collection, foreignCollection: foreignCollection, foreignKey: foreignKey })],
    description: "get " + relation.name
  });

  rest.registerEndpoint({
    action: "pick",
    relation: relation.name,
    collectionName: collection.name,
    method: "get",
    route: '/:id/' + relation.name + '/:fk',
    middlewares: [collection.defender.acl("pick", relation.name), pick({ collection: collection, foreignCollection: foreignCollection, foreignKey: foreignKey })],
    description: "get " + relation.name
  });

  rest.registerEndpoint({
    action: "create",
    relation: relation.name,
    collectionName: collection.name,
    method: "post",
    route: '/:id/' + relation.name,
    middlewares: [collection.defender.acl("create", relation.name), create({ collection: collection, foreignCollection: foreignCollection, foreignKey: foreignKey })],
    description: "create " + relation.name
  });

  rest.registerEndpoint({
    action: "update",
    relation: relation.name,
    collectionName: collection.name,
    method: "put",
    route: '/:id/' + relation.name + '/:fk',
    middlewares: [collection.defender.acl("update", relation.name), update({ collection: collection, foreignCollection: foreignCollection, foreignKey: foreignKey })],
    description: "create " + relation.name
  });

  rest.registerEndpoint({
    action: "destroy",
    relation: relation.name,
    collectionName: collection.name,
    method: "delete",
    route: '/:id/' + relation.name + '/:fk',
    middlewares: [collection.defender.acl("destroy", relation.name), destroy({ collection: collection, foreignCollection: foreignCollection, foreignKey: foreignKey })],
    description: "destroy " + relation.name
  });
};

function find(_ref2) {
  var collection = _ref2.collection;
  var foreignCollection = _ref2.foreignCollection;
  var foreignKey = _ref2.foreignKey;

  return (function () {
    var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(_ref3, next) {
      var request = _ref3.request;
      var response = _ref3.response;
      var params = _ref3.params;
      var id, options, items;
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              id = params.id;
              options = request.query;

              response.body = response.body || {};

              options.where = options.where || {};
              options.where[foreignKey] = id;

              _context.next = 7;
              return foreignCollection.findAll(options);

            case 7:
              items = _context.sent;

              response.body.data = items;
              response.body.done = true;

              _context.next = 12;
              return next();

            case 12:
            case "end":
              return _context.stop();
          }
        }
      }, _callee, this);
    }));

    return function (_x, _x2) {
      return ref.apply(this, arguments);
    };
  })();
}

function pick(_ref4) {
  var collection = _ref4.collection;
  var foreignCollection = _ref4.foreignCollection;
  var foreignKey = _ref4.foreignKey;

  return (function () {
    var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee2(_ref5, next) {
      var request = _ref5.request;
      var response = _ref5.response;
      var params = _ref5.params;
      var id, fk, item;
      return regeneratorRuntime.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              id = params.id;
              fk = params.fk;

              response.body = response.body || {};

              _context2.next = 5;
              return foreignCollection.pick(fk);

            case 5:
              item = _context2.sent;

              if (item && item[foreignKey] === id) {
                response.body.data = item;
                response.body.done = true;
              } else {
                response.body.done = false;
                response.body.errors = ['not_found'];
              }

              _context2.next = 9;
              return next();

            case 9:
            case "end":
              return _context2.stop();
          }
        }
      }, _callee2, this);
    }));

    return function (_x3, _x4) {
      return ref.apply(this, arguments);
    };
  })();
}

function create(_ref6) {
  var collection = _ref6.collection;
  var foreignCollection = _ref6.foreignCollection;
  var foreignKey = _ref6.foreignKey;

  return (function () {
    var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee3(_ref7, next) {
      var request = _ref7.request;
      var response = _ref7.response;
      var params = _ref7.params;
      var id, data, item;
      return regeneratorRuntime.wrap(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              id = params.id;
              data = request.body;

              response.body = response.body || {};

              data[foreignKey] = id;

              _context3.prev = 4;
              _context3.next = 7;
              return foreignCollection.create(data);

            case 7:
              item = _context3.sent;

              if (item) {
                response.body.data = item;
                response.body.done = true;
              } else {
                response.body.done = false;
                response.body.errors = ['not_saved'];
              }

              _context3.next = 11;
              return next();

            case 11:
              _context3.next = 22;
              break;

            case 13:
              _context3.prev = 13;
              _context3.t0 = _context3["catch"](4);

              if (!(_context3.t0 instanceof ValidationFail)) {
                _context3.next = 21;
                break;
              }

              response.body.errors = _context3.t0.errors;
              response.body.done = false;
              _context3.next = 20;
              return next();

            case 20:
              return _context3.abrupt("return");

            case 21:
              throw _context3.t0;

            case 22:
            case "end":
              return _context3.stop();
          }
        }
      }, _callee3, this, [[4, 13]]);
    }));

    return function (_x5, _x6) {
      return ref.apply(this, arguments);
    };
  })();
}

function update(_ref8) {
  var collection = _ref8.collection;
  var foreignCollection = _ref8.foreignCollection;
  var foreignKey = _ref8.foreignKey;

  return (function () {
    var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee4(_ref9, next) {
      var request = _ref9.request;
      var response = _ref9.response;
      var params = _ref9.params;
      var id, fk, data, item;
      return regeneratorRuntime.wrap(function _callee4$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              id = params.id;
              fk = params.fk;
              data = request.body;

              response.body = response.body || {};

              data[foreignKey] = id;

              //check
              _context4.next = 7;
              return foreignCollection.pick(fk);

            case 7:
              item = _context4.sent;

              if (!(!item[foreignKey] === id)) {
                _context4.next = 14;
                break;
              }

              request.body.done = false;
              request.body.errors = ['not_found', 'not_saved'];
              _context4.next = 13;
              return next();

            case 13:
              return _context4.abrupt("return");

            case 14:
              _context4.prev = 14;
              _context4.next = 17;
              return foreignCollection.update(fk, data);

            case 17:
              item = _context4.sent;

              if (item) {
                response.body.data = item;
                response.body.done = true;
              } else {
                response.body.done = false;
                response.body.errors = ['not_saved'];
              }
              _context4.next = 21;
              return next();

            case 21:
              _context4.next = 32;
              break;

            case 23:
              _context4.prev = 23;
              _context4.t0 = _context4["catch"](14);

              if (!(_context4.t0 instanceof ValidationFail)) {
                _context4.next = 31;
                break;
              }

              response.body.errors = _context4.t0.errors;
              response.body.done = false;
              _context4.next = 30;
              return next();

            case 30:
              return _context4.abrupt("return");

            case 31:
              throw _context4.t0;

            case 32:
            case "end":
              return _context4.stop();
          }
        }
      }, _callee4, this, [[14, 23]]);
    }));

    return function (_x7, _x8) {
      return ref.apply(this, arguments);
    };
  })();
}

function destroy(_ref10) {
  var collection = _ref10.collection;
  var foreignCollection = _ref10.foreignCollection;
  var foreignKey = _ref10.foreignKey;

  return (function () {
    var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee5(_ref11, next) {
      var request = _ref11.request;
      var response = _ref11.response;
      var params = _ref11.params;
      var id, fk, item, result;
      return regeneratorRuntime.wrap(function _callee5$(_context5) {
        while (1) {
          switch (_context5.prev = _context5.next) {
            case 0:
              id = params.id;
              fk = params.fk;

              response.body = response.body || {};

              //check
              _context5.next = 5;
              return foreignCollection.pick(fk);

            case 5:
              item = _context5.sent;

              if (item && item[foreignKey] === id) {
                _context5.next = 12;
                break;
              }

              response.body.done = false;
              response.body.errors = ['not_found'];
              _context5.next = 11;
              return next();

            case 11:
              return _context5.abrupt("return");

            case 12:
              _context5.next = 14;
              return foreignCollection.destroy(fk);

            case 14:
              result = _context5.sent;

              response.body.done = result;
              _context5.next = 18;
              return next();

            case 18:
            case "end":
              return _context5.stop();
          }
        }
      }, _callee5, this);
    }));

    return function (_x9, _x10) {
      return ref.apply(this, arguments);
    };
  })();
}
//# sourceMappingURL=has-many.js.map