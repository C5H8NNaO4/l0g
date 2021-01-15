const {Transport} = require('./Transport');
const fs = require('fs');

class FileTransport extends Transport {
  constructor(filename, options = {}) {
    super(options);

    // if (!fs.existsSync(filename))
    // this.options = options;
    this.fs = fs.createWriteStream(filename, {
      flags: 'a'
    });
  }

  log (options) {
    this.fs.write(options.message + '\n');
  }
}

module.exports = {FileTransport}