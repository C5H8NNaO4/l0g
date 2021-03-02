const {
  Transport
} = require('./Transport');

const {
  ConsoleTransport,
  Table
} = require('./ConsoleTransport');

const {
  ChromeTransport
} = require('./ChromeTransport'); // const {FileTransport} = require('./FileTransport');
// const {PostgresTransport} = require('./PostgresTransport');


module.exports = {
  Transport,
  ConsoleTransport,
  ChromeTransport,
  Table
};