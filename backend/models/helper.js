const mongoose = require("mongoose");

const CategorySuggestionSchema = new mongoose.Schema(
  {
    candidateCategory: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("CategorySuggestion", CategorySuggestionSchema);