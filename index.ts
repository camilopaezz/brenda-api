import { config } from 'dotenv'

import { app } from './src/server'
import { connectDB } from './src/db'

if (!process.env.PORT) {
  config()
}

connectDB()

export const server = app.listen(process.env.PORT, () => {
  console.log('Server is running on port 3000')
})
