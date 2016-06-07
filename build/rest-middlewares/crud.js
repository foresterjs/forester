"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.findAll = findAll;
exports.pick = pick;
exports.create = create;
exports.update = update;
exports.destroy = destroy;

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } step("next"); }); }; }

var commonMiddlewares = require('./common');
var ValidationFail = require('../validation-fail');

module.exports = function (rest, _ref) {
  var collection = _ref.collection;

  rest.registerEndpoint({
    action: "find",
    collectionName: collection.name,
    method: "get",
    route: "/",
    middlewares: [collection.defender.acl("find"), commonMiddlewares.showSchema({ collection: collection }), commonMiddlewares.showCount({ collection: collection }), commonMiddlewares.showPagesCount({ collection: collection }), commonMiddlewares.showUser({ collection: collection }), findAll({ collection: collection })],
    description: "find your elements"
  });

  rest.registerEndpoint({
    action: "pick",
    collectionName: collection.name,
    method: "get",
    route: "/:id",
    middlewares: [collection.defender.acl("pick"), commonMiddlewares.showSchema({ collection: collection }), pick({ collection: collection })],
    description: "find elements"
  });

  rest.registerEndpoint({
    action: "create",
    collectionName: collection.name,
    method: "post",
    route: "/",
    middlewares: [collection.defender.acl("create"), create({ collection: collection })],
    description: "create an element"
  });

  rest.registerEndpoint({
    action: "update",
    collectionName: collection.name,
    method: "put",
    route: "/:id",
    middlewares: [collection.defender.acl("update"), update({ collection: collection })],
    description: "update an element"
  });

  rest.registerEndpoint({
    action: "destroy",
    collectionName: collection.name,
    method: "delete",
    route: "/:id",
    middlewares: [collection.defender.acl("destroy"), destroy({ collection: collection })],
    description: "delete an element"
  });
};

function findAll(_ref2) {
  var collection = _ref2.collection;

  return (function () {
    var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(_ref3, next) {
      var request = _ref3.request;
      var response = _ref3.response;
      var options, items;
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              options = request.query;

              response.body = response.body || {};

              _context.next = 4;
              return collection.findAll(options);

            case 4:
              items = _context.sent;

              response.body.data = items;
              response.body.done = true;

              _context.next = 9;
              return next();

            case 9:
            case 'end':
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

  return (function () {
    var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee2(_ref5, next) {
      var request = _ref5.request;
      var response = _ref5.response;
      var params = _ref5.params;
      var id, include, item;
      return regeneratorRuntime.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              id = params.id;
              include = request.query.include || {};

              response.body = response.body || {};

              _context2.next = 5;
              return collection.pick(id, { include: include });

            case 5:
              item = _context2.sent;

              if (item) {
                response.body.data = item;
                response.body.done = true;
              } else {
                response.body.done = false;
                response.body.errors = ['not_found'];
              }

              _context2.next = 9;
              return next();

            case 9:
            case 'end':
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

  return (function () {
    var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee3(_ref7, next) {
      var request = _ref7.request;
      var response = _ref7.response;
      var data, item;
      return regeneratorRuntime.wrap(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              data = request.body;

              response.body = response.body || {};

              _context3.prev = 2;
              _context3.next = 5;
              return collection.create(data);

            case 5:
              item = _context3.sent;

              response.body.data = item;
              response.body.done = true;
              _context3.next = 10;
              return next();

            case 10:
              _context3.next = 21;
              break;

            case 12:
              _context3.prev = 12;
              _context3.t0 = _context3['catch'](2);

              if (!(_context3.t0 instanceof ValidationFail)) {
                _context3.next = 20;
                break;
              }

              response.body.errors = _context3.t0.errors;
              response.body.done = false;
              _context3.next = 19;
              return next();

            case 19:
              return _context3.abrupt('return');

            case 20:
              throw _context3.t0;

            case 21:
            case 'end':
              return _context3.stop();
          }
        }
      }, _callee3, this, [[2, 12]]);
    }));

    return function (_x5, _x6) {
      return ref.apply(this, arguments);
    };
  })();
}

function update(_ref8) {
  var collection = _ref8.collection;

  return (function () {
    var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee4(_ref9, next) {
      var request = _ref9.request;
      var response = _ref9.response;
      var params = _ref9.params;
      var id, data, item;
      return regeneratorRuntime.wrap(function _callee4$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              id = params.id;
              data = request.body;

              response.body = response.body || {};

              _context4.prev = 3;
              _context4.next = 6;
              return collection.update(id, data);

            case 6:
              item = _context4.sent;

              if (item) {
                response.body.data = item;
                response.body.done = true;
              } else {
                response.body.done = false;
                response.body.errors = ['not_found'];
              }

              _context4.next = 10;
              return next();

            case 10:
              _context4.next = 21;
              break;

            case 12:
              _context4.prev = 12;
              _context4.t0 = _context4['catch'](3);

              if (!(_context4.t0 instanceof ValidationFail)) {
                _context4.next = 20;
                break;
              }

              response.body.errors = _context4.t0.errors;
              response.body.done = false;
              _context4.next = 19;
              return next();

            case 19:
              return _context4.abrupt('return');

            case 20:
              throw _context4.t0;

            case 21:
            case 'end':
              return _context4.stop();
          }
        }
      }, _callee4, this, [[3, 12]]);
    }));

    return function (_x7, _x8) {
      return ref.apply(this, arguments);
    };
  })();
}

function destroy(_ref10) {
  var collection = _ref10.collection;

  return (function () {
    var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee5(_ref11, next) {
      var request = _ref11.request;
      var response = _ref11.response;
      var params = _ref11.params;
      var id, result;
      return regeneratorRuntime.wrap(function _callee5$(_context5) {
        while (1) {
          switch (_context5.prev = _context5.next) {
            case 0:
              id = params.id;

              response.body = response.body || {};

              _context5.next = 4;
              return collection.destroy(id);

            case 4:
              result = _context5.sent;

              response.body.done = result;

              if (!result) response.body.errors = ['not_found'];

              _context5.next = 9;
              return next();

            case 9:
            case 'end':
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
//# sourceMappingURL=crud.js.map