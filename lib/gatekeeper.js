/**!
 * Gatekeeper
 * @copyright (c) 2011 Observer (observer.no.de) <info@3rd-Eden.com>
 * MIT Licensed
 */

var schemas = {};

/**
 * The mother of all validation functions
 *
 * @param {Mixed} value The value to validate
 * @returns {Object} validation options
 * @api public
 */

function validate (value) {
  // minic the node.js based exports, just because we can
  var exports = {};

  /**
   * Validates the value against a pre-defined schema
   *
   * @param {String} path Path of the schema, where it's located
   * @returns {Boolean}
   * @api public
   */

  exports.schema = function (path) {
    // lazy require the schema and store the output
    var schema = schemas[path] || (schemas[path] = require(path))
      , keys = Object.keys(value)
      , i = keys.length
      , validates = true
      , key;

    // loop over the keys and check if they validate against the specified
    // schema.
    while (i--) {
      key = keys[i];

      if (key in schema) {
        validates = validates === schema[key](value[key]);
      }
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

  exports.structure = function (struc, deeper) {
    var val = deeper || value
      , keys = Object.keys(struc)
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
      if (typeof val[key] === 'object'
          && typeof struct[key] === 'object'
          && validates
      ) {
        validates = validates === exports.structure(struct[key], val[key]);
      }
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

// one, big, ass validation function.
module.exports = validate;
