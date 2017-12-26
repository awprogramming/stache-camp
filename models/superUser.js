const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt-nodejs');


const superUserSchema = new Schema({
    username: {type:String, required: true, unique: true},
    password: {type:String, required: true}
});

superUserSchema.methods.comparePassword = function(password){
    return bcrypt.compareSync(password,this.password);
}

superUserSchema.pre('save',function(next) {
    if(!this.isModified('password'))
        return next();
    
    bcrypt.hash(this.password,null,null,(err,hash) => {
        if (err) return next(err);
        this.password = hash;
        next();
    });
});

module.exports = mongoose.model('SuperUser',superUserSchema);