/**!
 * Gatekeeper
 * @copyright (c) 2011 Observer (observer.no.de) <info@3rd-Eden.com>
 * MIT Licensed
 */

var Schema = require('../schema')
  , schemas = {};

/**
 * The mother of all validation functions.
 *
 * @param {Mixed} value The value to validate
 * @returns {Object} validation options
 * @api public
 */

function validate (value) {
  // minic the node.js based exports, just because we can.
  var exports = {};

  /**
   * Validates the value against a pre-defined schema.
   *
   * @param {String} path Path of the schema, where it's located
   * @returns {Boolean}
   * @api public
   */

  exports.schema = function (path) {
    // lazy require the schema and store the output
    var type = typeof path
      , schema = type !== 'object'
          ? (schemas[path] || (schemas[path] = require(path)))
          : path
      , keys = Object.keys(schema)
      , i = keys.length
      , validates = true
      , validator
      , key;

    // no schema, or no definitions is false
    if (!schema || !i) return false;

    // loop over the keys and check if they validate against the specified
    // schema.
    while (i--) {
      key = keys[i];
      validator = schema[key];

      if (key in value) {
        validates = validates === schema[key](value[key]);
      } else {
        validates = false;
      }

      // optimize for failures
      if (!validates) break;
    }

    // so.. does it validate
    return validates;
  };

  /**
   * Validates the object against a structure.
   *
   * @param {Object} struct The structure to validate against
   * @returns {Boolean}
   * @api public
   */

  exports.structure = function (struct, deeper) {
    var val = deeper || value
      , keys = Object.keys(struct)
      , validates = true
      , i = keys.length
      , key;

    // fast case, as the amount of keys is wrong
    if (Object.keys(val).length !== keys.length) return false;

    // loop over keys then
    while (i--) {
      key = keys[i];
      validates = validates === (key in val);

      // we need to go deeper
      if (validates
          && typeof val[key] === 'object'
          && typeof struct[key] === 'object'
      ) {
        validates = validates === exports.structure(struct[key], val[key]);
      }

      // optimize for failure
      if (!validates) break;
    }

    // to validate or not to validate, that is the question
    return validates;
  };

  // validate the value against.. something
  exports.__defineGetter__('against', function against () {
    return typeof value === 'object'
      ? { schema: exports.schema, structure: exports.structure }
      : { }
  });

  return exports;
};

/**
 * Module version number.
 *
 * @type {String}
 * @api public
 */

validate.version = '0.0.1';

// one, big, ass validation function.
module.exports = validate;
