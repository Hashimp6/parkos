import mongoose from "mongoose";

const categorySuggestionSchema = new mongoose.Schema(
  {
    candidateCategory: {
      type: String,
    },
  
  
  },

);

export default mongoose.model("CategorySuggestion", categorySuggestionSchema);