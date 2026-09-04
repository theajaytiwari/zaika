const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    phoneNumber: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true,
    }
},
  {
    timestamps: true
  }

)

const userModel = mongoose.model("user", userSchema);

module.exports = userModel;
