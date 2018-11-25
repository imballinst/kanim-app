const auth = require('./auth');
const offices = require('./offices');
const queue = require('./queue');

module.exports = Object.assign({}, auth, offices, queue);
