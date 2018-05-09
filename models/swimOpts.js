const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const Schema = mongoose.Schema;
const SwimLevelSchema = require('./swimLevel').schema;

const swimOptsSchema = new Schema({
    swimLevels: [SwimLevelSchema],
    agMax: Number
});

module.exports = mongoose.model('SwimOpts',swimOptsSchema);