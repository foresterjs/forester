"use strict";

module.exports = function (rule) {

  return async function ({body, response}, next) {

    if (!body || !body.token) {
      response.status = 403;
      return;
    }

    var roles = body.token.user.roles || [];
    var allowedRoles = rule.roles;

    var allow = allowedRoles.some((role) => (roles.indexOf(role) >= 0));

    if (!allow) {
      response.status = 403;
      return;
    }


    await next();

  }
};
