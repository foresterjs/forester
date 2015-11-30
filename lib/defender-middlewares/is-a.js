"use strict";

module.exports = function (rule) {

  return async function ({user, response}, next) {

    if (!user) {
      response.status = 403;
      return;
    }

    var roles = user.roles || [];
    var allowedRoles = rule.roles;

    var allow = allowedRoles.some((role) => (roles.indexOf(role) >= 0));

    if (!allow) {
      response.status = 403;
      return;
    }


    await next();

  }
};
