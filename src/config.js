require('dotenv').config();

const {LOG_LEVEL, LOG_SCOPE, LOG_FILTER} = process.env;

module.exports = {
    LOG_LEVEL, LOG_SCOPE, LOG_FILTER
};