const mongoose = require('mongoose');
const {ObjectId} = mongoose.Schema;

const categorySchema = new mongoose.Schema({
    name : {
        type: String,
        trim: true,
    },
    slug: {
        
    }
});