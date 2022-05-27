import express, { NextFunction } from 'express'
import morgan from 'morgan'
import { reportRouter } from './controller/report'

export const app = express()

app.use(morgan('dev'))
app.use(express.json())

app.use('/', express.static('web/dist'))

app.use('/report', reportRouter)

app.use((err: Error, req: express.Request, res: express.Response, next: NextFunction) => {
  return res.status(400).json({
    error: err
  })
})
