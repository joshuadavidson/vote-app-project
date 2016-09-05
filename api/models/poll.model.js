const mongoose = require('mongoose');

var pollSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },

  authorId: {
    type: String,
    required: true
  },

  questions: [String], //array of questions for the poll

  responses: [Number], //array of numbers indicating the votes for each question

  respondents: [String], //array of user ids or ip addresses that have responded

}, {
  timestamps: true, //include created and updated timestamps
  retainKeyOrder: true //ensure user document properties are saved in the same order that they are passed in
});

module.exports = mongoose.model('Poll', pollSchema);
