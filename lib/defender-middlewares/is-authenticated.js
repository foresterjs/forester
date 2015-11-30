"use strict";

module.exports = function (rule) {

  return async function ({user, response}, next) {

    if (!user) {
      response.status = 403;
      return;
    }

    await next();

  }
};
