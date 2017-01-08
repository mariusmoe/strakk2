// Importing Node packages required for schema
const mongoose = require('mongoose'),
      Schema = mongoose.Schema;

//================================
// Recipe Schema
//================================
const RecipeSchema = new Schema({
  strakkId:{
    type: Number,
    unique: true,
    required: true
  },
  title:{
    type: String,
    required: true
  },
  intro:{
    type: String,
    required: true
  },
  txt:{
    type: String,
    required: true
  },
  price:{
    type: Number,
    required: false
  },
  coverimg:{
    type: String,
    required: false
  },
  symbolLink:{
    type: String,
    required: false
  },
  symbolText:{
    type: String,
    required: false
  },
  otherImg:{
    type: String,
    required: false
  },
  diagramImg:{
    type: String,
    required: false
  }
});

module.exports = mongoose.model('Recipes', RecipeSchema);
