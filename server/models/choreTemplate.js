import mongoose from 'mongoose';

const choreTemplateSchema = new mongoose.Schema({
  title: { type: String, required: true },
  details: { type: String, required: false },
  repeat: {
    type: String,
    enum: ["never", "daily", "weekly", "monthly"],
    required: true
  },
  weeklyRepeatDays: {
    type: [Number],
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
    required: true,
    default: true
  },
  nextRunDate: {
    type: Date,
    required: true
  },
  dueHour: {
    type: Number,
    required: true
  },
  dueMinute: {
    type: Number,
    required: true
  }
}, { timestamps: true });

choreTemplateSchema.index({ isActive: 1, nextRunDate: 1 })

// Create the Chore model from the schema
const ChoreTemplate = mongoose.model('ChoreTemplate', choreTemplateSchema);

// Export it so other files (controllers, routes) can use it
export default ChoreTemplate;

