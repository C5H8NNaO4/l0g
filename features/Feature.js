class Feature {
  constructor () {
  }
  register (Logger) {
    throw new Error ('Cannot instantiate abstract feature')
    // Logger.prototype.table = Feature.prototype.run;
  }

  run (data) {
    // this.meta.group = this.meta.group || {};
    // this.meta.group.table = {data};
    // return this;
  }

  log (options) {
    // //this actually refers to the Transport instance as its being .called to give access to its functions
    // //this comment might be a sign of bad code, maybe it's better to give up having the same signature for the log
    // //function and pass the Transport instance as second parameter
    // if (!options.group) return this.log(options);
    // const args = ConsoleTransport.getOptionalArgs(options)
    
    // ConsoleTransport.unsurpressed(() => {
    //   console.groupCollapsed(...args);
    //   console.table(options.group.table.data);
    //   console.groupEnd();
    // })
  }
}

class LoggerFeature extends Feature {}

module.exports = {
  LoggerFeature, Feature
}