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
    }
};
