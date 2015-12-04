'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

const compose = require('koa-compose');

var checkMethods = {
  isAuthenticated: require('./defender-middlewares/is-authenticated'),
  isA: require('./defender-middlewares/is-a'),
  isOwner: require('./defender-middlewares/is-owner'),
  skip: require('./defender-middlewares/skip'),
  halt: require('./defender-middlewares/halt')
};

let Defender = (function () {
  function Defender(collection) {
    _classCallCheck(this, Defender);

    this.collection = collection;
    this.rules = this.collection.schema.defender || [];
    this.middlewares = {};

    this.initRules();
  }

  _createClass(Defender, [{
    key: 'initRules',
    value: function initRules() {
      var _this = this;

      this.rules.forEach(function (rule) {

        var relation = rule.relation || "__collection";
        var action = rule.action;
        var check = rule.check;

        if (!Array.isArray(action)) action = [action];

        action.forEach(function (action) {
          rule.action = action;
          _this.middlewares[relation] = _this.middlewares[relation] || {};
          _this.middlewares[relation][action] = _this.middlewares[relation][action] || [];

          if (!checkMethods.hasOwnProperty(check)) {
            throw new Error("defender: '" + check + "' is a method non allowed");
          }

          var middleware = checkMethods[check](rule, _this.collection);
          _this.middlewares[relation][action].push(middleware);
        });
      });
    }
  }, {
    key: 'acl',
    value: function acl(action) {
      let relation = arguments.length <= 1 || arguments[1] === undefined ? "__collection" : arguments[1];

      if (!this.middlewares[relation]) {
        return compose([checkMethods.halt()]);
      }

      var middlewares;

      if (this.middlewares[relation][action]) {
        middlewares = this.middlewares[relation][action];
      } else {
        middlewares = this.middlewares[relation]['*'] || [checkMethods.halt()];
      }

      return compose(middlewares);
    }
  }], [{
    key: 'registerCheckMethod',
    value: function registerCheckMethod(name, middleware) {
      checkMethods[name] = middleware;
    }
  }]);

  return Defender;
})();

module.exports = Defender;
//# sourceMappingURL=defender.js.map