import Agenda from 'agenda';
import mongoose from 'mongoose';
import { dbConnect } from './config/mongoose.config.js';
import ChoreTemplate from './models/choreTemplate.js';
import Chore from './models/chore.model.js';

let agenda;

(async function () {
  // connect to Mongo using your config (with key)
  await dbConnect();

  // reuse mongoose’s native connection
  agenda = new Agenda().mongo(mongoose.connection.db, 'agendaJobs');

// Define job
agenda.define('generate recurring chores', async () => {
  const now = new Date();
  const twoWeeksFromNow = new Date();
  twoWeeksFromNow.setDate(now.getDate() + 14);

  // Clear time to avoid mismatches
  twoWeeksFromNow.setHours(0, 0, 0, 0);

  const templates = await ChoreTemplate.find({ isActive: true});

  for (const template of templates) {
    let dueDate = new Date(twoWeeksFromNow);

    // For weekly, you might want the dueDate to align with a specific weekday
    if (template.repeat === 'weekly' && template.day) {
      // Day: 0=Sunday, 1=Monday, etc.
      const diff = (template.day + 7 - dueDate.getDay()) % 7;
      dueDate.setDate(dueDate.getDate() + diff);
    }

    // Apply dueTime from template if exists
    if (template.dueTime) {
      const [hours, minutes] = template.dueTime.split(':').map(Number);
      dueDate.setHours(hours, minutes, 0, 0);
    }

    // Create chore instance with due date exactly 2 weeks after now
    await Chore.create({
      templateId: template._id,
      title: template.title + " (gen)",
      details: template.details,
      creator: template.creator,
      worker: template.worker,
      needsPics: template.needsPics,
      stage:"incomplete",
      isActive:"true",
      repeat: template.repeat,
      dueDate
    });

    console.log(`[Agenda] Created ${template.name} due ${dueDate}`);
  }
});


  await agenda.start();
  await agenda.now('generate recurring chores');
  // Run every day at midnight
  await agenda.every('* * * * *', 'generate recurring chores');
})();

export default agenda;
