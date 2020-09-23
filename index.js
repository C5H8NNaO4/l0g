const {Logger} = require('./Logger');
const transports = require('./transports');
const formatters = require('./formatters');

const {ChromeTransport} = require('./transports/ChromeTransport');
const exprts = {
  Logger,
  transports,
  formatters,
};

if (typeof window !== 'undefined')
  window.clog = exprts;

module.exports = exprts;