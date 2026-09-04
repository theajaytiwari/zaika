const mongoose = require('mongoose');

const foodSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true 
},
    video: { type: String, default: "" },
    description: {
        type: String,
    },
    price: {
        type: Number,
        required: true
    },
    category: { type: String, default: "Chef special" },
    likes: { type: Number, default: 0 },
    foodPartner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "food-partner",
    }
}, {
    timestamps: true
})

const foodModel = mongoose.model("food", foodSchema);

module.exports = foodModel;
