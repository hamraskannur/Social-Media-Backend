import mongoose, { Schema, Document } from "mongoose";

export  interface AddPost extends Document{
    userId:mongoose.Types.ObjectId;
    description: string;
    img: string[];
    likes: string[];
    status:Boolean
    video:true
    shorts:string
}

const postSchema:Schema=new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: "user",
        required: true,
      },
      description:{
        type: String,
    },  
    status:{
        type:Boolean,
        default:true
    },
    edit:{
        type:Boolean,
        default:false
    },
    shorts:{
        type:String,
        default:null
    },
    img: [{
        type: String,
        default:null
    }],
    likes:[{
        type: String
    }]
},{
    timestamps: true,
})

export default mongoose.model<AddPost>("post",postSchema );