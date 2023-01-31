import mongoose, { Schema, Document } from "mongoose";

export  interface AddPost extends Document{
    userId:mongoose.Types.ObjectId;
    description: string;
    img: string[];
    likes: string[];
    status:Boolean
}

const videoSchema:Schema=new Schema({
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
    img: {
        type: String
    },
    likes:[{
        type: String
    }]
},{
    timestamps: true,
})

export default mongoose.model<AddPost>("video",videoSchema );