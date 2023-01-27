import mongoose, { Schema, Document } from "mongoose";

export interface report extends Document {
  PostId: string;
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
