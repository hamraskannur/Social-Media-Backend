import mongoose, { Schema, Document } from "mongoose";

export  interface Comment extends Document{
    userId:mongoose.Types.ObjectId;
    postId:mongoose.Types.ObjectId;
    comment: string;
    likes: string[];
}

const commentSchema:Schema=new Schema({
    userId:{
        type: Schema.Types.ObjectId,
        ref: "user",
        required: true,
    },
    postId:{
        type: Schema.Types.ObjectId,
        ref: "post",
        required: true,
    },
    comment:{
        type:String,
        required:true
    },
    likes:[{
        type: String
    }]
},{
    timestamps: true,
})


export default mongoose.model<Comment>("comment",commentSchema );