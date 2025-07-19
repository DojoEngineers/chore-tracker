import { connect } from 'mongoose'
import dotenv from 'dotenv'

dotenv.config()
const MONGO_URI = process.env.MONGODB_URI

export const dbConnect = async () => {
    try {
        await connect( MONGO_URI, { dbName: 'choreApp' })
        console.log('Huzzah! You have done it. Enter the Mongo')
    }
    catch( error ){ `DB connection failed --->  ${error}` }
}