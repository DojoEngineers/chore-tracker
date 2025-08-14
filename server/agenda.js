import Agenda from 'agenda';
import Chore from './models/Chore.js';
import ChoreInstance from './models/ChoreInstance.js';

const agenda = new Agenda({
  db: { address: 'mongodb://localhost:27017/yourDB', collection: 'agendaJobs' }
});

agenda.define('create chore instance', async (job) => {
  const { choreId, choreData } = job.attrs.data;

  const chore = await Chore.findById(choreId);
  if (!chore) {
    console.log(`[Agenda] Chore not found for ID: ${choreId}`);
    return;
  }

  const now = new Date();
  let dueDate = new Date(now);

  if (chore.repeat === 'weekly') {
    dueDate.setDate(now.getDate() + 7);
  } else if (chore.repeat === 'daily') {
    dueDate.setDate(now.getDate() + 1);
  }

  // If user specified a due time (HH:mm), set it
  if (chore.dueTime) {
    const [hours, minutes] = chore.dueTime.split(':').map(Number);
    dueDate.setHours(hours, minutes, 0, 0);
  }

  await ChoreInstance.create({
    choreId,
    name: choreData.name,
    createdAt: now,
    dueDate
  });

  console.log(`[Agenda] Created chore instance: ${choreData.name}, due: ${dueDate}`);
});

(async function () {
  await agenda.start();
  console.log('[Agenda] Scheduler started');
})();

module.exports = agenda;
