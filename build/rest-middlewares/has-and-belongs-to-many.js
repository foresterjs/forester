"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.find = find;
exports.addAssociation = addAssociation;
exports.destroyAssociation = destroyAssociation;

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } step("next"); }); }; }

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
    description: "find all " + relation.name
  });

  rest.registerEndpoint({
    action: "addAssociation",
    relation: relation.name,
    collectionName: collection.name,
    method: "post",
    route: '/:id/' + relation.name + '/:fk',
    middlewares: [collection.defender.acl("addAssociation", relation.name), addAssociation({
      collection: collection,
      foreignCollection: foreignCollection,
      throughCollection: throughCollection,
      key: key,
      foreignKey: foreignKey
    })],
    description: "add association with " + relation.name
  });

  rest.registerEndpoint({
    action: "destroyAssociation",
    relation: relation.name,
    collectionName: collection.name,
    method: "delete",
    route: '/:id/' + relation.name + '/:fk',
    middlewares: [collection.defender.acl("destroyAssociation", relation.name), destroyAssociation({
      collection: collection,
      foreignCollection: foreignCollection,
      throughCollection: throughCollection,
      key: key,
      foreignKey: foreignKey
    })],
    description: "remove association with " + relation.name
  });
};

function find(_ref2) {
  var collection = _ref2.collection;
  var foreignCollection = _ref2.foreignCollection;
  var throughCollection = _ref2.throughCollection;
  var foreignKey = _ref2.foreignKey;
  var key = _ref2.key;

  return (function () {
    var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(_ref3, next) {
      var request = _ref3.request;
      var response = _ref3.response;
      var params = _ref3.params;
      var id, joinList, ids, items;
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              id = params.id;

              response.body = response.body || {};

              //TODO add check not found

              _context.next = 4;
              return throughCollection.findAll({
                where: _defineProperty({}, key, id)
              });

            case 4:
              joinList = _context.sent;
              ids = joinList.map(function (item) {
                return item[foreignKey];
              });
              _context.next = 8;
              return foreignCollection.pick(ids);

            case 8:
              items = _context.sent;

              response.body.data = items;
              response.body.done = true;

              _context.next = 13;
              return next();

            case 13:
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

function addAssociation(_ref4) {
  var collection = _ref4.collection;
  var foreignCollection = _ref4.foreignCollection;
  var throughCollection = _ref4.throughCollection;
  var foreignKey = _ref4.foreignKey;
  var key = _ref4.key;

  return (function () {
    var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee2(_ref5, next) {
      var _where2, _throughCollection$cr;

      var request = _ref5.request;
      var response = _ref5.response;
      var params = _ref5.params;
      var id, fk, existsItem, existsForeignItem, joinList, item;
      return regeneratorRuntime.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              id = params.id;
              fk = params.fk;

              response.body = response.body || {};

              _context2.next = 5;
              return collection.exists(id);

            case 5:
              existsItem = _context2.sent;
              _context2.next = 8;
              return foreignCollection.exists(fk);

            case 8:
              existsForeignItem = _context2.sent;

              if (!(!existsItem || !existsForeignItem)) {
                _context2.next = 15;
                break;
              }

              response.body.done = false;
              response.body.errors = ['not_found'];
              _context2.next = 14;
              return next();

            case 14:
              return _context2.abrupt("return");

            case 15:
              _context2.next = 17;
              return throughCollection.findAll({
                where: (_where2 = {}, _defineProperty(_where2, key, id), _defineProperty(_where2, foreignKey, fk), _where2)
              });

            case 17:
              joinList = _context2.sent;

              if (!(joinList.length > 0)) {
                _context2.next = 24;
                break;
              }

              response.body.done = false;
              response.body.errors = ['too_many'];
              _context2.next = 23;
              return next();

            case 23:
              return _context2.abrupt("return");

            case 24:
              _context2.next = 26;
              return throughCollection.create((_throughCollection$cr = {}, _defineProperty(_throughCollection$cr, key, id), _defineProperty(_throughCollection$cr, foreignKey, fk), _throughCollection$cr));

            case 26:
              item = _context2.sent;

              response.body.data = item;
              response.body.done = true;

              _context2.next = 31;
              return next();

            case 31:
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

function destroyAssociation(_ref6) {
  var collection = _ref6.collection;
  var foreignCollection = _ref6.foreignCollection;
  var throughCollection = _ref6.throughCollection;
  var foreignKey = _ref6.foreignKey;
  var key = _ref6.key;

  return (function () {
    var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee3(_ref7, next) {
      var _where3;

      var request = _ref7.request;
      var response = _ref7.response;
      var params = _ref7.params;
      var id, fk, joinList, ids, result;
      return regeneratorRuntime.wrap(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              id = params.id;
              fk = params.fk;

              response.body = response.body || {};

              _context3.next = 5;
              return throughCollection.findAll({
                where: (_where3 = {}, _defineProperty(_where3, key, id), _defineProperty(_where3, foreignKey, fk), _where3)
              });

            case 5:
              joinList = _context3.sent;

              if (!(joinList.length === 0)) {
                _context3.next = 12;
                break;
              }

              response.body.done = false;
              response.body.errors = ['not_found'];
              _context3.next = 11;
              return next();

            case 11:
              return _context3.abrupt("return");

            case 12:
              ids = joinList.map(function (item) {
                return item.id;
              });
              _context3.next = 15;
              return throughCollection.destroy(ids);

            case 15:
              result = _context3.sent;

              response.body.done = result;

              return _context3.abrupt("return", next);

            case 18:
            case "end":
              return _context3.stop();
          }
        }
      }, _callee3, this);
    }));

    return function (_x5, _x6) {
      return ref.apply(this, arguments);
    };
  })();
}
//# sourceMappingURL=has-and-belongs-to-many.js.map