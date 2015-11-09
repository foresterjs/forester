"use strict";

import wrap from '../lib/koa-ctx';

module.exports = function (forester) {

  forester.registerCollection(require(__dirname + "/_users.json"));
  forester.registerCollection(require(__dirname + "/_sessions.json"));

  forester.registerEndpoint(
    {
      collectionName: "_users",
      method: "post",
      route: "/login/",
      middlewares: [wrap(loginMiddleware({
        usersCollection: forester.collections._users,
        sessionsCollection: forester.collections._sessions
      }))],
      description: "login and create a session token"
    }
  );

};


export function loginMiddleware({usersCollection, sessionsCollection}) {
  return async function ({request, response, params}, next) {

    var data = await request.json();
    response.body = response.body || {};


    response.body.data = {token: 2222};
    response.body.done = true;

    await next;
  }
}
