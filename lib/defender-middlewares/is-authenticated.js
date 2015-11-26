"use strict";

module.exports = function (rule) {

  return async function ({body, response}, next) {

    if (!body || !body.token) {
      response.status = 403;
      return;
    }

    await next();

  }
};
