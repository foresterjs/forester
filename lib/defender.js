'use strict';

var isAuthenticated = require('./defender-middlewares/is-authenticated');
import wrap from './koa-ctx';

class Defender {

  constructor(collection) {

    this.collection = collection;
    this.aclConfig = this.collection.schema.acl || [];
    this.middlewares = {};

    this.initRoles();

  }

  initRoles() {
    this.aclConfig.forEach((role) => {

      var relation = role.relation || "__collection";
      var method = role.method;
      var check = role.check;

      this.middlewares[relation] = this.middlewares[relation] || {};
      this.middlewares[relation][method] = this.middlewares[relation][method] || [];

      if (check === "isAuthenticated") {
        var middleware = isAuthenticated();
        this.middlewares[relation][method].push(wrap(middleware));
      }
    });
  }

  acl(method, relation = "__collection") {
    try {
      return this.middlewares[relation][method];
    } catch (e) {
      return [];
    }
  }

}

module.exports = Defender;
