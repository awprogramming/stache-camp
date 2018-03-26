const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const Schema = mongoose.Schema;
const AllergySchema = require('./allergy').schema;
const OtherDietarySchema = require('./otherDietary').schema;

const dietarySchema = new Schema({
    allergies: [AllergySchema],
    other: [OtherDietarySchema],
});

module.exports = mongoose.model('Dietary',dietarySchema);