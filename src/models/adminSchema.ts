import { model, Schema, Document } from 'mongoose'

interface token extends Document {
  name: string
  email: string
  password: string
}
const adminSchema: Schema = new Schema({
  name: {
    type: String
  },
  email: {
    type: String
  },
  password: {
    type: String
  }
})

export default model<token>('admin', adminSchema)
