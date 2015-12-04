"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.find = find;
exports.findOn = findOn;
exports.create = create;
exports.destroy = destroy;

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } step("next"); }); }; }

const ValidationFail = require('../validation-fail');

module.exports = function (rest, _ref) {
  let collections = _ref.collections;
  let collection = _ref.collection;
  let relation = _ref.relation;

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
      collection,
      foreignCollection,
      throughCollection,
      key,
      foreignKey
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
      collection,
      foreignCollection,
      throughCollection,
      key,
      foreignKey
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
      collection,
      foreignCollection,
      throughCollection,
      key,
      foreignKey
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
      collection,
      foreignCollection,
      throughCollection,
      key,
      foreignKey
    })],
    description: "remove all " + relation.name + " about an " + collection.name
  });
};

function find(_ref2) {
  let collection = _ref2.collection;
  let foreignCollection = _ref2.foreignCollection;
  let throughCollection = _ref2.throughCollection;
  let foreignKey = _ref2.foreignKey;
  let key = _ref2.key;

  return (function () {
    var ref = _asyncToGenerator(function* (_ref3, next) {
      let request = _ref3.request;
      let response = _ref3.response;
      let params = _ref3.params;

      var id = params.id;
      response.body = response.body || {};

      var items = yield throughCollection.findAll({
        where: {
          [key]: id
        }
      });

      response.body.done = true;
      response.body.data = items;

      yield next();
    });

    return function (_x, _x2) {
      return ref.apply(this, arguments);
    };
  })();
}

function findOn(_ref4) {
  let collection = _ref4.collection;
  let foreignCollection = _ref4.foreignCollection;
  let throughCollection = _ref4.throughCollection;
  let foreignKey = _ref4.foreignKey;
  let key = _ref4.key;

  return (function () {
    var ref = _asyncToGenerator(function* (_ref5, next) {
      let request = _ref5.request;
      let response = _ref5.response;
      let params = _ref5.params;

      var id = params.id;
      var fk = params.fk;
      response.body = response.body || {};

      var items = yield throughCollection.findAll({
        where: {
          [key]: id,
          [foreignKey]: fk
        }
      });

      response.body.done = true;
      response.body.data = items;

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
  let throughCollection = _ref6.throughCollection;
  let foreignKey = _ref6.foreignKey;
  let key = _ref6.key;

  return (function () {
    var ref = _asyncToGenerator(function* (_ref7, next) {
      let request = _ref7.request;
      let response = _ref7.response;
      let params = _ref7.params;

      var id = params.id;
      var fk = params.fk;
      var data = request.body;
      response.body = response.body || {};

      var existsItem = yield collection.exists(id);
      var existsForeignItem = yield foreignCollection.exists(fk);

      if (!existsItem || !existsForeignItem) {
        response.body.done = false;
        response.body.errors = ['not_found'];
        yield next();
        return;
      }

      data[key] = id;
      data[foreignKey] = fk;

      try {
        var item = yield throughCollection.create(data);
        response.body.done = true;
        response.body.data = item;

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

function destroy(_ref8) {
  let collection = _ref8.collection;
  let foreignCollection = _ref8.foreignCollection;
  let throughCollection = _ref8.throughCollection;
  let foreignKey = _ref8.foreignKey;
  let key = _ref8.key;

  return (function () {
    var ref = _asyncToGenerator(function* (_ref9, next) {
      let request = _ref9.request;
      let response = _ref9.response;
      let params = _ref9.params;

      var id = params.id;
      var fk = params.fk;
      response.body = response.body || {};

      var joinList = yield throughCollection.findAll({
        where: {
          [key]: id,
          [foreignKey]: fk
        }
      });

      if (joinList.length === 0) {
        response.body.done = false;
        response.body.errors = ['not_found'];
        yield next();
        return;
      }

      var ids = joinList.map(function (item) {
        return item.id;
      });

      var result = yield throughCollection.destroy(ids);
      response.body.done = result;

      yield next();
    });

    return function (_x7, _x8) {
      return ref.apply(this, arguments);
    };
  })();
}
//# sourceMappingURL=has-many-through.js.map