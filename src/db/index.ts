import mongoose from 'mongoose'

export const connectDB = async () => {
  await mongoose.connect(process.env.DB_URL || '', {
    dbName: process.env.DB_NAME || '',
    user: process.env.DB_USER || '',
    pass: process.env.DB_PASS || ''
  })

  console.log('DB connected')
}
