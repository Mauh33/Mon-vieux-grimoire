const mongoose = require("mongoose");

const booksSchema = mongoose.Schema({
  title: { type: String, require: true },
  author: { type: String },
  imageUrl: { type: String, require: true },
  year: { type: Number },
  genre: { type: String },
  rating: [{ grade: { type: Number } }],
  averageRating: { type: Number },
});

module.exports = mongoose.model("books", booksSchema);
