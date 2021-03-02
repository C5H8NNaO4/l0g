var _require = require('./Logger'),
    Logger = _require.Logger;

var transports = require('./transports');

var formatters = require('./formatters');

var _require2 = require('./transports/ChromeTransport');

var exprts = {
  Logger: Logger,
  transports: transports,
  formatters: formatters
};
if (typeof window !== 'undefined') window.l0g = exprts;
module.exports = exprts;