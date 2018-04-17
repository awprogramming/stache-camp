const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const Schema = mongoose.Schema;
const SkillSchema = require('./skill').schema;

const swimAnimalSchema = new Schema({
    name: String,
    completed:Boolean,
    skills: [SkillSchema]
});

module.exports = mongoose.model('SwimAnimal',swimAnimalSchema);