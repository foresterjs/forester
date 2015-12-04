'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

const router = require('koa-simple-router');
const compose = require('koa-compose');

var crudMiddlewares = require('./rest-middlewares/crud');

var relationsMiddlewares = {
  belongsTo: require('./rest-middlewares/belongs-to'),
  hasMany: require('./rest-middlewares/has-many'),
  hasOne: require('./rest-middlewares/has-one'),
  hasAndBelongsToMany: require('./rest-middlewares/has-and-belongs-to-many'),
  hasManyThrough: require('./rest-middlewares/has-many-through')
};

let Rest = (function () {
  function Rest(app) {
    _classCallCheck(this, Rest);

    this.app = app;
    this.routes = {};
  }

  _createClass(Rest, [{
    key: 'boot',
    value: function boot() {
      this.registerCollections(this.app.collections);
    }
  }, {
    key: 'registerEndpoint',
    value: function registerEndpoint(_ref) {
      let collectionName = _ref.collectionName;
      let method = _ref.method;
      let route = _ref.route;
      let middlewares = _ref.middlewares;
      let description = _ref.description;
      let action = _ref.action;
      let relation = _ref.relation;

      var prefix = '/api/' + collectionName;

      this.app.koa.use(router({ prefix }, function (_) {
        _[method](route, compose(middlewares));
      }));

      this.routes[collectionName] = this.routes[collectionName] || [];

      this.routes[collectionName].push({
        method: method,
        url: prefix + route,
        description: description,
        action: action,
        relation: relation
      });
    }
  }, {
    key: 'registerCollections',
    value: function registerCollections(collections) {
      for (var collectionName in collections) {
        var collection = collections[collectionName];

        this.registerCrud(collection);

        this.registerRelations(collection);
      }
    }
  }, {
    key: 'registerCrud',
    value: function registerCrud(collection) {
      crudMiddlewares(this, { collection });
    }
  }, {
    key: 'registerRelations',
    value: function registerRelations(collection) {
      var relations = collection.schema.relations;
      for (var relationName in relations) {

        var relation = relations[relationName];
        relation.name = relationName;

        var middleware = relationsMiddlewares[relation.type];

        if (!middleware) {
          throw new Error("relation type " + relationType + " not valid");
        }

        middleware(this, {
          collections: this.app.collections,
          collection: collection,
          relation: relation
        });
      }
    }
  }]);

  return Rest;
})();

module.exports = Rest;
//# sourceMappingURL=rest.js.map