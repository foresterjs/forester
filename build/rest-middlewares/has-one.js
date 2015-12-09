"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.pick = pick;

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
    route: '/:id/' + relation.name,
    middlewares: [collection.defender.acl("pick", relation.name), pick({ collection: collection, foreignCollection: foreignCollection, foreignKey: foreignKey })],
    description: "find " + collection.name
  });
};

function pick(_ref2) {
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

              if (!(items.length === 0)) {
                _context.next = 14;
                break;
              }

              response.body.done = false;
              response.body.errors = ['not_found'];
              _context.next = 13;
              return next();

            case 13:
              return _context.abrupt("return");

            case 14:
              if (!(items.length > 1)) {
                _context.next = 20;
                break;
              }

              response.body.done = false;
              response.body.errors = ['too_many'];
              _context.next = 19;
              return next();

            case 19:
              return _context.abrupt("return");

            case 20:

              response.body.data = items;
              response.body.done = true;

              _context.next = 24;
              return next();

            case 24:
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
//# sourceMappingURL=has-one.js.map