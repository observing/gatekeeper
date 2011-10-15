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

      assert.ok(undef());
      assert.ok(!undef(''));

      assert.ok(nul(null));
      assert.ok(!nul(0));

      next();
    }

  , 'schema length and number validations': function (next) {
      var length = new Schema().length(10).$
        , minmax = new Schema().length(10, 15).$
        , above = new Schema().above(10).$
        , below = new Schema().below(10).$
        , between = new Schema().between(10, 15).$;

      assert.ok(length('1234567890'));
      assert.ok(!length('pewpew'));

      assert.ok(minmax('1234567890 12'));
      assert.ok(!minmax('pewpew'));
      assert.ok(!minmax('97420957230947534095720'));

      assert.ok(above(11));
      assert.ok(!above(10));

      assert.ok(below(9));
      assert.ok(!below(10));

      assert.ok(between(12));
      assert.ok(!between(10));
      assert.ok(!between(110));

      next();
    }

  , 'scheme item checking': function () {
      var either = new Schema().either('ping', 'pong', 'pang').$
        , have = new Schema().have('fox', 'box').$
        , not = new Schema().not('fox', 'box').$;

      assert.ok(either('ping'));
      assert.ok(either('pong'));
      assert.ok(!either('pew'));

      assert.ok(have('the brown fox owns a box'));
      assert.ok(have('the box owns a brown fox'));
      assert.ok(!have('the fox'));
      assert.ok(!have('the box'));
      assert.ok(!have('wtf mate?'));

    }
}
