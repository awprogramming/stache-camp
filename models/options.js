const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const Schema = mongoose.Schema;
const SessionSchema = require('./session').schema;

const optionsSchema = new Schema({
    session:SessionSchema
});

module.exports = mongoose.model('Options',optionsSchema);