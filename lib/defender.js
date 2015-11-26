'use strict';

const compose = require('koa-compose');

var checkMethods = {
  isAuthenticated: require('./defender-middlewares/is-authenticated'),
  isA: require('./defender-middlewares/is-a'),
  isOwner: require('./defender-middlewares/is-owner')
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
      this.middlewares[relation][method].push(middleware);

    });
  }

  acl(method, relation = "__collection") {

    if(! this.middlewares[relation] || ! this.middlewares[relation][method])
      return noop;

    var middlewares = this.middlewares[relation][method];

    return compose(middlewares);

  }

  static registerCheckMethod(name, middleware){
    checkMethods[name] = middleware;
  }

}

var noop = async function (ctx, next){await next()};

module.exports = Defender;
