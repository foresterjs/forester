"use strict";

module.exports = function (rule) {

  return async function ({body, response}, next) {

    if (!body || !body.token) {
      response.status = 403;
      return;
    }

    var roles = body.token.user.roles || [];
    var allowedRoles = rule.roles;

    var allow = false;

    for (var i = 0; i < allowedRoles.length; ++i)
      if (roles.indexOf(allowedRoles[i]) != -1)
        allow = true;


    if (!allow) {
      response.status = 403;
      return;
    }


    await next();

  }
};
