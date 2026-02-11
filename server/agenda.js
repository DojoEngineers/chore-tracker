import Agenda from 'agenda';
import mongoose from 'mongoose';
import ChoreTemplate from './models/choreTemplate.js';
import Chore from './models/chore.model.js';

let agenda;

(async function () {

  if (mongoose.connection.readyState !== 1) {
    await new Promise((resolve, reject) => {
      if (mongoose.connection.readyState === 1) resolve();
      else {
        mongoose.connection.once('connected', resolve);
        mongoose.connection.once('error', reject);
      }
    });
  }
  // must this this initalization or the db won't connect.
  agenda = new Agenda({
    db: {
      address: process.env.MONGODB_URI,
      collection: 'agendaJobs',
      options: {
        useNewUrlParser: true,
        useUnifiedTopology: true
      }
    }
  });
  //This method doesnt work:
  // agenda = new Agenda().mongo(mongoose.connection.db, 'agendaJobs');
  console.log("agenda defined")

  // Define job
  agenda.define('generate chores', async () => {
    //  first set time. if daily, just set for 1 week in future. if weekly, set for in future. monthly, take day/time and add to now's month/year
    console.log("in generate chores")
    const templates = await ChoreTemplate.find({ isActive: true });

    for (const template of templates) {
      console.log("template", template)
      const now = new Date();
      const dueDate = new Date(now)
      const tempDate = new Date(template.dueDate)
      const hours = tempDate.getHours();
      const minutes = tempDate.getMinutes();

      // is daily, create a chore that is due 1 week from now.
      if (template.repeat == "daily") {
        console.log("in daily")
        dueDate.setDate(now.getDate() + 7)
      }

      // For weekly, only run code if the dueDate's day of the week is today (if so, create a chore due 1 week from now)
      else if (template.repeat === 'weekly') {
        console.log("in weekly")
        // Day: 0=Sunday, 1=Monday, etc.
        const today = new Date()
        const todayDay = today.getDay()
        console.log("day", template.day, "todayDay", todayDay)
        if (todayDay == template.day) {
          dueDate.setDate(today.getDate() + 7)
          dueDate.setHours(parseInt(hours), parseInt(minutes), 0, 0);
          console.log("weekly duedate", dueDate)
        }
        else {
          return
        }
      }

      else if (template.repeat === 'monthly') {
        console.log("in monthly")
        const targetDate = tempDate.getDate()
        const todayDate = now.getDate()
        console.log("today", todayDate, "tempdate", targetDate)
        // generate chore for next month if today's date matches dueDate OR (to account for leap years) if dueDate is over 29.
        if (todayDate == targetDate || (targetDate > 29 && todayDate == 29)) {
          dueDate.setDate(targetDate)
          dueDate.setMonth(now.getMonth + 1)
          dueDate.setHours(parseInt(hours), parseInt(minutes), 0, 0)
          console.log("monthly dueDate", dueDate)
        }
        else {
          return
        }
      }

      else {
        console.log("repeat-value error")
        return
      }

      // Create chore instance with due date that was created in one of the code blocks above.
      console.log("creating chore")
      try {
        const chore = await Chore.create({
          templateId: template._id,
          title: template.title + " (gen)",
          details: template.details,
          creator: template.creator,
          worker: template.worker,
          needsPics: template.needsPics,
          stage: "incomplete",
          repeat: template.repeat,
          dueDate: dueDate,
          isActive: true,
        });
        console.log("chore", chore)
      }
      catch (error) {
        console.log("error", error)

      }

      console.log(`[Agenda] Created ${template.title} due ${dueDate}`);
    }
  });

  console.log("starting...")
  await agenda.start();
  console.log("started")
  //run every minute
  // await agenda.every('* * * * *', 'generate recurring chores');
})();


export const startJobs = async () => {
  async function runNow() {
    console.log("in runnow")
    await agenda.now('generate chores');
  }
  setTimeout(runNow, 2000)
}

export default agenda;
