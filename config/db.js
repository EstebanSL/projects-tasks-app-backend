import mongoose from 'mongoose';


/**
 * [connectDB]
 * Connection to the database
 */
const connectDB = async () => {
  try {
    const connection = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })

    const url = `${connection.connection.host}: ${connection.connection.port}`
    console.log(`Mongoose Connect at: ${url}`)
  } catch (error) {
    console.error(error)
    process.exit(1)
  }
}

export default connectDB