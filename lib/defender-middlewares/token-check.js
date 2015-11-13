"use strict";

import wrap from '../koa-ctx';
var jwt = require('jsonwebtoken');


module.exports = function (forester) {

  var usersCollection = forester.collections._users;
  var tokensCollection = forester.collections._tokens;
  var jwtConfig = forester.config.jwt;

  return async function ({request, response, params}, next) {

    var token = request.query.token;

    if(!token){
      await next;
      return;
    }

    try {
      var vars = jwt.verify(token, jwtConfig.secret);
    }catch (e){
      response.status = 403;
      return;
    }

    var tokenObj = await tokensCollection.findAll({where: {token}});

    if(tokenObj.length !== 1){
      response.status = 403;
      return;
    }

    response.body = response.body || {};
    response.body.token = tokenObj;
    await next;

  }
};
