"use strict";

var jwt = require('jsonwebtoken');

module.exports = function (forester) {

  var usersCollection = forester.collections._users;
  var tokensCollection = forester.collections._tokens;
  var jwtConfig = forester.config.jwt;

  forester.registerEndpoint(
    {
      action: "login",
      collectionName: "_users",
      method: "post",
      route: "/login",
      middlewares: [login({usersCollection, tokensCollection, jwtConfig})],
      description: "login and create a session token"
    }
  );

};


export function login({usersCollection, tokensCollection, jwtConfig}) {
  return async function ({request, response, params}, next) {

    var data = request.body;
    response.body = response.body || {};

    var username = data.username;
    var password = data.password;

    var users = await usersCollection.findAll({where: {username: username}});

    if (users.length !== 1) {
      response.body.done = false;
      response.body.errors = ['not_found'];
      await next();
      return;
    }

    var user = users[0];

    if (user.password !== password) {
      response.body.done = false;
      response.body.errors = ['bad_password'];
      await next();
      return;
    }

    var data = {
      token: jwt.sign({}, jwtConfig.secret),
      userId: user.id
    };

    var token = await tokensCollection.create(data);

    response.body.token = response.body.data = token;
    response.body.done = true;

    await next();
  }
}
