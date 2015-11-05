'use strict';

module.exports = koaCtx;

function koaCtx (middleware) {
  return async function (next) {

    var ctx = this;
    return await middleware(ctx, next);

  };
}
