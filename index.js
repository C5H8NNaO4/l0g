const {Logger} = require('./Logger');
const transports = require('./transports');
const formatters = require('./formatters');

const exports = {
  Logger,
  transports,
  formatters,
};
if (window)
  window.Logger = exports;
module.exports = exports;