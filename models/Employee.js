import mongoose from 'mongoose';

const employeeSchema = new mongoose.Schema({
  employee_id: {
    type: String,
    required: true,
    unique: true,
    match: /^UI[0-9A-Za-z]{7}$/
  },
  name: {
    type: String,
    required: true
  },
  email_address: {
    type: String,
    required: true,
    match: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i
  },
  phone_number: {
    type: String,
    required: true,
    match: /^[89][0-9]{7}$/
  },
  gender: {
    type: String,
    required: true,
    enum: ['Male', 'Female']
  },
  cafe: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Cafe'
  },
  start_date: {
    type: Date,
    default: Date.now
  }
});

export const Employee = mongoose.model('Employee', employeeSchema);
