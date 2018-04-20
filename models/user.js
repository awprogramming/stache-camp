const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt-nodejs');
const HeadStaffTypeSchema = require('./headStaffType').schema;

let emailLengthChecker = (email) => {
    if (!email)
        return false;
    else{
        if(email.length < 5 || email.length > 30)
            return false;
        else
            return true;
    }
};

let validEmailChecker = (email) => {
    if (!email){
        return false;
    } else {
        const regExp = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
        return regExp.test(email);
    }
}

const emailValidators = [
    {
        validator: emailLengthChecker, message: 'Email must be between 5 and 30 characters'
    },
    {
        validator: validEmailChecker, message: 'Must be a valid email'
    }
]

let passwordLengthChecker = (password) => {
    if (!password){
        return false;
    } else{
        if(password.length < 8 || password.length > 35)
            return false;
        else
            return true;
    }
}

let validPasswordChecker = (password) => {
    if (!password){
        return false;
    } else {
        const regExp = new RegExp(/^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{7,15}$/);
        return regExp.test(password);
    }
}

const passwordValidators = [
    {
        validator: passwordLengthChecker, message: 'Password must be between 8 and 35 characters'
    },
    {
        validator: validPasswordChecker, message: 'Password must include at least one numeric digit and a special character'
    }
]

const userSchema = new Schema({
    email: {type:String, required: true, unique: true,sparse:true, lowercase: true, validate: emailValidators },
    password: {type:String, required: true, validate: passwordValidators},
    first:{type:String, required:true},
    last:{type:String, required:true},
    type:HeadStaffTypeSchema,
    counselorRef: String
});


userSchema.pre('save',function(next) {

    if(!this.isModified('password'))
        return next();
    
    bcrypt.hash(this.password,null,null,(err,hash) => {
        if (err) return next(err);
        this.password = hash;
        next();
    });
});

userSchema.methods.comparePassword = function(password){
    return bcrypt.compareSync(password,this.password);
}

module.exports = mongoose.model('User',userSchema);