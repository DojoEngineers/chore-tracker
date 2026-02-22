import Agenda from 'agenda';
import mongoose from 'mongoose';
import dayjs from 'dayjs';
import ChoreTemplate from './models/choreTemplate.js';
import Chore from './models/chore.model.js';
import utc from 'dayjs/plugin/utc.js';
import timezone from 'dayjs/plugin/timezone.js';

let agenda

export const initAgenda = async () => {

    if (!process.env.MONGODB_URI) throw new Error("MONGODB_URI not set")

    // Connect to MongoDB
    if (mongoose.connection.readyState !== 1) {
        await mongoose.connect(process.env.MONGODB_URI)
        console.log("MongoDB connected")
    }

    agenda = new Agenda({
        db: {
            address: process.env.MONGODB_URI,
            collection: 'agendaJobs',
            options: { useNewUrlParser: true, useUnifiedTopology: true }
        }
    })

    // Define the recurring chores job
    agenda.define('generate chores', async () => {

        const now = dayjs()

        // Only templates that are active and due
        const templates = await ChoreTemplate.find({
            isActive: true,
            repeat: { $in: ['daily', 'weekly', 'monthly'] },
            nextRunDate: { $lte: now.toDate() }
        })

        for (const template of templates) {
            let nextDue = dayjs(template.nextRunDate).tz(template.timezone || 'UTC')
            const dueHour = template.dueHour ?? 0
            const dueMinute = template.dueMinute ?? 0

            const weeklyDays = template.weeklyRepeatDays ?? []

            let maxIterations
            switch(template.repeat) {
                case 'daily': maxIterations = 30; break
                case 'weekly': maxIterations = 5; break
                case 'monthly': maxIterations = 1; break
                default: maxIterations = 10; break
            }

            let iterations = 0

            while ((nextDue.isBefore(now) || nextDue.isSame(now, 'minute')) && iterations < maxIterations) {
                // console.log(`[Agenda] Generating chore for template "${template.title}" due ${nextDue.toISOString()}`)

                try {
                    const choreDueDate = nextDue.hour(dueHour).minute(dueMinute).second(0)

                    await Chore.create({
                        templateId: template._id,
                        title: template.title,
                        details: template.details,
                        creator: template.creator,
                        worker: template.worker,
                        needsPics: template.needsPics,
                        stage: "incomplete",
                        stageDate: new Date(),
                        repeat: template.repeat,
                        weeklyRepeatDays: template.weeklyRepeatDays || [],
                        dueDate: choreDueDate.toDate(),
                        isActive: true
                    })
                        
                    // Compute next occurrence
                    if (template.repeat === 'daily') nextDue = nextDue.add(1, 'day').startOf('day')
                    else if (template.repeat === 'weekly') {
                        if (!weeklyDays.length) break
                        const sorted = [...weeklyDays].sort((a,b)=>a-b)
                        const currentDay = nextDue.day()
                        let nextDay = sorted.find(d => d > currentDay)
                        if (nextDay !== undefined) {
                            let daysToAdd = nextDay - currentDay
                            nextDue = nextDue.add(daysToAdd, 'day').startOf('day')
                        } else {
                            let daysToAdd = (sorted[0] + 7) - currentDay
                            nextDue = nextDue.add(daysToAdd, 'day').startOf('day')
                        }
                    }
                    else if (template.repeat === 'monthly') nextDue = nextDue.add(1, 'month').startOf('day')
                    else break
                    
                    iterations++
                } catch (err) {
                    console.error(`[Agenda] Error generating chore for template "${template.title}":`, err)
                    break
                }
            }

            template.nextRunDate = nextDue.toDate()
            await template.save()
            // console.log(`[Agenda] Finished processing template "${template.title}". Next run: ${template.nextRunDate}`)

            if (iterations >= maxIterations) {
                console.warn(`[Agenda] Stopped loop for "${template.title}" after max iterations`)
            }
        }

        console.log("Repeating chores cron job complete")
    })

    // Start Agenda
    await agenda.start()
    console.log("Agenda started")
}

// Trigger the generate chores job
export const startJobs = async () => {
    if (!agenda) {
        console.warn("Agenda not initialized yet")
        return
    }
    await agenda.now('generate chores')
    console.log("Repeating chores cron job running")
}

export default agenda