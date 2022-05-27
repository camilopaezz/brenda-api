import { Schema, model } from 'mongoose'

const reportSchema = new Schema({
  url: {
    type: Schema.Types.String,
    validate: {
      validator: (url: string) => {
        return /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/.test(
          url
        )
      }
    },
    required: true
  },
  comment: {
    type: Schema.Types.String,
    trim: true,
    minlength: 3,
    maxlength: 255
  },
  createdAt: {
    type: Schema.Types.Date,
    default: Date.now
  },
  opinions: {
    type: [Schema.Types.Number],
    default: [0, 0]
  }
})

export default model('Report', reportSchema)
