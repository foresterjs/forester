'use strict';

var get = require('raw-body');
var co = require('co');

module.exports = function (app) {
  Object.keys(request).forEach(function (key) {
    app.request[key] = request[key];
  });
  Object.keys(response).forEach(function (key) {
    app.response[key] = response[key];
  });
  return app;
};

const request = {};
const response = {};

request.json = async function (limit) {

  if (!this.length) return;

  this.response.writeContinue();
  var text = await get(this.req, {
    limit: limit || '100kb',
    length: this.length,
    encoding: 'utf8',
  });

  return this._parse_json(text);

};

response.writeContinue = function () {
  if (!this._checkedContinue && this.req.checkContinue) {
    this.res.writeContinue();
    this._checkedContinue = true;
  }
  return this;
};

request._parse_json = function (text) {
  if (this.app.jsonStrict !== false) {
    text = text.trim();
    const first = text[0];
    if (first !== '{' && first !== '[')
      this.ctx.throw(400, 'only json objects or arrays allowed');
  }
  try {
    return JSON.parse(text);
  } catch (err) {
    this.ctx.throw(400, 'invalid json received');
  }
};
