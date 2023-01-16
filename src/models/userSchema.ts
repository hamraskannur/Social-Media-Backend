import { model, Schema, Document } from 'mongoose'

interface IUser extends Document {
  username: string
  name: string
  email: string
  dob: Date
  phoneNo: number
  password: string
  verified: boolean
  status:boolean
  city:string
  country:string
  description:string
  img:string
  public:string
  PostalCode:number
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
  city:{
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

  },PostalCode:{
    type:Number
  }

})

export default model<IUser>('user', userSchema)
