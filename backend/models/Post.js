const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    title: {
        type: String
    },
    content: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    comments: [
        {
            author: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
                required: true
            },
            content: {
                type: String,
                required: true
            },
            date: {
                type: Date,
                default: Date.now
            }
        }
    ],
    peopleLiked: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: false
    }],
    images: [{
        url: String,
        public_id: String
    }]
})

module.exports = mongoose.model("Post", postSchema);