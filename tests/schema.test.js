var Schema = require('../schema')
  , assert = require('assert');

module.exports = {
    'empty schema compilation': function (next) {
      var s = new Schema();

      assert.ok(typeof s.$ === 'function');
      s.$(); // also execute it

      next();
    }

  , 'schema type validation (strict)': function (next) {
      var string = new Schema().string().$
        , number = new Schema().number().$
        , array = new Schema().array().$
        , object = new Schema().object().$
        , date = new Schema().date().$
        , regexp = new Schema().regexp().$
        , fn = new Schema().function().$
        , undef = new Schema().undefined().$
        , nul = new Schema().null().$;

      // now that we have compiled it, test if they correctly validate
      assert.ok(string('hello world'));
      assert.ok(!string(1));

      assert.ok(number(1));
      assert.ok(!number('1'));

      assert.ok(object({}));
      assert.ok(!object('object'));

      assert.ok(array([]));
      assert.ok(!array({length:10}));

      assert.ok(date(new Date));
      assert.ok(!date('today'));

      assert.ok(regexp(/test/));
      assert.ok(!regexp('/test/'));

      assert.ok(fn(function () {}));
      assert.ok(!fn('function () {}'));

      console.log(undef.toString());
      assert.ok(undef());
      assert.ok(!undef(''));

      assert.ok(nul(null));
      assert.ok(!nul(0));

      next && next();
    }
}
