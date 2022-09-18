const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  firstName: {type: String, required: true},
  lastName: {type: String, required: true},
  userId: {type: String, required: true, unique: true}
},{
  timestamps: true
})


const UserModel = mongoose.model('User',userSchema )

module.exports = UserModel;