/**!
 * Gatekeeper
 * @copyright (c) 2011 Observer (observer.no.de) <info@3rd-Eden.com>
 * MIT Licensed
 */

var Schema = require('../schema')
  , assert = require('assert');

module.exports = {
    'empty schema compilation': function (next) {
      var s = new Schema();

      assert.ok(typeof s.$ === 'function');
      s.$(); // also execute it, so we know it doesn't throw

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
        , nul = new Schema().null().$
        , bool = new Schema().boolean().$;

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

      assert.ok(bool(true));
      assert.ok(!bool(1));

      next();
    }

  , 'schema length and number validations': function (next) {
      var length = new Schema().length(10).$
        , minmax = new Schema().length(10, 15).$
        , above = new Schema().above(10).$
        , below = new Schema().below(10).$
        , between = new Schema().between(10, 15).$
        , float = new Schema().float().$
        , dividesby = new Schema().dividesby(12).$;

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

      assert.ok(float(20));
      assert.ok(!float(10.10));

      assert.ok(dividesby(24));
      assert.ok(!dividesby(25));

      next();
    }

  , 'schema item checking': function (next) {
      var either = new Schema().either('ping', 'pong', 'pang').$
        , have = new Schema().have('fox', 'box').$
        , not = new Schema().not('fox', 'box').$
        , unique = new Schema().unique('foo', 'bar').$;

      assert.ok(either('ping'));
      assert.ok(either('pong'));
      assert.ok(!either('pew'));

      assert.ok(have('the brown fox owns a box'));
      assert.ok(have('the box owns a brown fox'));
      assert.ok(!have('the fox'));
      assert.ok(!have('the box'));
      assert.ok(!have('wtf mate?'));

      assert.ok(not('pewpew'));
      assert.ok(!not('fox'));
      assert.ok(!not('box'));

      assert.ok(unique('foo bar baz'));
      assert.ok(!unique('foo bar bar'));

      next();
    }

  , 'schema string checking': function (next) {
      var match = new Schema().match(/^\d+$/).$
        , lowercase = new Schema().lowercase().$
        , uppercase = new Schema().uppercase().$
        , equal = new Schema().equal('string').$;

      assert.ok(match('1212'));
      assert.ok(!match('hello world'));
      assert.ok(!match('12a'));

      assert.ok(lowercase('hello world'));
      assert.ok(!lowercase('HELLO WORLD'));

      assert.ok(equal('string'));
      assert.ok(!equal('strings'));

      next();
    }
};
