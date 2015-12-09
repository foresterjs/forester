"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.get = get;

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } step("next"); }); }; }

module.exports = function (rest, _ref) {
  var collections = _ref.collections;
  var collection = _ref.collection;
  var relation = _ref.relation;

  var foreignCollection = collections[relation.collection];
  var foreignKey = relation.foreignKey;

  rest.registerEndpoint({
    action: "pick",
    relation: relation.name,
    collectionName: collection.name,
    method: "get",
    route: "/:id/" + relation.name,
    middlewares: [collection.defender.acl("pick", relation.name), get({ collection: collection, foreignCollection: foreignCollection, foreignKey: foreignKey })],
    description: "pick " + relation.name
  });
};

function get(_ref2) {
  var collection = _ref2.collection;
  var foreignCollection = _ref2.foreignCollection;
  var foreignKey = _ref2.foreignKey;

  return (function () {
    var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(_ref3, next) {
      var request = _ref3.request;
      var response = _ref3.response;
      var params = _ref3.params;
      var id, item, foreignId, foreignItem;
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              id = params.id;

              response.body = response.body || {};

              //pick obj
              _context.next = 4;
              return collection.pick(id);

            case 4:
              item = _context.sent;

              if (item) {
                _context.next = 11;
                break;
              }

              response.body.done = false;
              response.body.errors = ['not_found'];
              _context.next = 10;
              return next();

            case 10:
              return _context.abrupt("return");

            case 11:

              //check
              foreignId = item[foreignKey];

              if (foreignId) {
                _context.next = 18;
                break;
              }

              response.body.done = false;
              response.body.errors = ['not_found'];
              _context.next = 17;
              return next();

            case 17:
              return _context.abrupt("return");

            case 18:
              _context.next = 20;
              return foreignCollection.pick(foreignId);

            case 20:
              foreignItem = _context.sent;

              if (foreignItem) {
                response.body.done = true;
                response.body.data = foreignItem;
              } else {
                response.body.done = false;
                response.body.errors = ['not_found'];
              }

            case 22:
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
//# sourceMappingURL=belongs-to.js.map