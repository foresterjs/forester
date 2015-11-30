'use strict';

const compose = require('koa-compose');

var checkMethods = {
  isAuthenticated: require('./defender-middlewares/is-authenticated'),
  isA: require('./defender-middlewares/is-a'),
  isOwner: require('./defender-middlewares/is-owner'),
  skip: require('./defender-middlewares/skip'),
  halt: require('./defender-middlewares/halt')
};

var checkMethodsDefault = checkMethods.halt();

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
      var action = rule.action;
      var check = rule.check;

      this.middlewares[relation] = this.middlewares[relation] || {};
      this.middlewares[relation][action] = this.middlewares[relation][action] || [];

      if(! checkMethods.hasOwnProperty(check)){
        throw new Error("defender: '" + check + "' is a method non allowed");
      }

      var middleware = checkMethods[check](rule, this.collection);
      this.middlewares[relation][action].push(middleware);

    });
  }

  acl(action, relation = "__collection") {

    if(! this.middlewares[relation] || ! this.middlewares[relation][action])
      return checkMethodsDefault;

    var middlewares = this.middlewares[relation][action];

    return compose(middlewares);

  }

  static registerCheckMethod(name, middleware){
    checkMethods[name] = middleware;
  }

}

module.exports = Defender;
