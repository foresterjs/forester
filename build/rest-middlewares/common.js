"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.showSchema = showSchema;
exports.showCount = showCount;
exports.showPagesCount = showPagesCount;
exports.showUser = showUser;

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }

function showSchema(_ref) {
  var collection = _ref.collection;

  return function () {
    var _ref2 = _asyncToGenerator(regeneratorRuntime.mark(function _callee(_ref3, next) {
      var request = _ref3.request;
      var response = _ref3.response;
      var params = _ref3.params;
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
      return _ref2.apply(this, arguments);
    };
  }();
}

function showCount(_ref4) {
  var collection = _ref4.collection;

  return function () {
    var _ref5 = _asyncToGenerator(regeneratorRuntime.mark(function _callee2(_ref6, next) {
      var request = _ref6.request;
      var response = _ref6.response;
      var params = _ref6.params;
      return regeneratorRuntime.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:

              response.body = response.body || {};

              _context2.next = 3;
              return collection.count();

            case 3:
              response.body.collectionCount = _context2.sent;
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
      return _ref5.apply(this, arguments);
    };
  }();
}

function showPagesCount(_ref7) {
  var collection = _ref7.collection;

  return function () {
    var _ref8 = _asyncToGenerator(regeneratorRuntime.mark(function _callee3(_ref9, next) {
      var request = _ref9.request;
      var response = _ref9.response;
      var params = _ref9.params;
      var query, count, perPage;
      return regeneratorRuntime.wrap(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              query = request.query || {};


              response.body = response.body || {};

              if (!query.hasOwnProperty("where")) {
                _context3.next = 8;
                break;
              }

              _context3.next = 5;
              return collection.count(query.where);

            case 5:
              count = _context3.sent;
              _context3.next = 9;
              break;

            case 8:
              count = response.body.collectionCount;

            case 9:
              perPage = request.query.perPage || collection.defaults.perPage;


              response.body.pages = Math.ceil(count / perPage);
              response.body.count = count;

              _context3.next = 14;
              return next();

            case 14:
            case "end":
              return _context3.stop();
          }
        }
      }, _callee3, this);
    }));

    return function (_x5, _x6) {
      return _ref8.apply(this, arguments);
    };
  }();
}

function showUser(_ref10) {
  var collection = _ref10.collection;

  return function () {
    var _ref11 = _asyncToGenerator(regeneratorRuntime.mark(function _callee4(_ref12, next) {
      var request = _ref12.request;
      var response = _ref12.response;
      var user = _ref12.user;
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
      return _ref11.apply(this, arguments);
    };
  }();
}
//# sourceMappingURL=common.js.map