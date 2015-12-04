"use strict";

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } step("next"); }); }; }

module.exports = function () {

  return (function () {
    var ref = _asyncToGenerator(function* (_ref, next) {
      let response = _ref.response;

      response.status = 403;
    });

    return function (_x, _x2) {
      return ref.apply(this, arguments);
    };
  })();
};
//# sourceMappingURL=halt.js.map