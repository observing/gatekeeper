var Schema = require('gatekeeper/schema');

/**
 * Define a validation schema for the `randomname` object.
 *
 * @static {Object}
 */

exports.randomname = {
    name: new Schema().string().length(5, 25).$
  , age: new Schema().number().between(18, 130).$
  , skills: new Schema().array().length(1, 10).not('sex', 'pedobear').$
  , ip: new Schema().string().not('127.0.0.1').match(/\d+/i).$
  , administrator: new Schema().optional().string().length(5, 25).$
};
