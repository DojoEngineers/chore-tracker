import mongoose from 'mongoose';

const ChoreTemplate = new mongoose.Schema({
  choreId: { type: mongoose.Schema.Types.ObjectId, ref: 'Chore', required: true },
  name: { type: String, required: true },
  repeat: {
    type: String,
    enum: ["daily", "weekly", "monthly"]
  },
  day: {
    type: String,
    enum: ["mon", "tue", "weds", "thurs", "fri", "sat", "sun"],
    required: false
  },
  createdAt: { type: Date, default: Date.now },
  dueDate: { type: Date, required: true }
});

export default mongoose.model('ChoreTemplate', ChoreTemplate);
