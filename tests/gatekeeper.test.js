/**!
 * Gatekeeper
 * @copyright (c) 2011 Observer (observer.no.de) <info@3rd-Eden.com>
 * MIT Licensed
 */

var gatekeeper = require('../lib/gatekeeper')
  , assert = require('assert')
  , fixtures = require('./fixtures');

module.exports = {
    'library version number': function () {
      assert.ok(/^\d+\.\d+\.\d+$/.test(gatekeeper.version));
    }

  , 'gatekeeper accepts arguments': function () {
      assert.ok(!!gatekeeper(null));
      assert.ok(!!gatekeeper(1));
      assert.ok(!!gatekeeper([]));
      assert.ok(!!gatekeeper({}));
      assert.ok(!!gatekeeper(/\a/));
      assert.ok(!!gatekeeper(new Date));
    }

  , 'gatekeeper returns validate strategies for object': function () {
      assert.ok(typeof gatekeeper({}).against === 'object');
      assert.ok(typeof gatekeeper({}).against.schema === 'function');
      assert.ok(typeof gatekeeper({}).against.structure === 'function');
    }

  , 'gatekeeper against schema': function () {
      assert.ok(gatekeeper({}).against.schema(fixtures.schema) === false);

      assert.ok(gatekeeper({
          admin: true
        , id: 20
        , type: 'ftw'
      }).against.schema(fixtures.schema) === true);

      assert.ok(gatekeeper({
          admin: true
        , id: 20
        , type: 'ftl'
      }).against.schema(fixtures.schema) === true);

      assert.ok(gatekeeper({
          admin: true
        , id: 20
        , type: 'ftl'
        , extra: true
      }).against.schema(fixtures.schema) === false);

      assert.ok(gatekeeper({
          admin: true
        , id: 20
        , type: 'ftl'
        , extra: true
      }).against.schema(fixtures.schema, true) === true);

      assert.ok(gatekeeper({
          admin: true
        , id: 21
        , type: 'wrong'
      }).against.schema(fixtures.schema) === false);

      assert.ok(gatekeeper({
          admin: true
        , id: 21
        , type: 'ftl'
      }).against.schema(fixtures.schema) === false);

      assert.ok(gatekeeper({
          admin: false
        , id: 20
        , type: 'ftl'
      }).against.schema(fixtures.schema) === false);

      assert.ok(gatekeeper({
          admin: false
        , type: 'ftl'
      }).against.schema(fixtures.schema) === false);

      assert.ok(gatekeeper({
          admin: false
      }).against.schema(fixtures.schema) === false);
    }

  , 'validate simple structures': function () {
      assert.ok(gatekeeper({
      }).against.structure(fixtures.structure) === false);

      assert.ok(gatekeeper({
          type: 'testing'
      }).against.structure(fixtures.structure) === false);

      assert.ok(gatekeeper({
          type: 'testing'
        , id: 1
      }).against.structure(fixtures.structure) === false);

      assert.ok(gatekeeper({
          type: 'testing'
        , id: 1
        , admin: true
      }).against.structure(fixtures.structure) === true);

      assert.ok(gatekeeper({
          type: 'testing'
        , admin: true
        , id: 1

      }).against.structure(fixtures.structure) === true);
    }

  , 'validate nested structures': function () {
      assert.ok(gatekeeper({
      }).against.structure(fixtures.nested) === false);

      assert.ok(gatekeeper({
          type: 'testing'
      }).against.structure(fixtures.nested) === false);

      assert.ok(gatekeeper({
          type: 'testing'
        , simple: 1
      }).against.structure(fixtures.nested) === false);

      assert.ok(gatekeeper({
          type: 'testing'
        , simple: 1
        , nested: {
          }
      }).against.structure(fixtures.nested) === false);

      assert.ok(gatekeeper({
          type: 'testing'
        , simple: 1
        , nested: {
              type: 1
          }
      }).against.structure(fixtures.nested) === false);

      assert.ok(gatekeeper({
          type: 'testing'
        , simple: 1
        , nested: {
              type: 1
            , id: 0
          }
      }).against.structure(fixtures.nested) === false);

      assert.ok(gatekeeper({
          type: 'testing'
        , simple: 1
        , nested: {
              type: 1
            , id: 0
            , admin: 1
          }
      }).against.structure(fixtures.nested) === true);
    }
};
