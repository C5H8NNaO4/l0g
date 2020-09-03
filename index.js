const {Logger} = require('./Logger');
const transports = require('./transports');

const exports = {
  Logger,
  transports
};
if (window)
  window.Logger = exports;
module.exports = exports;