const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Schema = mongoose.Schema;

//Create
const userSchema = new Schema({
    method: {
        type: String,
        enum: ['local', 'google'],
        required: true
    },
    local: {
        email: {
            type: String,
            lowercase: true
        },
        password: {
            type: String,
        }
    },
    google: {
        id: {
            type: String
        },
        email: {
            type: String,
            lowercase: true
        }
    },
});

userSchema.pre('save', function (next) {
    try {
        if (this.method !== "local") {
            next();
        }
        else {
            bcrypt.genSalt(10).then(result => {
                const salt = result;
                bcrypt.hash(this.local.password, salt).then(hashResult => {
                    const Hashedpassword = hashResult;
                    this.local.password = Hashedpassword;
                    next();
                });
            });
        }

    } catch (error) {
        next(error);
    }
});

userSchema.methods.isValidPassword = async function (password) {
    try {
        console.log(password);
        console.log(this.local.password);

        return await bcrypt.compare(password, this.local.password);

    } catch (error) {
        throw new Error(error);
    }
}

//Model
const User = mongoose.model('user', userSchema);

//Export
module.exports = User;