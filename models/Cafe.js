import mongoose from 'mongoose';

const cafeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  logo: {
    type: String // store the URL or path of the image here
  },
  location: {
    type: String,
    required: true
  }
});

export const Cafe = mongoose.model('Cafe', cafeSchema);
