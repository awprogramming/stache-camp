const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const Schema = mongoose.Schema;
const SwimLevelSchema = require('./swimLevel').schema;
const CamperSchema = require('./camper').schema;


const swimOptsSchema = new Schema({
    swimLevels: [SwimLevelSchema],
    completed:[{
        camper: CamperSchema,
        level:Number
    }],
    agMax: Number
});

module.exports = mongoose.model('SwimOpts',swimOptsSchema);