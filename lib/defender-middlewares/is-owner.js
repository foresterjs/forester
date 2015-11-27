"use strict";

module.exports = function (rule, collection) {

  if (rule.method == 'find') {
    return checkWhere(rule);
  }

  if (rule.method == 'create') {
    return checkData(rule);
  }

  if (rule.method == 'pick') {
    return postCheckItem(rule);
  }

  if (rule.method == 'update' || rule.method == 'destroy') {
    return checkStoredData(rule, collection);
  }

  throw new Error("isOwner is not supported on rule " + rule.method);

};


export function checkWhere(rule) {

  return async function ({body, request, response}, next) {

    if (!body || !body.token) {
      response.status = 403;
      response.body = {};
      return;
    }

    var userId = body.token.userId;

    request.query = request.query || {};
    request.query.where = request.query.where || {};

    if(request.query.where[rule.property] !== userId){
      response.status = 403;
      response.body = {};
      return;
    }

    await next();

  };
}

export function checkData(rule) {
  return async function ({body, request, response}, next) {

    if (!body || !body.token) {
      response.status = 403;
      response.body = {};
      return;
    }

    request.body = request.body || {};

    var userId = body.token.userId;

    if(request.body[rule.property] !== userId){
      response.status = 403;
      response.body = {};
      return;
    }

    await next();

  };
}

export function postCheckItem(rule) {
  return async function ({body, request, response}, next) {

    if (!body || !body.token) {
      response.status = 403;
      response.body = {};
      return;
    }

    var userId = body.token.userId;

    await next();

    if(!body.data || !body.data[rule.property] || body.data[rule.property] !== userId){
      response.status = 403;
      response.body = {};
    }
  };
}

export function checkStoredData(rule, collection) {
  return async function ({body, request, response, params}, next) {

    if (!body || !body.token) {
      response.status = 403;
      response.body = {};
      return;
    }

    var userId = body.token.userId;
    var id = params.id;

    var item = await collection.pick(id);
    if(!item){
      response.body.done = false;
      response.body.errors = ['not_found'];
      return;
    }

    if(!item[rule.property] || item[rule.property] !== userId){
      response.status = 403;
      response.body = {};
      return;
    }

    await next();
  };
}
