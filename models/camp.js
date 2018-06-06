const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt-nodejs');
const UserSchema = require('./user').schema;
const ModuleSchema = require('./module').schema;
const CounselorSchema = require('./counselor').schema;
const CamperSchema = require('./camper').schema;
const DivisionSchema = require('./division').schema;
const SpecialtySchema = require('./specialty').schema;
const OptionsSchema = require('./options').schema;
const SessionSchema = require('./session').schema;
const GameSchema = require('./game').schema;
const SwimGroupSchema = require('./swimGroup').schema;


const campSchema = new Schema({
    name: {type:String, required: true, unique: true},
    admin: String,
    users: [UserSchema],
    divisions: [DivisionSchema],
    modules: [ModuleSchema],
    counselors: [CounselorSchema],
    campers: [CamperSchema],
    specialties: [SpecialtySchema],
    options: OptionsSchema,
    sessions:[SessionSchema],
    games: [GameSchema],
    swimGroups: [SwimGroupSchema]
}, {
    usePushEach: true
  });


campSchema.methods.hasModule = function(mod){
    for(let m of this.modules){
        if(m.short_name == mod){
            return true;
        }
    }
    return undefined;
}
campSchema.methods.getDivisionByName = function(div,gender){
    for(let division of this.divisions){
        if(division.name.toLowerCase() == div.toLowerCase() && division.gender == gender){
            return division;
        }
    }
    return false;
}

campSchema.methods.getSpecialtyByName = function(spec){
    for(let specialty of this.specialties){
        if(specialty.name.toLowerCase() == spec.toLowerCase()){
            return specialty;
        }
    }
    return false;
}

module.exports = mongoose.model('Camp',campSchema);