const mongoose = require('mongoose');
const logger = require('../utils/loggers/app_logger');
const mongoSettings = require('../setting').mongo;

mongoose.Promise = Promise;

const { uri } = mongoSettings;
mongoose.connect(uri, { useMongoClient: true });
const db = mongoose.connection;

db.on('open', () => {
  logger.info(`successfully connecting to db, uri: ${uri}`);
});

db.on('error', (e) => {
  logger.error(`error connecting to db, uri: ${uri}`, { err: e });
});

module.exports = db;
