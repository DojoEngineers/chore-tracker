import 'dotenv/config'

export default {
    expo: {
        name: "ChoreTracker",
        slug: "chore-tracker",
        extra: {
        BACKEND_API_URL: process.env.BACKEND_API_URL,
        },
    },
}