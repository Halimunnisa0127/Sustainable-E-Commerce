// log.js
const mongoose = require("mongoose")

const logSchema = new mongoose.Schema({

 prompt: String,

 response: Object,

 module: String,

 createdAt: {
  type: Date,
  default: Date.now
 }

})

module.exports = mongoose.model("Log", logSchema)

