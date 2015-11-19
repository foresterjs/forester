'use strict';

import wrap from './koa-ctx';

var checkMethods = {
  isAuthenticated : require('./defender-middlewares/is-authenticated')
};

class Defender {

  constructor(collection) {

    this.collection = collection;
    this.aclRules = this.collection.schema.acl || [];
    this.middlewares = {};

    this.initRoles();

  }

  initRoles() {
    this.aclRules.forEach((rule) => {

      var relation = rule.relation || "__collection";
      var method = rule.method;
      var check = rule.check;

      this.middlewares[relation] = this.middlewares[relation] || {};
      this.middlewares[relation][method] = this.middlewares[relation][method] || [];

      if(! checkMethods.hasOwnProperty(check)){
        throw new Error("defender: '" + check + "' is a method non allowed");
      }

      var middleware = checkMethods[check](rule);
      this.middlewares[relation][method].push(wrap(middleware));

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
