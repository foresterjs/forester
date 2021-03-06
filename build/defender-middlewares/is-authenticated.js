"use strict";

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }

module.exports = function (rule) {

  return function () {
    var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(_ref2, next) {
      var user = _ref2.user;
      var response = _ref2.response;
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              if (user) {
                _context.next = 3;
                break;
              }

              response.status = 403;
              return _context.abrupt("return");

            case 3:
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
      return _ref.apply(this, arguments);
    };
  }();
};
//# sourceMappingURL=is-authenticated.js.map