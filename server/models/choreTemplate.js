import mongoose from 'mongoose';

const ChoreTemplate = new mongoose.Schema({
  choreId: { type: mongoose.Schema.Types.ObjectId, ref: 'Chore', required: true },
  name: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  dueDate: { type: Date, required: true }
});

export default mongoose.model('ChoreTemplate', ChoreTemplate);
