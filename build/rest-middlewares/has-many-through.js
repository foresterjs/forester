"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.find = find;
exports.findOn = findOn;
exports.create = create;
exports.destroy = destroy;

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }

var ValidationFail = require('../validation-fail');

module.exports = function (rest, _ref) {
  var collections = _ref.collections;
  var collection = _ref.collection;
  var relation = _ref.relation;


  var foreignCollection = collections[relation.collection];
  var foreignKey = relation.foreignKey;
  var key = relation.key;
  var throughCollection = collections[relation.through];

  rest.registerEndpoint({
    action: "find",
    relation: relation.name,
    collectionName: collection.name,
    method: "get",
    route: '/:id/' + relation.name,
    middlewares: [collection.defender.acl("find", relation.name), find({
      collection: collection,
      foreignCollection: foreignCollection,
      throughCollection: throughCollection,
      key: key,
      foreignKey: foreignKey
    })],
    description: "find all " + relation.name + " about an " + collection.name
  });

  rest.registerEndpoint({
    action: "findOn",
    relation: relation.name,
    collectionName: collection.name,
    method: "get",
    route: '/:id/' + relation.name + '/:fk/',
    middlewares: [collection.defender.acl("findOn", relation.name), findOn({
      collection: collection,
      foreignCollection: foreignCollection,
      throughCollection: throughCollection,
      key: key,
      foreignKey: foreignKey
    })],
    description: "find all " + relation.name + " about an " + collection.name + " on a " + foreignCollection.name
  });

  rest.registerEndpoint({
    action: "create",
    relation: relation.name,
    collectionName: collection.name,
    method: "post",
    route: '/:id/' + relation.name + '/:fk',
    middlewares: [collection.defender.acl("create", relation.name), create({
      collection: collection,
      foreignCollection: foreignCollection,
      throughCollection: throughCollection,
      key: key,
      foreignKey: foreignKey
    })],
    description: "add a " + relation.name
  });

  rest.registerEndpoint({
    action: "destroy",
    relation: relation.name,
    collectionName: collection.name,
    method: "delete",
    route: '/:id/' + relation.name + '/:fk',
    middlewares: [collection.defender.acl("destroy", relation.name), destroy({
      collection: collection,
      foreignCollection: foreignCollection,
      throughCollection: throughCollection,
      key: key,
      foreignKey: foreignKey
    })],
    description: "remove all " + relation.name + " about an " + collection.name
  });
};

function find(_ref2) {
  var collection = _ref2.collection;
  var foreignCollection = _ref2.foreignCollection;
  var throughCollection = _ref2.throughCollection;
  var foreignKey = _ref2.foreignKey;
  var key = _ref2.key;

  return function () {
    var _ref3 = _asyncToGenerator(regeneratorRuntime.mark(function _callee(_ref4, next) {
      var request = _ref4.request;
      var response = _ref4.response;
      var params = _ref4.params;
      var id, items;
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              id = params.id;

              response.body = response.body || {};

              _context.next = 4;
              return throughCollection.findAll({
                where: _defineProperty({}, key, id)
              });

            case 4:
              items = _context.sent;


              response.body.done = true;
              response.body.data = items;

              _context.next = 9;
              return next();

            case 9:
            case "end":
              return _context.stop();
          }
        }
      }, _callee, this);
    }));

    return function (_x, _x2) {
      return _ref3.apply(this, arguments);
    };
  }();
}

function findOn(_ref5) {
  var collection = _ref5.collection;
  var foreignCollection = _ref5.foreignCollection;
  var throughCollection = _ref5.throughCollection;
  var foreignKey = _ref5.foreignKey;
  var key = _ref5.key;

  return function () {
    var _ref6 = _asyncToGenerator(regeneratorRuntime.mark(function _callee2(_ref7, next) {
      var _where2;

      var request = _ref7.request;
      var response = _ref7.response;
      var params = _ref7.params;
      var id, fk, items;
      return regeneratorRuntime.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              id = params.id;
              fk = params.fk;

              response.body = response.body || {};

              _context2.next = 5;
              return throughCollection.findAll({
                where: (_where2 = {}, _defineProperty(_where2, key, id), _defineProperty(_where2, foreignKey, fk), _where2)
              });

            case 5:
              items = _context2.sent;


              response.body.done = true;
              response.body.data = items;

              _context2.next = 10;
              return next();

            case 10:
            case "end":
              return _context2.stop();
          }
        }
      }, _callee2, this);
    }));

    return function (_x3, _x4) {
      return _ref6.apply(this, arguments);
    };
  }();
}

function create(_ref8) {
  var collection = _ref8.collection;
  var foreignCollection = _ref8.foreignCollection;
  var throughCollection = _ref8.throughCollection;
  var foreignKey = _ref8.foreignKey;
  var key = _ref8.key;

  return function () {
    var _ref9 = _asyncToGenerator(regeneratorRuntime.mark(function _callee3(_ref10, next) {
      var request = _ref10.request;
      var response = _ref10.response;
      var params = _ref10.params;
      var id, fk, data, existsItem, existsForeignItem, item;
      return regeneratorRuntime.wrap(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              id = params.id;
              fk = params.fk;
              data = request.body;

              response.body = response.body || {};

              _context3.next = 6;
              return collection.exists(id);

            case 6:
              existsItem = _context3.sent;
              _context3.next = 9;
              return foreignCollection.exists(fk);

            case 9:
              existsForeignItem = _context3.sent;

              if (!(!existsItem || !existsForeignItem)) {
                _context3.next = 16;
                break;
              }

              response.body.done = false;
              response.body.errors = ['not_found'];
              _context3.next = 15;
              return next();

            case 15:
              return _context3.abrupt("return");

            case 16:

              data[key] = id;
              data[foreignKey] = fk;

              _context3.prev = 18;
              _context3.next = 21;
              return throughCollection.create(data);

            case 21:
              item = _context3.sent;

              response.body.done = true;
              response.body.data = item;

              _context3.next = 26;
              return next();

            case 26:
              _context3.next = 37;
              break;

            case 28:
              _context3.prev = 28;
              _context3.t0 = _context3["catch"](18);

              if (!(_context3.t0 instanceof ValidationFail)) {
                _context3.next = 36;
                break;
              }

              response.body.errors = _context3.t0.errors;
              response.body.done = false;
              _context3.next = 35;
              return next();

            case 35:
              return _context3.abrupt("return");

            case 36:
              throw _context3.t0;

            case 37:
            case "end":
              return _context3.stop();
          }
        }
      }, _callee3, this, [[18, 28]]);
    }));

    return function (_x5, _x6) {
      return _ref9.apply(this, arguments);
    };
  }();
}

function destroy(_ref11) {
  var collection = _ref11.collection;
  var foreignCollection = _ref11.foreignCollection;
  var throughCollection = _ref11.throughCollection;
  var foreignKey = _ref11.foreignKey;
  var key = _ref11.key;

  return function () {
    var _ref12 = _asyncToGenerator(regeneratorRuntime.mark(function _callee4(_ref13, next) {
      var _where3;

      var request = _ref13.request;
      var response = _ref13.response;
      var params = _ref13.params;
      var id, fk, joinList, ids, result;
      return regeneratorRuntime.wrap(function _callee4$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              id = params.id;
              fk = params.fk;

              response.body = response.body || {};

              _context4.next = 5;
              return throughCollection.findAll({
                where: (_where3 = {}, _defineProperty(_where3, key, id), _defineProperty(_where3, foreignKey, fk), _where3)
              });

            case 5:
              joinList = _context4.sent;

              if (!(joinList.length === 0)) {
                _context4.next = 12;
                break;
              }

              response.body.done = false;
              response.body.errors = ['not_found'];
              _context4.next = 11;
              return next();

            case 11:
              return _context4.abrupt("return");

            case 12:
              ids = joinList.map(function (item) {
                return item.id;
              });
              _context4.next = 15;
              return throughCollection.destroy(ids);

            case 15:
              result = _context4.sent;

              response.body.done = result;

              _context4.next = 19;
              return next();

            case 19:
            case "end":
              return _context4.stop();
          }
        }
      }, _callee4, this);
    }));

    return function (_x7, _x8) {
      return _ref12.apply(this, arguments);
    };
  }();
}
//# sourceMappingURL=has-many-through.js.map