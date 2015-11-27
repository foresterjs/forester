"use strict";

var jwt = require('jsonwebtoken');


module.exports = function (forester) {

  var usersCollection = forester.collections._users;
  var tokensCollection = forester.collections._tokens;
  var jwtConfig = forester.config.jwt;

  return async function ({request, response, params}, next) {

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

    tokenObj.user = await usersCollection.pick(tokenObj.userId); //TODO implement with include

    response.body = response.body || {};
    response.body.token = tokenObj;
    await next();

  }
};
