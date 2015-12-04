"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.find = find;
exports.addAssociation = addAssociation;
exports.destroyAssociation = destroyAssociation;

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } step("next"); }); }; }

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
    description: "find all " + relation.name
  });

  rest.registerEndpoint({
    action: "addAssociation",
    relation: relation.name,
    collectionName: collection.name,
    method: "post",
    route: '/:id/' + relation.name + '/:fk',
    middlewares: [collection.defender.acl("addAssociation", relation.name), addAssociation({
      collection,
      foreignCollection,
      throughCollection,
      key,
      foreignKey
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
      collection,
      foreignCollection,
      throughCollection,
      key,
      foreignKey
    })],
    description: "remove association with " + relation.name
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

      //TODO add check not found

      var joinList = yield throughCollection.findAll({
        where: {
          [key]: id
        }
      });

      var ids = joinList.map(function (item) {
        return item[foreignKey];
      });

      var items = yield foreignCollection.pick(ids);

      response.body.data = items;
      response.body.done = true;

      yield next();
    });

    return function (_x, _x2) {
      return ref.apply(this, arguments);
    };
  })();
}

function addAssociation(_ref4) {
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

      var existsItem = yield collection.exists(id);
      var existsForeignItem = yield foreignCollection.exists(fk);

      if (!existsItem || !existsForeignItem) {
        response.body.done = false;
        response.body.errors = ['not_found'];
        yield next();
        return;
      }

      var joinList = yield throughCollection.findAll({
        where: {
          [key]: id,
          [foreignKey]: fk
        }
      });

      if (joinList.length > 0) {
        response.body.done = false;
        response.body.errors = ['too_many'];
        yield next();
        return;
      }

      var item = yield throughCollection.create({
        [key]: id,
        [foreignKey]: fk
      });

      response.body.data = item;
      response.body.done = true;

      yield next();
    });

    return function (_x3, _x4) {
      return ref.apply(this, arguments);
    };
  })();
}

function destroyAssociation(_ref6) {
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

      return next;
    });

    return function (_x5, _x6) {
      return ref.apply(this, arguments);
    };
  })();
}
//# sourceMappingURL=has-and-belongs-to-many.js.map