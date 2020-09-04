const {Logger} = require('./Logger');
const transports = require('./transports');
const formatters = require('./formatters');

const exprts = {
  Logger,
  transports,
  formatters,
};

console.log ("Init", exprts)
if (window)
  window.clog = exprts;

module.exports = exprts;