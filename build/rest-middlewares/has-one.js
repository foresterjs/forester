"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.pick = pick;

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } step("next"); }); }; }

module.exports = function (rest, _ref) {
  let collections = _ref.collections;
  let collection = _ref.collection;
  let relation = _ref.relation;

  var foreignCollection = collections[relation.collection];
  var foreignKey = relation.foreignKey;

  rest.registerEndpoint({
    action: "pick",
    relation: relation.name,
    collectionName: collection.name,
    method: "get",
    route: '/:id/' + relation.name,
    middlewares: [collection.defender.acl("pick", relation.name), pick({ collection, foreignCollection, foreignKey })],
    description: "find " + collection.name
  });
};

function pick(_ref2) {
  let collection = _ref2.collection;
  let foreignCollection = _ref2.foreignCollection;
  let foreignKey = _ref2.foreignKey;

  return (function () {
    var ref = _asyncToGenerator(function* (_ref3, next) {
      let request = _ref3.request;
      let response = _ref3.response;
      let params = _ref3.params;

      var id = params.id;
      var options = request.query;
      response.body = response.body || {};

      options.where = options.where || {};
      options.where[foreignKey] = id;

      var items = yield foreignCollection.findAll(options);

      if (items.length === 0) {
        response.body.done = false;
        response.body.errors = ['not_found'];
        yield next();
        return;
      }

      if (items.length > 1) {
        response.body.done = false;
        response.body.errors = ['too_many'];
        yield next();
        return;
      }

      response.body.data = items;
      response.body.done = true;

      yield next();
    });

    return function (_x, _x2) {
      return ref.apply(this, arguments);
    };
  })();
}
//# sourceMappingURL=has-one.js.map