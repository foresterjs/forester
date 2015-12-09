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
    var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(_ref, next) {
      var user = _ref.user;
      var request = _ref.request;
      var response = _ref.response;
      var userId;
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              if (user) {
                _context.next = 3;
                break;
              }

              response.status = 403;
              return _context.abrupt('return');

            case 3:
              userId = user.id;

              request.query = request.query || {};
              request.query.where = request.query.where || {};

              if (!(request.query.where[rule.property] !== userId)) {
                _context.next = 9;
                break;
              }

              response.status = 403;
              return _context.abrupt('return');

            case 9:
              _context.next = 11;
              return next();

            case 11:
            case 'end':
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

function checkData(rule) {
  return (function () {
    var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee2(_ref2, next) {
      var user = _ref2.user;
      var request = _ref2.request;
      var response = _ref2.response;
      var userId;
      return regeneratorRuntime.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              if (user) {
                _context2.next = 3;
                break;
              }

              response.status = 403;
              return _context2.abrupt('return');

            case 3:

              request.body = request.body || {};

              userId = user.id;

              if (!(request.body[rule.property] !== userId)) {
                _context2.next = 8;
                break;
              }

              response.status = 403;
              return _context2.abrupt('return');

            case 8:
              _context2.next = 10;
              return next();

            case 10:
            case 'end':
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

function postCheckItem(rule) {
  return (function () {
    var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee3(_ref3, next) {
      var body = _ref3.body;
      var request = _ref3.request;
      var response = _ref3.response;
      var user = _ref3.user;
      var userId;
      return regeneratorRuntime.wrap(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              if (user) {
                _context3.next = 3;
                break;
              }

              response.status = 403;
              return _context3.abrupt('return');

            case 3:
              userId = user.id;
              _context3.next = 6;
              return next();

            case 6:

              if (!body.data || !body.data[rule.property] || body.data[rule.property] !== userId) {
                response.body = {};
                response.status = 403;
              }

            case 7:
            case 'end':
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

function checkStoredData(rule, collection) {
  return (function () {
    var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee4(_ref4, next) {
      var body = _ref4.body;
      var request = _ref4.request;
      var response = _ref4.response;
      var params = _ref4.params;
      var user = _ref4.user;
      var userId, id, item;
      return regeneratorRuntime.wrap(function _callee4$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              if (user) {
                _context4.next = 3;
                break;
              }

              response.status = 403;
              return _context4.abrupt('return');

            case 3:
              userId = user.id;
              id = params.id;
              _context4.next = 7;
              return collection.pick(id);

            case 7:
              item = _context4.sent;

              if (item) {
                _context4.next = 12;
                break;
              }

              response.body.done = false;
              response.body.errors = ['not_found'];
              return _context4.abrupt('return');

            case 12:
              if (!(!item[rule.property] || item[rule.property] !== userId)) {
                _context4.next = 16;
                break;
              }

              response.status = 403;
              response.body = {};
              return _context4.abrupt('return');

            case 16:
              _context4.next = 18;
              return next();

            case 18:
            case 'end':
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
//# sourceMappingURL=is-owner.js.map