'use strict';

var Schema = require('./schema')
  , fuse = require('fusing');

/**
 * The mother of all validation functions.
 *
 * @Constructor
 * @param {Mixed} value The value to validate
 * @returns {Object} validation options
 * @api public
 */
function Gatekeeper() {
  var gatekeeper = this;

  this.fuse();
  this.against = gatekeeper;
  this.schemas = {};

  //
  // Validate the value against the provided schema.
  //
  return function validate(value) {
    gatekeeper.value = value;

    return gatekeeper;
  };
}

//
// Setup predefined readable and writable properties.
//
fuse(Gatekeeper);

/**
 * Try to require the schema
 *
 * @param {String} path
 * @returns {Object}
 */
Gatekeeper.readable('find', function find (path) {
  if (typeof path === 'object') return path;
  if (this.schemas[path]) return this.schemas[path];

  try { this.schemas[path] = require(path); }
  catch (e) {}

  return this.schemas[path];
});

/**
 * Validates the value against a pre-defined schema.
 *
 * @param {String} path Path of the schema, where it's located
 * @param {Boolean} additional allow additional keys
 * @returns {Boolean}
 * @api public
 */
Gatekeeper.readable('schema', function schema(path, additional) {
  // lazy require the schema and store the output
  var type = typeof path
    , schematics = this.find(path)

    // get keys for comparisons
    , keys = Object.keys(schematics || {})
    , valkeys = Object.keys(this.value)

    , i = keys.length
    , validates = true
    , validator
    , key;

  // invalid schema, so mark this stuff as invalid
  if (!schematics) return false;

  // loop over the keys and check if they validate against the schema.
  while (i--) {
    key = keys[i];
    validator = schematics[key];

    if (key in this.value) {
      validates = validates === validator(this.value[key]);

      // remove the element from the val array, so we can do a additional key
      // check if everything validates.
      valkeys.pop();
    } else {
      validates = false;
    }

    // optimize for failures
    if (!validates) break;
  }

  // so it validates against the schema, but are additional elements allowed
  // and do we have them
  if (validates && !additional && valkeys.length) return false;

  // so.. does it validate
  return validates;
});

/**
 * Validates the object against a structure.
 *
 * @param {Object} struct The structure to validate against
 * @returns {Boolean}
 * @api public
 */

Gatekeeper.readable('structure', function structure(struct, deeper) {
  var val = deeper || this.value
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
      validates = validates === this.structure(struct[key], val[key]);
    }

    // optimize for failure
    if (!validates) break;
  }

  // to validate or not to validate, that is the question
  return validates;
});

//
// Expose the Schema Constructor.
//
Gatekeeper.Schema = Schema;

//
// Export validate constructor.
//
module.exports = Gatekeeper;