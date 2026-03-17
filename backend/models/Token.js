import mongoose from 'mongoose';

const tokenSchema = new mongoose.Schema({
  phone: {
    type: String,
    required: true,
  },
  purpose: {
    type: String,
    required: true,
    enum: ['ID Creation', 'FIR', 'Passport', 'Complaint'],
  },
  urgent: {
    type: Boolean,
    default: false,
  },
  tokenNumber: {
    type: String,
    required: true,
  },
  counter: {
    type: Number,
    required: true,
    min: 1,
    max: 4,
  },
  status: {
    type: String,
    enum: ['pending', 'called', 'completed'],
    default: 'pending',
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
}, {
  timestamps: true,
});

export default mongoose.model('Token', tokenSchema);
