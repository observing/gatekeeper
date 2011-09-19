/**!
 * Gatekeeper
 * @copyright (c) 2011 Observer (observer.no.de) <info@3rd-Eden.com>
 * MIT Licensed
 */

/**
 * Start a new schema validation.
 *
 * @constructor
 * @api public
 */

function schema () {
  this.validations = [
      // small handy helper function for type checking
      'var toString = function (val) {'
    ,   'var rs = Object.prototype.toString.call(val);'
    ,   'return rs.slice(8, rs.length - 1).toLowerCase();'
    , '};'
  ];
};

/**
 * The value should be a string.
 *
 * @api public
 */

schema.prototype.string = function string () {
  this.validations.push('if (toString(value) !== "string") return false;');
  return this;
};

/**
 * The value should be a number.
 *
 * @api public
 */

schema.prototype.number = function number () {
  this.validations.push('if (toString(value) !== "number") return false;');
  return this;
};

/**
 * The value should be an array.
 *
 * @api public
 */

schema.prototype.array = function array () {
  this.validations.push('if (toString(value) !== "array") return false;');
  return this;
};

/**
 * The value should be a object.
 *
 * @api public
 */

schema.prototype.object = function object () {
  this.validations.push('if (toString(value) !== "object") return false;');
  return this;
};

/**
 * The value should be a date.
 *
 * @api public
 */

schema.prototype.date = function date () {
  this.validations.push('if (toString(value) !== "date") return false;');
  return this;
};

/**
 * The value should be a regexp.
 *
 * @api public
 */

schema.prototype.regexp = function regexp () {
  this.validations.push('if (toString(value) !== "regexp") return false;');
  return this;
};

/**
 * The value should be a function.
 *
 * @api public
 */

schema.prototype.function = function fn () {
  this.validations.push('if (toString(value) !== "function") return false;');
  return this;
};

/**
 * The value should be undefined
 *
 * @api public
 */

schema.prototype.undefined = function undef () {
  this.validations.push('if (toString(value) !== "undefined") return false;');
  return this;
};

/**
 * The value should be null.
 *
 * @api public
 */

schema.prototype.null = function null () {
  this.validations.push('if (toString(value) !== "null") return false;');
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

schema.prototype.length = function length (amount, maximum) {
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

schema.prototype.above = function above (amount) {
  this.validations.push('if (!value >= ' + amount + ') return false;');
  return this;
};

/**
 * The value should be below the given amount.
 *
 * @param {Number} amount
 * @api public
 */

schema.prototype.below = function below (amount) {
  this.validations.push('if (!value <= ' + amount + ') return false;');
  return this;
};

/**
 * The value should be between low and high
 *
 * @param {Number} low
 * @param {Number} high
 * @api public
 */

schema.prototype.between = function between (low, high) {
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

schema.prototype.each = function each (args, pattern) {
  var i = args.length;
  while (i--) {
    this.validations.push(pattern.replace(/%\s?arg\s?%/g, args[i]));
  }

  return this;
}

/**
 * The value should have these values
 *
 * @api public
 */

schema.prototype.have = function have () {
  this.each(arguments, 'if (value.indexOf(% arg %) === -1) return false;');
  return this;
};

/**
 * The values should not have these values
 *
 * @api public
 */

schema.prototype.not = function not () {
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

schema.prototype.unique = function unique () {
  return this;
};

/**
 * The value should divide by this amount
 *
 * @api public
 */

scheme.prototype.dividesby = function devidesby (amount) {
  this.validations.push('if (value % ' + amount + ' !== 0) return false;');
  return this;
};

/**
 * The value should equal the given value
 *
 * @param {Mixed} value
 * @api public
 */

schema.prototype.equal = function equal (value) {
  this.validations.push('if (value !== ' + value + ') return false;');
  return this;
};

/**
 * The value should match against this regular expression
 *
 * @param {RegExp} regex
 * @api public
 */

schema.prototype.match = function match (regex) {
  this.validations.push('if (!'+ regex + '.test(value)) return false;');
  return this;
};

/**
 * The value should be lowercase.
 *
 * @api public
 */

schema.prototype.lowercase = function lowercase () {
  return this.match(/^[a-z0-9]+$/);
};

/**
 * The value should be uppercase.
 *
 * @api public
 */

schema.prototype.uppercase = function uppercase () {
  return this.match(/^[A-Z0-9]+$/);
};

/**
 * The value should be a float.
 *
 * @api public
 */

schema.prototype.float = function float () {
  return this.dividesby(1);
};

/**
 * This value is optional and not required, but when it exists we are going to
 * validate against it.
 *
 * @api public
 */

schema.prototype.optional = function optional () {
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

schema.prototype.__defineGetter__('$', function $ () {
  return new Function('value', this.validations.join(''));
});

/**
 * Expose the schema
 */

module.exports = schema;
