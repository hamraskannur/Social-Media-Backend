import { model, Schema, Document, Date } from 'mongoose'

interface token extends Document {
  userId: string
  token: string
}
const tokenSchema: Schema = new Schema({
  userId: {
    type: String,
    required: true
  },
  token: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now(),
    expires: 3600
  }
})

export default model<token>('token', tokenSchema)
