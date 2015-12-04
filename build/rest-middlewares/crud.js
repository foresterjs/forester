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
const ValidationFail = require('../validation-fail');

module.exports = function (rest, _ref) {
  let collection = _ref.collection;

  rest.registerEndpoint({
    action: "find",
    collectionName: collection.name,
    method: "get",
    route: "/",
    middlewares: [collection.defender.acl("find"), commonMiddlewares.showSchema({ collection }), commonMiddlewares.showCount({ collection }), commonMiddlewares.showPagesCount({ collection }), commonMiddlewares.showUser({ collection }), findAll({ collection })],
    description: "find your elements"
  });

  rest.registerEndpoint({
    action: "pick",
    collectionName: collection.name,
    method: "get",
    route: "/:id",
    middlewares: [collection.defender.acl("pick"), commonMiddlewares.showSchema({ collection }), pick({ collection })],
    description: "find elements"
  });

  rest.registerEndpoint({
    action: "create",
    collectionName: collection.name,
    method: "post",
    route: "/",
    middlewares: [collection.defender.acl("create"), create({ collection })],
    description: "create an element"
  });

  rest.registerEndpoint({
    action: "update",
    collectionName: collection.name,
    method: "put",
    route: "/:id",
    middlewares: [collection.defender.acl("update"), update({ collection })],
    description: "update an element"
  });

  rest.registerEndpoint({
    action: "destroy",
    collectionName: collection.name,
    method: "delete",
    route: "/:id",
    middlewares: [collection.defender.acl("destroy"), destroy({ collection })],
    description: "delete an element"
  });
};

function findAll(_ref2) {
  let collection = _ref2.collection;

  return (function () {
    var ref = _asyncToGenerator(function* (_ref3, next) {
      let request = _ref3.request;
      let response = _ref3.response;

      var options = request.query;
      response.body = response.body || {};

      var items = yield collection.findAll(options);

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

  return (function () {
    var ref = _asyncToGenerator(function* (_ref5, next) {
      let request = _ref5.request;
      let response = _ref5.response;
      let params = _ref5.params;

      var id = params.id;
      response.body = response.body || {};

      var item = yield collection.pick(id);

      if (item) {
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

  return (function () {
    var ref = _asyncToGenerator(function* (_ref7, next) {
      let request = _ref7.request;
      let response = _ref7.response;

      var data = request.body;

      response.body = response.body || {};

      try {
        var item = yield collection.create(data);
        response.body.data = item;
        response.body.done = true;
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

  return (function () {
    var ref = _asyncToGenerator(function* (_ref9, next) {
      let request = _ref9.request;
      let response = _ref9.response;
      let params = _ref9.params;

      var id = params.id;
      var data = request.body;
      response.body = response.body || {};

      try {
        var item = yield collection.update(id, data);

        if (item) {
          response.body.data = item;
          response.body.done = true;
        } else {
          response.body.done = false;
          response.body.errors = ['not_found'];
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

  return (function () {
    var ref = _asyncToGenerator(function* (_ref11, next) {
      let request = _ref11.request;
      let response = _ref11.response;
      let params = _ref11.params;

      var id = params.id;
      response.body = response.body || {};

      var result = yield collection.destroy(id);

      response.body.done = result;

      if (!result) response.body.errors = ['not_found'];

      yield next();
    });

    return function (_x9, _x10) {
      return ref.apply(this, arguments);
    };
  })();
}
//# sourceMappingURL=crud.js.map