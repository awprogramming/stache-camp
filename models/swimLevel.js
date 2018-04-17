const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const Schema = mongoose.Schema;
const SwimAnimalSchema = require('./swimAnimal').schema;
const SessionSchema = require('./session').schema;

const swimLevelSchema = new Schema({
    rcLevel: Number,
    name: String,
    completed: Boolean,
    sessionCompleted: SessionSchema,
    animals: [SwimAnimalSchema]
});

module.exports = mongoose.model('SwimLevel',swimLevelSchema);