import { model, Schema, Document } from 'mongoose'

interface IUser extends Document {
  username: string
  name: string
  email: string
  dob: Date
  phoneNo: number
  password: string
  verified: Boolean
  status:Boolean
  place:string
  country:string
  description:string
  img:string
  public:string
}
const userSchema: Schema = new Schema({
  username: {
    type: String,
  },
  name: {
    type: String,
    required: true
  },
  dob: {
    type: Date,
  },
  phoneNo: {
    type: Number,
  },
  email: {
    type: String,
    required: true,
    trim: true
  },
  password: {
    type: String,
  },
  verified: {
    type: Boolean,
    default: false
  },
  status: {
    type: Boolean,
    default: false
  },
  place:{
    type:String
  },
  country:{
    type:String
  },
  img:{
    type:String
    },
    public:{
      type:Boolean

    }
})

export default model<IUser>('user', userSchema)
