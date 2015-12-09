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
  var collection = _ref.collection;

  return (function () {
    var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(_ref2, next) {
      var request = _ref2.request;
      var response = _ref2.response;
      var params = _ref2.params;
      var schema;
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:

              response.body = response.body || {};

              schema = collection.schema;

              response.body.schema = {
                name: schema.name,
                description: schema.description,
                properties: schema.properties,
                relations: schema.relations
              };

              _context.next = 5;
              return next();

            case 5:
            case "end":
              return _context.stop();
          }
        }
      }, _callee, this);
    }));

    return function (_x, _x2) {
      return ref.apply(this, arguments);
    };
  })();
}

function showCount(_ref3) {
  var collection = _ref3.collection;

  return (function () {
    var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee2(_ref4, next) {
      var request = _ref4.request;
      var response = _ref4.response;
      var params = _ref4.params;
      return regeneratorRuntime.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:

              response.body = response.body || {};

              _context2.next = 3;
              return collection.count();

            case 3:
              response.body.count = _context2.sent;
              _context2.next = 6;
              return next();

            case 6:
            case "end":
              return _context2.stop();
          }
        }
      }, _callee2, this);
    }));

    return function (_x3, _x4) {
      return ref.apply(this, arguments);
    };
  })();
}

function showPagesCount(_ref5) {
  var collection = _ref5.collection;

  return (function () {
    var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee3(_ref6, next) {
      var request = _ref6.request;
      var response = _ref6.response;
      var params = _ref6.params;
      var count, perPage;
      return regeneratorRuntime.wrap(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:

              response.body = response.body || {};

              _context3.t0 = response.body.count;

              if (_context3.t0) {
                _context3.next = 6;
                break;
              }

              _context3.next = 5;
              return collection.count();

            case 5:
              _context3.t0 = _context3.sent;

            case 6:
              count = _context3.t0;
              perPage = request.query.perPage || collection.defaults.perPage;

              response.body.pages = Math.ceil(count / perPage);

              _context3.next = 11;
              return next();

            case 11:
            case "end":
              return _context3.stop();
          }
        }
      }, _callee3, this);
    }));

    return function (_x5, _x6) {
      return ref.apply(this, arguments);
    };
  })();
}

function showUser(_ref7) {
  var collection = _ref7.collection;

  return (function () {
    var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee4(_ref8, next) {
      var request = _ref8.request;
      var response = _ref8.response;
      var user = _ref8.user;
      return regeneratorRuntime.wrap(function _callee4$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:

              response.body = response.body || {};

              response.body.user = user;

              _context4.next = 4;
              return next();

            case 4:
            case "end":
              return _context4.stop();
          }
        }
      }, _callee4, this);
    }));

    return function (_x7, _x8) {
      return ref.apply(this, arguments);
    };
  })();
}
//# sourceMappingURL=common.js.map