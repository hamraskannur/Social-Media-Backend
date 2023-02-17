import mongoose,{ model, Schema, Document } from 'mongoose'

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
  Address:string
  description:string
  ProfileImg:string
  coverImg:string
  public:Boolean
  PostalCode:number
  Requests: string[];
  Followers: string[];
  Following: string[];
  saved:string[];
  read:Boolean
  notification:[{
    userId:mongoose.Types.ObjectId
    postId:mongoose.Types.ObjectId
    text:string
  }]

}
const userSchema: Schema = new Schema({
  username: {
    type: String,
  },
  Address:{
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
  ProfileImg:{
    type:String
    },
  coverImg:{
    type:String
  },
  public:{
    type:Boolean,
    default:true

  },PostalCode:{
    type:Number
  },
  Requests:[{
    type: Schema.Types.ObjectId,
    ref:"post"
  }],
  Followers:[{
    type: Schema.Types.ObjectId,
    ref:"post"
  }],
  Following:[{
    type: Schema.Types.ObjectId,
    ref:"post"
  }],
  saved:[{
    type: Schema.Types.ObjectId,
    ref:"post"
  }],
  description:{
    type:String
  },
  read:{
    type:Boolean
  },
  notification:[{
    postId:{
      type:mongoose.Types.ObjectId,
      ref:"post"
    },
    userId:{
      type:mongoose.Types.ObjectId,
      ref:"user"
    },
    text:{
      type:String
    }
  }]


},
{
  timestamps: true,
})

export default model<IUser>('user', userSchema)
