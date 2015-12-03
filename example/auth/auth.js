"use strict";


const jwt = require('jsonwebtoken');
const assert = require('assert');

module.exports = function (forester) {

  var usersCollection = forester.registerCollection(require('./_users.json'));
  var tokensCollection = forester.registerCollection(require('./_tokens.json'));
  var config = forester.config;

  forester.koa.use(check(usersCollection, tokensCollection, config));

  forester.registerEndpoint(
    {
      action: "login",
      collectionName: usersCollection.name,
      method: "post",
      route: "/login",
      middlewares: [login(usersCollection, tokensCollection, config)],
      description: "login and create a session token"
    }
  );

};


export function check(usersCollection, tokensCollection, config) {

  return async function (ctx, next) {

    assert(config.jwt, "jwt config not defined");
    assert(config.jwt.secret, "jwt secret not defined");

    var {request, response} = ctx;

    var token = request.query.token || request.get('Authorization');
    if (!token) {
      await next();
      return;
    }

    /********************
     check token with jwt
     *********************/
    try {
      var vars = jwt.verify(token, config.jwt.secret);
    } catch (e) {
      response.status = 403;
      return;
    }

    /**************************
     check token with storage
     **************************/
    var tokenObj = await tokensCollection.findAll({where: {token}});
    if (tokenObj.length !== 1) {
      response.status = 403;
      return;
    }
    tokenObj = tokenObj[0];

    /*********
     pick user
     *********/
    response.body = response.body || {};
    var user = await usersCollection.pick(tokenObj.userId);
    delete user.password;

    /***********
     authenticate
     ************/
    ctx.user = user; //If authenticated put user in ctx

    await next();

  }
}


export function login(usersCollection, tokensCollection, config) {
  return async function ({request, response}, next) {

    assert(config.jwt, "jwt config not defined");
    assert(config.jwt.secret, "jwt secret not defined");

    var {username, password} = request.body;
    response.body = response.body || {};


    /*********
     pick user
     *********/

    var users = await usersCollection.findAll({where: {username: username}});

    if (users.length !== 1) {
      response.body.done = false;
      response.body.errors = ['not_found'];
      await next();
      return;
    }
    var user = users[0];

    /***************
     check password
     **************/
    if (user.password !== password) {
      response.body.done = false;
      response.body.errors = ['bad_password'];
      await next();
      return;
    }
    delete user.password;

    /*********************
     sign and create token
     *********************/
    var data = {
      token: jwt.sign({}, config.jwt.secret),
      userId: user.id
    };

    var token = await tokensCollection.create(data);

    response.body.data = token;
    response.body.user = user;
    response.body.done = true;

    await next();
  }
}
