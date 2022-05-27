import express from 'express'
import Report from '../db/models/Report'

import { body, param, validationResult } from 'express-validator'

const validationFormatted = validationResult.withDefaults({
  formatter: (param) => {
    return param.msg
  }
})

export const reportRouter = express.Router()

reportRouter.get(
  '/:url',
  param('url', 'No url provided').exists().isURL({
    require_protocol: true
  }),
  async (req, res, next) => {
    const url: URL = new URL(decodeURIComponent(req.params?.url))

    let cleanUrl = url.origin + url.pathname

    if (cleanUrl[cleanUrl.length - 1] === '/') {
      cleanUrl = cleanUrl.slice(0, cleanUrl.length - 1) // remove trailing slash
    }

    const pass = validationFormatted(req)

    if (!pass.isEmpty()) return next(pass.array())

    try {
      const reports = await Report.find({
        url: cleanUrl
      })

      return res.json({
        error: null,
        reports
      })
    } catch (error) {
      return next(error)
    }
  }
)

reportRouter.post(
  '/',
  body('url', 'No url provided or invalid').exists().isURL({
    require_protocol: true
  }),
  body('comment', 'No comment provided').exists().escape(),
  async (req, res, next) => {
    const { url, comment } = req.body
    const pass = validationFormatted(req)

    if (!pass.isEmpty()) return next(pass.array())

    try {
      const report = new Report({
        url,
        comment
      })

      await report.save()

      return res.json({
        error: null,
        report
      })
    } catch (error) {
      return next(error)
    }
  }
)

reportRouter.patch('/',
  body('id', 'No id provided or dont exist').exists().isMongoId(),
  body('useful', 'No useful is provided or is invalid').exists().isBoolean({
    strict: true
  }),
  async (req, res, next) => {
    const pass = validationFormatted(req)

    if (!pass.isEmpty()) return next(pass.array())

    try {
      const { useful, id } = req.body
      const report = await Report.findById(id)

      if (useful) {
        report.opinions[0] += 1
      } else {
        report.opinions[1] += 1
      }

      await report.save()

      return res.json({
        error: null,
        report
      })
    } catch (error) {
      return next(error)
    }
  }
)

reportRouter.delete('/',
  body('id', 'No id provided or dont exist').exists().isMongoId(),
  body('admin', 'No admin is provided or is invalid').exists().isLength({
    min: 10,
    max: 10
  }),
  async (req, res, next) => {
    if (req.body.admin !== process.env.ADMIN_TOKEN) return next('Invalid token')

    const pass = validationFormatted(req)

    if (!pass.isEmpty()) return next(pass.array())

    try {
      const { id } = req.body
      const report = await Report.findByIdAndDelete(id)

      return res.json({
        error: null,
        report
      })
    } catch (error) {
      return next(error)
    }
  }
)
