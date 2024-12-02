const mongoose = require('mongoose');

// Define the schema for the item
const itemSchema = new mongoose.Schema({
    itemname: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    itemquestion: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        required: true,
        enum: ['Lost', 'Found'], 
    },
    images: [
        {
            url: {
                type: String,
                required: true,
            },
            public_id: {
                type: String,
                required: true,
            },
        },
    ],
    userId: {
        type: mongoose.Schema.Types.ObjectId, // Reference to the User model
        required: true, 
        ref: 'Users ' // Reference to the User model
    },
}, { timestamps: true }); 

const Item = mongoose.model('Item', itemSchema);

module.exports = Item;