const mongoose = require("mongoose");
const bcrypt = require("bcryptjs")
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    min: 3,
    max: 20,
    unique: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    max: 40,
    unique: true
  },
  password: {
    type: String,
    required: true,
    min: 5
  },
}, {timestamps: true})

userSchema.pre("save", async function() {
  const salt = await bcrypt.genSalt(10)
  this.password = await bcrypt.hash(this.password, salt)
})

userSchema.methods.comparepassword =  async function(candidatePassword) {
  const isMatch = await bcrypt.compare(candidatePassword, this.password)
  return isMatch
}
module.exports = mongoose.model("User", userSchema)