import mongoose from 'mongoose';

const choreTemplateSchema = new mongoose.Schema({
  title: { type: String, required: true },
  details: { type: String, required: false },
  repeat: {
    type: String,
    enum: ["daily", "weekly", "monthly"]
  },
  day: {
    type: Number,
    required: false
  },
  creator: {
    type: String,
    required: true
  },
  worker: {
    type: String,
    required: true
  },
  needsPics: {
    type: Boolean,
    required: true
  },
  isActive: {
    type: Boolean,
    required: true
  },
  dueDate: { type: Date, required: false }
}, { timestamps: true });


// Create the Chore model from the schema
const ChoreTemplate = mongoose.model('ChoreTemplate', choreTemplateSchema);

// Export it so other files (controllers, routes) can use it
export default ChoreTemplate;

