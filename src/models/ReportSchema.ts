import mongoose, { Schema, Document } from "mongoose";

export interface report extends Document {
  PostId: string;
  read:Boolean
  userText:[{
    userId:mongoose.Types.ObjectId,
    text:string
  }]
}

const ReportSchema: Schema = new Schema({
  PostId: {
    type: Schema.Types.ObjectId,
    ref: "post",
  },
  read:{
   type:Boolean,
   default:false
  },
  userText: [
    {
      userId: {
        type: Schema.Types.ObjectId,
        ref: "user",
      },
      text: {
        type: String,
      },
    },
  ],
});

export default mongoose.model<report>("report", ReportSchema);
