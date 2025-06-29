const mongoose = require("mongoose")

const experienceSchema = mongoose.Schema({
   position: String,
   company: String,
   city: String,
   country: String,
   startDate: Date,
   endDate: Date,
   description: String,
   current: Boolean
})

module.exports = mongoose.model("Experience", experienceSchema)