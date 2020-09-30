const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const favItemSchema = new Schema({
  backdrop_path: {
    type: String,
    required: true,
  },
  vote_average: {
    type: Number,
    required: true,
  },
  popularity: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  release_date: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    required: true,
  },
  genres: {
    type: Array,
    required: true,
  },

  overview: {
    type: String,
    required: true,
  },
  poster_path: {
    type: String,
    required: true,
  },
});
const fav = mongoose.model("MovieMagicDatabase", favItemSchema);

module.exports = fav;
