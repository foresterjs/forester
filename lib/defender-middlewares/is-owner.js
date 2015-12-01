"use strict";

module.exports = function (rule, collection) {

  if(rule.relation){
    return checkStoredData(rule, collection);
  }

  if (rule.action == 'find') {
    return checkWhere(rule);
  }

  if (rule.action == 'create') {
    return checkData(rule);
  }

  if (rule.action == 'pick') {
    return postCheckItem(rule);
  }

  if (rule.action == 'update' || rule.action == 'destroy') {
    return checkStoredData(rule, collection);
  }

  throw new Error("isOwner is not supported on rule " + rule.action);

};


export function checkWhere(rule) {

  return async function ({user, request, response}, next) {

    if (!user) {
      response.status = 403;
      return;
    }

    var userId = user.id;

    request.query = request.query || {};
    request.query.where = request.query.where || {};

    if(request.query.where[rule.property] !== userId){
      response.status = 403;
      return;
    }

    await next();

  };
}

export function checkData(rule) {
  return async function ({user, request, response}, next) {

    if (!user) {
      response.status = 403;
      return;
    }

    request.body = request.body || {};

    var userId = user.id;

    if(request.body[rule.property] !== userId){
      response.status = 403;
      return;
    }

    await next();

  };
}

export function postCheckItem(rule) {
  return async function ({body, request, response, user}, next) {

    if (!user) {
      response.status = 403;
      return;
    }

    var userId = user.id;

    await next();

    if(!body.data || !body.data[rule.property] || body.data[rule.property] !== userId){
      response.status = 403;
    }
  };
}

export function checkStoredData(rule, collection) {
  return async function ({body, request, response, params, user}, next) {

    if (!user) {
      response.status = 403;
      return;
    }

    var userId = user.id;
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
