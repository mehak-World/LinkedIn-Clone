const mongoose = require("mongoose")


if (mongoose.models.Profile) {
  delete mongoose.models.Profile;
}

const profileSchema = new mongoose.Schema({
    profileTitle: String,
    bgPic: {
        type: String
    },
    profilePic: String,
    city: String,
    country: String,
    connections: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    about: String,
    pendingRequests: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    education: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Education"
    }],
    experience: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Experience"
    }],
    notifications: [
        {
            from: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
            to: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
            message: String,
            date: Date,
            notifType: String
        }
    ],
    messages: [
        {
            sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, 
            receiver: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, 
            msg: String,
            images: [String],
            date: {
                type: Date,
                default: Date.now
            }
        }
    ]
})



module.exports = mongoose.model("Profile", profileSchema)