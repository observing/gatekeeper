var gatekeeper = require('../lib/gatekeeper')
  , assert = require('assert')
  , fixtures = require('./fixtures');

module.exports = {
    'library version number': function () {
      assert.ok(/^\d+\.\d+\.\d+$/.test(gatekeeper.version));
    }
};
