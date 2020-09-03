const mongoose = require('mongoose');
const { isEmail } = require('validator');
const bcrypt = require('bcrypt');
const Schema = mongoose.Schema;

// define a user schema
const userSchema = new Schema({
    email: {
        type: String,
        required: [true, 'Please enter an email'],
        unique: true,
        validate: [isEmail, 'This email is not valid']
    },
    password:{
        type: String,
        required: [true, 'Please enter a password'],
        minlength: [6, 'Please enter at least 6 characters']
    }
});

// mongoose pre hook with hashing passwoerd before saving to the DB
userSchema.pre('save', async function(next) {
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// creating static method to login user
userSchema.statics.login = async function(email, password){
    const user = await this.findOne({ email });
    if(!user) throw Error('incorrect email');
    else{
        const auth = await bcrypt.compare(password, user.password);
        if(!auth) throw Error('incorrect password');
        else return user;
    }
}

module.exports = User = mongoose.model('user', userSchema);