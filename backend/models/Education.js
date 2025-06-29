const mongoose = require("mongoose")

const educationSchema = mongoose.Schema({
    school: String,
    fieldOfStudy: String,
    startDate: Date,
    endDate: Date,
    current: Boolean,
    description:String,
    city: String,
    country: String
})

module.exports = mongoose.model("Education", educationSchema)