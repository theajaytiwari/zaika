const mongoose = require("mongoose")

const foodPartnerSchema = new mongoose.Schema({
    restaurantName: {
        type: String,
        required: true
    },
    ownerName : {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
     address: {
        type: String
     },
   
}, {
    timestamps: true
})

const foodPartnerModel = mongoose.model("food-partner", foodPartnerSchema);

module.exports = foodPartnerModel;
