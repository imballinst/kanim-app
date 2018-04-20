const pick = require('lodash/pick');
const omit = require('lodash/omit');

const destructureObj = (object, pickedProps) => {
  const pickedObj = pick(object, pickedProps);
  const omittedObj = omit(object, pickedProps);

  return Object.assign(pickedObj, { rest: omittedObj });
};

const parseJSONIfString = data => (typeof data === 'object' ? data : JSON.parse(data));

module.exports = { destructureObj, parseJSONIfString };
