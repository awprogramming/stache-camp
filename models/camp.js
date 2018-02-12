const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt-nodejs');
const UserSchema = require('./user').schema;
const ModuleSchema = require('./module').schema;
const CounselorSchema = require('./counselor').schema;
const DivisionSchema = require('./division').schema;
const SpecialtySchema = require('./specialty').schema;
const OptionsSchema = require('./options').schema;
const SessionSchema = require('./session').schema;



const campSchema = new Schema({
    name: {type:String, required: true, unique: true},
    admin: UserSchema,
    users: [UserSchema],
    divisions: [DivisionSchema],
    modules: [ModuleSchema],
    counselors: [CounselorSchema],
    specialties: [SpecialtySchema],
    options: OptionsSchema,
    sessions:[SessionSchema]
});

module.exports = mongoose.model('Camp',campSchema);