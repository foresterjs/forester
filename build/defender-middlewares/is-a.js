"use strict";

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } step("next"); }); }; }

module.exports = function (rule) {

  return (function () {
    var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(_ref, next) {
      var user = _ref.user;
      var response = _ref.response;
      var roles, allowedRoles, allow;
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
              roles = user.roles || [];
              allowedRoles = rule.roles;
              allow = allowedRoles.some(function (role) {
                return roles.indexOf(role) >= 0;
              });

              if (allow) {
                _context.next = 9;
                break;
              }

              response.status = 403;
              return _context.abrupt("return");

            case 9:
              _context.next = 11;
              return next();

            case 11:
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
};
//# sourceMappingURL=is-a.js.map