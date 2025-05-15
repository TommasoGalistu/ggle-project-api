const mongoose = require('mongoose');

const tokenSchema = new mongoose.Schema({
    id_user: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User',
        required: true
    },
    id_admin: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User',
        required: true
    },
    token: {
    type: String,
    required: true
    },
    tokenType: {
    type: String,
    enum: ['token_google', 'token_refresh_google', 'token_session'],
    
    },
    tokenOf:{
      type: String,
      enum: ['admin', 'customer'],
      required: true
    }

}, { timestamps: true})

module.exports = mongoose.model('tokens', tokenSchema);