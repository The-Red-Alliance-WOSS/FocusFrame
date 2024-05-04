const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  discordId: String,
  tasks: [
    {
      task_name: String,
      task_progress: Boolean
    }
  ]
});

const User = mongoose.model('User', UserSchema);

module.exports = User;
