"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.checkWhere = checkWhere;
exports.checkData = checkData;
exports.postCheckItem = postCheckItem;
exports.checkStoredData = checkStoredData;

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } step("next"); }); }; }

module.exports = function (rule, collection) {

  if (rule.relation) {
    return checkStoredData(rule, collection);
  }

  if (rule.action == 'find') {
    return checkWhere(rule);
  }

  if (rule.action == 'create') {
    return checkData(rule);
  }

  if (rule.action == 'pick') {
    return postCheckItem(rule);
  }

  if (rule.action == 'update' || rule.action == 'destroy') {
    return checkStoredData(rule, collection);
  }

  throw new Error("isOwner is not supported on rule " + rule.action);
};

function checkWhere(rule) {

  return (function () {
    var ref = _asyncToGenerator(function* (_ref, next) {
      let user = _ref.user;
      let request = _ref.request;
      let response = _ref.response;

      if (!user) {
        response.status = 403;
        return;
      }

      var userId = user.id;

      request.query = request.query || {};
      request.query.where = request.query.where || {};

      if (request.query.where[rule.property] !== userId) {
        response.status = 403;
        return;
      }

      yield next();
    });

    return function (_x, _x2) {
      return ref.apply(this, arguments);
    };
  })();
}

function checkData(rule) {
  return (function () {
    var ref = _asyncToGenerator(function* (_ref2, next) {
      let user = _ref2.user;
      let request = _ref2.request;
      let response = _ref2.response;

      if (!user) {
        response.status = 403;
        return;
      }

      request.body = request.body || {};

      var userId = user.id;

      if (request.body[rule.property] !== userId) {
        response.status = 403;
        return;
      }

      yield next();
    });

    return function (_x3, _x4) {
      return ref.apply(this, arguments);
    };
  })();
}

function postCheckItem(rule) {
  return (function () {
    var ref = _asyncToGenerator(function* (_ref3, next) {
      let body = _ref3.body;
      let request = _ref3.request;
      let response = _ref3.response;
      let user = _ref3.user;

      if (!user) {
        response.status = 403;
        return;
      }

      var userId = user.id;

      yield next();

      if (!body.data || !body.data[rule.property] || body.data[rule.property] !== userId) {
        response.body = {};
        response.status = 403;
      }
    });

    return function (_x5, _x6) {
      return ref.apply(this, arguments);
    };
  })();
}

function checkStoredData(rule, collection) {
  return (function () {
    var ref = _asyncToGenerator(function* (_ref4, next) {
      let body = _ref4.body;
      let request = _ref4.request;
      let response = _ref4.response;
      let params = _ref4.params;
      let user = _ref4.user;

      if (!user) {
        response.status = 403;
        return;
      }

      var userId = user.id;
      var id = params.id;

      var item = yield collection.pick(id);
      if (!item) {
        response.body.done = false;
        response.body.errors = ['not_found'];
        return;
      }

      if (!item[rule.property] || item[rule.property] !== userId) {
        response.status = 403;
        response.body = {};
        return;
      }

      yield next();
    });

    return function (_x7, _x8) {
      return ref.apply(this, arguments);
    };
  })();
}
//# sourceMappingURL=is-owner.js.map