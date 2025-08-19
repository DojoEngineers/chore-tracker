import { connect } from 'mongoose'
import dotenv from 'dotenv'
import mongoose from 'mongoose'

dotenv.config()
const MONGO_URI = process.env.MONGODB_URI
// modified to so the db only connects 1x if this function is called from multiple places.
export const dbConnect = async () => {
    try {
        if (mongoose.connection.readyState === 1) {
            return; // Already connected
        }
        if (mongoose.connection.readyState === 2) {
            // Connection is in progress, wait for it
            return new Promise((resolve, reject) => {
                mongoose.connection.once('connected', resolve);
                mongoose.connection.once('error', reject);
            });
        }
        await connect(MONGO_URI, { dbName: 'choreApp' })
        console.log('Huzzah! You have done it. Enter the Mongo')

    }
    catch (error) { `DB connection failed --->  ${error}` }
}