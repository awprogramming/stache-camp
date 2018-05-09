const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const Schema = mongoose.Schema;
const SwimAnimalSchema = require('./swimAnimal').schema;
const SessionSchema = require('./session').schema;
const SkillSchema = require('./skill').schema;


const swimLevelSchema = new Schema({
    rcLevel: Number,
    name: String,
    completed: Boolean,
    sessionCompleted: SessionSchema,
    animals: [SwimAnimalSchema],
    exitSkills: [SkillSchema],
    pdfLocs:{
        name: {
            x: Number,
            y: Number
        },
        date: {
            x: Number,
            y: Number
        },
        instructor: {
            x: Number,
            y: Number
        },
        group: {
            x: Number,
            y: Number
        }
    }
});

module.exports = mongoose.model('SwimLevel',swimLevelSchema);