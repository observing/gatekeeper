'use strict';

var stringify = JSON.stringify;

/**
 * Start a new schema validation.
 *
 * @constructor
 * @api public
 */

function Schema () {
  this.validations = [
      // small handy helper function for type checking
      'var toString = function (val) {'
    ,   'var rs = Object.prototype.toString.call(val);'
    ,   'return rs.slice(8, rs.length - 1).toLowerCase();'
    , '};'
  ];
}

/**
 * The value should be a string.
 *
 * @api public
 */

Schema.prototype.string = function string () {
  this.validations.push('if (toString(value) !== "string") return false;');
  return this;
};

/**
 * The value should be a number.
 *
 * @param {Boolean} loose turn off strict validations
 * @api public
 */

Schema.prototype.number = function number (loose) {
  if (!loose) {
    this.validations.push('if (toString(value) !== "number") return false;');
  } else {
    this.validations.push('if (toString(+value) !== "number") return false;');
  }

  return this;
};

/**
 * The value should be an array.
 *
 * @api public
 */

Schema.prototype.array = function array () {
  this.validations.push('if (toString(value) !== "array") return false;');
  return this;
};

/**
 * The value should be a object.
 *
 * @api public
 */

Schema.prototype.object = function object () {
  this.validations.push('if (toString(value) !== "object") return false;');
  return this;
};

/**
 * The value should be a date.
 *
 * @api public
 */

Schema.prototype.date = function date () {
  this.validations.push('if (toString(value) !== "date") return false;');
  return this;
};

/**
 * The value should be a regexp.
 *
 * @api public
 */

Schema.prototype.regexp = function regexp () {
  this.validations.push('if (toString(value) !== "regexp") return false;');
  return this;
};

/**
 * The value should be a function.
 *
 * @api public
 */

Schema.prototype.function = function fn () {
  this.validations.push('if (toString(value) !== "function") return false;');
  return this;
};

/**
 * The value should be undefined
 *
 * @api public
 */

Schema.prototype.undefined = function undef () {
  this.validations.push('var undef; if (value !== undef) return false;');
  return this;
};

/**
 * The value should be null.
 *
 * @api public
 */

Schema.prototype.null = function nul () {
  this.validations.push('if (value !== null) return false;');
  return this;
};

/**
 * The value should be a boolean.
 *
 * @api public
 */

Schema.prototype.boolean = function bool () {
  this.validations.push('if (toString(value) !== "boolean") return false;');
  return this;
};

/**
 * The value should be true.
 *
 * @api public
 */

Schema.prototype.true = function truely () {
  this.validations.push('if (value !== true) return false;');
  return this;
};

/**
 * The value should be false.
 *
 * @api public
 */

Schema.prototype.false = function falsely () {
  this.validations.push('if (value !== false) return false;');
  return this;
};

/**
 * When only argument is given the length should be exact, if 2 arguments are
 * given the length should be between those values
 *
 * @param {Number} amount
 * @param {Number} maximum
 * @api public
 */

Schema.prototype.length = function length (amount, maximum) {
  if (!maximum) {
    this.validations.push('if (value.length !== ' + amount + ') return false;');
  } else {
    this.validations.push('if (!(value.length >= ' + amount
      + ' && value.length <= ' + maximum + ')) return false;');
  }
  return this;
};

/**
 * The value should be above the given amount.
 *
 * @param {Number} amount
 * @api public
 */

Schema.prototype.above = function above (amount) {
  this.validations.push('if (!(value > ' + amount + ')) return false;');
  return this;
};

/**
 * The value should be below the given amount.
 *
 * @param {Number} amount
 * @api public
 */

Schema.prototype.below = function below (amount) {
  this.validations.push('if (!(value < ' + amount + ')) return false;');
  return this;
};

/**
 * The value should be between low and high
 *
 * @param {Number} low
 * @param {Number} high
 * @api public
 */

Schema.prototype.between = function between (low, high) {
  this.below(high);
  this.above(low);
  return this;
};

/**
 * Loops over a array, and applies the pattern for each value in the array
 *
 * @param {Arguments} args Either arguments or a array
 * @param {String} pattern The pattern that needs replacement %arg%
 * @api private
 */

Schema.prototype.each = function each (args, pattern) {
  var i = args.length;
  while (i--) {
    this.validations.push(pattern.replace(
      /%\s?arg\s?%/g
    , stringify(args[i])
    ));
  }

  return this;
};

/**
 * The value should be either one of these, at least one should match.
 *
 * @api pubic
 */

Schema.prototype.either = function either () {
  var args = arguments
    , i = args.length
    , statements = [];

  while (i--) {
    statements.push('value === ' + stringify(args[i]));
  }

  this.validations.push('if (!(' + statements.join(' || ') + ')) return false;');
  return this;
};

/**
 * The value should have these values
 *
 * @api public
 */

Schema.prototype.have = function have () {
  this.each(arguments, 'if (value.indexOf(% arg %) === -1) return false;');
  return this;
};

/**
 * The values should not have these values
 *
 * @api public
 */

Schema.prototype.not = function not () {
  this.each(arguments, 'if (value.indexOf(% arg %) !== -1) return false;');
  return this;
};

/**
 * If arguments are passed in the function it will esure that those values are
 * unique in the array. If no options are given it will tests that all items in
 * the array must be unique.
 *
 * @TODO
 * @api public
 */

Schema.prototype.unique = function unique () {
  this.each(arguments, [
      'var counter = 0, position = value.indexOf(% arg %);'
    , 'while (position !== -1) {'
      , 'if (++counter > 1) return false;'
      , 'position = value.indexOf(% arg %, position + 1);'
    , '}'
  ].join(''));

  return this;
};

/**
 * The value should divide by this amount
 *
 * @api public
 */

Schema.prototype.dividesby = function devidesby (amount) {
  this.validations.push('if (value % ' + amount + ' !== 0) return false;');
  return this;
};

/**
 * The value should equal the given value
 *
 * @param {Mixed} value
 * @api public
 */

Schema.prototype.equal = function equal (value) {
  this.validations.push('if (value !== ' + stringify(value) + ') return false;');
  return this;
};

/**
 * The value should match against this regular expression
 *
 * @param {RegExp} regex
 * @api public
 */

Schema.prototype.match = function match (regex) {
  this.validations.push('if (!'+ regex + '.test(value)) return false;');
  return this;
};

/**
 * The value should be lowercase.
 *
 * @api public
 */

Schema.prototype.lowercase = function lowercase () {
  this.validations.push('if (value.toLowerCase() !== value) return false;');
  return this;
};

/**
 * The value should be uppercase.
 *
 * @api public
 */

Schema.prototype.uppercase = function uppercase () {
  this.validations.push('if (value.toUpperCase() !== value) return false;');
  return this;
};

/**
 * The value should be a float.
 *
 * @api public
 */

Schema.prototype.float = function float () {
  return this.dividesby(1);
};

/**
 * This value is optional and not required, but when it exists we are going to
 * validate against it.
 *
 * @api public
 */

Schema.prototype.optional = function optional () {
  this.validations.push('if (!value) return true;');
  return this;
};

/**
 * This should be placed on the last line of the scheme just like you would
 * with a regular expression. When the JS parser gets this property we are
 * going to generate the assembled statements and compile one single validation
 * function out of it.
 *
 * @api public
 */

Schema.prototype.__defineGetter__('$', function $ () {
  this.validations.push('return true;');

  return new Function('value', this.validations.join('\n'));
});

/**
 * Expose the Schema.
 */
module.exports = Schema;