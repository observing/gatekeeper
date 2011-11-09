var Schema = require('../../schema');

/**
 * A simple schema to validate objects against.
 */

exports.schema = {
    type: new Schema().string().either('ftw', 'ftl').$
  , id: new Schema().number().above(10).dividesby(10).$
  , admin: new Schema().boolean().true().$
};

/**
 * A simple scheme to validate a structure against.
 */

exports.structure = {
    type: ''
  , id: ''
  , admin: ''
};
