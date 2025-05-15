const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
    type: String,
    required: [true, 'Lo username è obbligatorio'],
    minlength: [3, 'Lo username deve avere almeno 3 caratteri'],
    trim: true
    },
    name: {
    type: String,
    required: [true, 'Il nome è obbligatorio'],
    minlength: [3, 'Lo username deve avere almeno 3 caratteri'],
    trim: true
    },
    surname: {
    type: String,
    required: [true, 'Il cognome è obbligatorio'],
    minlength: [3, 'Lo username deve avere almeno 3 caratteri'],
    trim: true
    },
    email: {
        type: String,
        required: [true, "L'email è obbligatoria"],
        lowercase: true,
        unique: true,
        match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Email o password sono errati"]
    },
    password:{
        type: String,
        required: [true, "Email o password sono errati"],
        validate:{
            validator: function(value){
                return (
                    value.length >= 8 &&
                    /[A-Z]/.test(value) &&        // almeno una maiuscola
                    /[a-z]/.test(value) &&        // almeno una minuscola
                    /[0-9]/.test(value) &&        // almeno un numero
                    /[!@#$%^&*(),.?":{}|<>]/.test(value) && // almeno un simbolo
                    !/\s/.test(value)
                )
            }
        }
    },
    role:{
        type: String,
        enum: ['customer', 'admin'],
        default: "customer",
        required: true
    },
    refresh_token:{
        type: String,
        required: false
    }
}, { timestamps: true})

module.exports = mongoose.model('User', userSchema)