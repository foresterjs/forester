"use strict";

var jwt = require('jsonwebtoken');


module.exports = function (forester) {

  var usersCollection = forester.collections._users;
  var tokensCollection = forester.collections._tokens;
  var jwtConfig = forester.config.jwt;

  return async function (ctx, next) {

    var request = ctx.request;
    var response = ctx.response;

    var token = request.query.token || request.get('Authorization');

    if(!token){
      await next();
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

    tokenObj = tokenObj[0];
    response.body = response.body || {};

    var user = await usersCollection.pick(tokenObj.userId);
    delete user.password;

    ctx.user = user; //If authenticated put user in ctx

    await next();

  }
};
