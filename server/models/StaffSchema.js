const mongoose = require('mongoose');
const { Schema } = mongoose;

const StaffSchema = new Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'admin',
  },
  name: {
    type: String,
    required: true,
  },
  gender: {
    type: String,
    required: true,
  },
  phone: {
    type: Number,
    required: true,
  },
  dob: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  country: {
    type: String,
    required: true,
  },
  department: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  photo: {
    public_id: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
  },
  date_of_join: {
    type: String,
    required: true,
  },
  state: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  isAvailable: {
    type: Boolean,
    default: true,
  },
  currentTaskId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'task',
    default: null,
  },
  created_at: {
    type: Date,
    default: Date.now,
    immutable: true,
  },
});

const Staff = mongoose.model('staff', StaffSchema);
module.exports = Staff;