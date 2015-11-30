'use strict';

const compose = require('koa-compose');

var checkMethods = {
  isAuthenticated: require('./defender-middlewares/is-authenticated'),
  isA: require('./defender-middlewares/is-a'),
  isOwner: require('./defender-middlewares/is-owner'),
  skip: require('./defender-middlewares/skip'),
  halt: require('./defender-middlewares/halt')
};

class Defender {

  constructor(collection) {

    this.collection = collection;
    this.rules = this.collection.schema.defender || [];
    this.middlewares = {};

    this.initRules();

  }

  initRules() {
    this.rules.forEach((rule) => {

      var relation = rule.relation || "__collection";
      var action = rule.action;
      var check = rule.check;

      if (!Array.isArray(action)) action = [action];

      action.forEach((action) => {
        this.middlewares[relation] = this.middlewares[relation] || {};
        this.middlewares[relation][action] = this.middlewares[relation][action] || [];

        if (!checkMethods.hasOwnProperty(check)) {
          throw new Error("defender: '" + check + "' is a method non allowed");
        }

        var middleware = checkMethods[check](rule, this.collection);
        this.middlewares[relation][action].push(middleware);
      });

    });
  }

  acl(action, relation = "__collection") {

    if (!this.middlewares[relation]) {
      return compose([checkMethods.halt()]);
    }

    var middlewares;

    if (this.middlewares[relation][action]) {
      middlewares = this.middlewares[relation][action]
    } else {
      middlewares = this.middlewares[relation]['*'] || [checkMethods.halt()];
    }

    return compose(middlewares);

  }

  static registerCheckMethod(name, middleware) {
    checkMethods[name] = middleware;
  }

}

module.exports = Defender;
