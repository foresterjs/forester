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

const ValidationFail = require('../validation-fail');

module.exports = function (rest, _ref) {
  let collections = _ref.collections;
  let collection = _ref.collection;
  let relation = _ref.relation;

  var foreignCollection = collections[relation.collection];
  var foreignKey = relation.foreignKey;

  rest.registerEndpoint({
    action: "find",
    relation: relation.name,
    collectionName: collection.name,
    method: "get",
    route: "/:id/" + relation.name,
    middlewares: [collection.defender.acl("find", relation.name), find({ collection, foreignCollection, foreignKey })],
    description: "get " + relation.name
  });

  rest.registerEndpoint({
    action: "pick",
    relation: relation.name,
    collectionName: collection.name,
    method: "get",
    route: '/:id/' + relation.name + '/:fk',
    middlewares: [collection.defender.acl("pick", relation.name), pick({ collection, foreignCollection, foreignKey })],
    description: "get " + relation.name
  });

  rest.registerEndpoint({
    action: "create",
    relation: relation.name,
    collectionName: collection.name,
    method: "post",
    route: '/:id/' + relation.name,
    middlewares: [collection.defender.acl("create", relation.name), create({ collection, foreignCollection, foreignKey })],
    description: "create " + relation.name
  });

  rest.registerEndpoint({
    action: "update",
    relation: relation.name,
    collectionName: collection.name,
    method: "put",
    route: '/:id/' + relation.name + '/:fk',
    middlewares: [collection.defender.acl("update", relation.name), update({ collection, foreignCollection, foreignKey })],
    description: "create " + relation.name
  });

  rest.registerEndpoint({
    action: "destroy",
    relation: relation.name,
    collectionName: collection.name,
    method: "delete",
    route: '/:id/' + relation.name + '/:fk',
    middlewares: [collection.defender.acl("destroy", relation.name), destroy({ collection, foreignCollection, foreignKey })],
    description: "destroy " + relation.name
  });
};

function find(_ref2) {
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

      response.body.data = items;
      response.body.done = true;

      yield next();
    });

    return function (_x, _x2) {
      return ref.apply(this, arguments);
    };
  })();
}

function pick(_ref4) {
  let collection = _ref4.collection;
  let foreignCollection = _ref4.foreignCollection;
  let foreignKey = _ref4.foreignKey;

  return (function () {
    var ref = _asyncToGenerator(function* (_ref5, next) {
      let request = _ref5.request;
      let response = _ref5.response;
      let params = _ref5.params;

      var id = params.id;
      var fk = params.fk;
      response.body = response.body || {};

      var item = yield foreignCollection.pick(fk);

      if (item && item[foreignKey] === id) {
        response.body.data = item;
        response.body.done = true;
      } else {
        response.body.done = false;
        response.body.errors = ['not_found'];
      }

      yield next();
    });

    return function (_x3, _x4) {
      return ref.apply(this, arguments);
    };
  })();
}

function create(_ref6) {
  let collection = _ref6.collection;
  let foreignCollection = _ref6.foreignCollection;
  let foreignKey = _ref6.foreignKey;

  return (function () {
    var ref = _asyncToGenerator(function* (_ref7, next) {
      let request = _ref7.request;
      let response = _ref7.response;
      let params = _ref7.params;

      var id = params.id;
      var data = request.body;
      response.body = response.body || {};

      data[foreignKey] = id;

      try {
        var item = yield foreignCollection.create(data);

        if (item) {
          response.body.data = item;
          response.body.done = true;
        } else {
          response.body.done = false;
          response.body.errors = ['not_saved'];
        }

        yield next();
      } catch (err) {
        if (err instanceof ValidationFail) {

          response.body.errors = err.errors;
          response.body.done = false;
          yield next();
          return;
        }

        throw err;
      }
    });

    return function (_x5, _x6) {
      return ref.apply(this, arguments);
    };
  })();
}

function update(_ref8) {
  let collection = _ref8.collection;
  let foreignCollection = _ref8.foreignCollection;
  let foreignKey = _ref8.foreignKey;

  return (function () {
    var ref = _asyncToGenerator(function* (_ref9, next) {
      let request = _ref9.request;
      let response = _ref9.response;
      let params = _ref9.params;

      var id = params.id;
      var fk = params.fk;
      var data = request.body;
      response.body = response.body || {};

      data[foreignKey] = id;

      //check
      var item = yield foreignCollection.pick(fk);
      if (!item[foreignKey] === id) {
        request.body.done = false;
        request.body.errors = ['not_found', 'not_saved'];
        yield next();
        return;
      }

      //update
      try {
        var item = yield foreignCollection.update(fk, data);
        if (item) {
          response.body.data = item;
          response.body.done = true;
        } else {
          response.body.done = false;
          response.body.errors = ['not_saved'];
        }
        yield next();
      } catch (err) {
        if (err instanceof ValidationFail) {

          response.body.errors = err.errors;
          response.body.done = false;
          yield next();
          return;
        }

        throw err;
      }
    });

    return function (_x7, _x8) {
      return ref.apply(this, arguments);
    };
  })();
}

function destroy(_ref10) {
  let collection = _ref10.collection;
  let foreignCollection = _ref10.foreignCollection;
  let foreignKey = _ref10.foreignKey;

  return (function () {
    var ref = _asyncToGenerator(function* (_ref11, next) {
      let request = _ref11.request;
      let response = _ref11.response;
      let params = _ref11.params;

      var id = params.id;
      var fk = params.fk;
      response.body = response.body || {};

      //check
      var item = yield foreignCollection.pick(fk);
      if (!(item && item[foreignKey] === id)) {
        response.body.done = false;
        response.body.errors = ['not_found'];
        yield next();
        return;
      }

      //delete
      var result = yield foreignCollection.destroy(fk);
      response.body.done = result;
      yield next();
    });

    return function (_x9, _x10) {
      return ref.apply(this, arguments);
    };
  })();
}
//# sourceMappingURL=has-many.js.map