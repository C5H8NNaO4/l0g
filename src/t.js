const {Logger} = require('./Logger');
const {Color} = require('./formatters/Color');
const {ConsoleTransport} = require('./transports/ConsoleTransport');

const logger = new Logger('debug', {
    transports: [new ConsoleTransport({
        formatters: [
            new Color
        ]
    })]
});

logger.log`Hey ${'foo'}`;