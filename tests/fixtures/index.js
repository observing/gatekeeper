/**!
 * Gatekeeper
 * @copyright (c) 2011 Observer (observer.no.de) <info@3rd-Eden.com>
 * MIT Licensed
 */

var Schema = require('../../schema');

/**
 * A simple schema to validate objects against.
 *
 * @type {Object}
 */

exports.schema = {
    type: new Schema().string().either('ftw', 'ftl').$
  , id: new Schema().number().above(10).dividesby(10).$
  , admin: new Schema().boolean().true().$
};

/**
 * A simple scheme to validate a structure against.
 *
 * @type {Object}
 */

exports.structure = {
    type: 1
  , id: 1
  , admin: 1
};

/**
 * A more nested scheme to validate a structure against
 *
 * @type {Object}
 */

exports.nested = {
    type: 1
  , nested: exports.structure
  , simple: 1
};
