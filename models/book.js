const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const booksSchema = mongoose.Schema({
  title: { type: String, require: true, unique: true },
  author: { type: String },
  imageUrl: { type: String, require: true },
  year: { type: Number },
  genre: { type: String },
  ratings: [
    {
      userId: { type: String, required: true },
      grade: { type: Number, min: 1, max: 5, required: true },
    },
  ],
  averageRating: { type: Number },
});

booksSchema.plugin(uniqueValidator);

module.exports = mongoose.model("books", booksSchema);
