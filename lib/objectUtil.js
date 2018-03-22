const pick = require('lodash/pick');
const omit = require('lodash/omit');

function destructureObject(object, pickedProps) {
  const pickedObj = pick(object, pickedProps);
  const omittedObj = omit(object, pickedProps);

  return Object.assign(pickedObj, { rest: omittedObj });
}

module.exports = destructureObject;
