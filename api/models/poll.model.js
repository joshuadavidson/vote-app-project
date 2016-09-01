const mongoose = require('mongoose');

var pollSchema = new mongoose.schema({
  title: {
    type: String,
    required: true
  },

});

module.exports = mongoose.model('Poll', pollSchema);
