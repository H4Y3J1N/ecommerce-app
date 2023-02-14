const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema;

const userSchema = new mongoose.Schema(
    {
    name : String,
    email : {
        type : String,
        required: true,
        index : true,
    },
    password : {
        type: String,
        required: [true, "Hei buddy Password is required"],
    },
    role: {
        type : String,
        default : "subscriber",
    },
    cart: {
        type: Array,
        default: [],
    },
    adress: String,
    //wishlist: [{type: ObjectId, ref:"Product"}],
    },
    {timestamps: true}
);


module.exports = mongoose.model('User', userSchema);