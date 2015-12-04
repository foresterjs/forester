"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.showSchema = showSchema;
exports.showCount = showCount;
exports.showPagesCount = showPagesCount;
exports.showUser = showUser;

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } step("next"); }); }; }

function showSchema(_ref) {
  let collection = _ref.collection;

  return (function () {
    var ref = _asyncToGenerator(function* (_ref2, next) {
      let request = _ref2.request;
      let response = _ref2.response;
      let params = _ref2.params;

      response.body = response.body || {};

      var schema = collection.schema;

      response.body.schema = {
        name: schema.name,
        description: schema.description,
        properties: schema.properties,
        relations: schema.relations
      };

      yield next();
    });

    return function (_x, _x2) {
      return ref.apply(this, arguments);
    };
  })();
}

function showCount(_ref3) {
  let collection = _ref3.collection;

  return (function () {
    var ref = _asyncToGenerator(function* (_ref4, next) {
      let request = _ref4.request;
      let response = _ref4.response;
      let params = _ref4.params;

      response.body = response.body || {};

      response.body.count = yield collection.count();

      yield next();
    });

    return function (_x3, _x4) {
      return ref.apply(this, arguments);
    };
  })();
}

function showPagesCount(_ref5) {
  let collection = _ref5.collection;

  return (function () {
    var ref = _asyncToGenerator(function* (_ref6, next) {
      let request = _ref6.request;
      let response = _ref6.response;
      let params = _ref6.params;

      response.body = response.body || {};

      var count = response.body.count || (yield collection.count());
      var perPage = request.query.perPage || collection.defaults.perPage;

      response.body.pages = Math.ceil(count / perPage);

      yield next();
    });

    return function (_x5, _x6) {
      return ref.apply(this, arguments);
    };
  })();
}

function showUser(_ref7) {
  let collection = _ref7.collection;

  return (function () {
    var ref = _asyncToGenerator(function* (_ref8, next) {
      let request = _ref8.request;
      let response = _ref8.response;
      let user = _ref8.user;

      response.body = response.body || {};

      response.body.user = user;

      yield next();
    });

    return function (_x7, _x8) {
      return ref.apply(this, arguments);
    };
  })();
}
//# sourceMappingURL=common.js.map