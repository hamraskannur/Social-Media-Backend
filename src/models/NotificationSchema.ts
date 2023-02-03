import mongoose, { Schema, Document } from "mongoose";

export interface report extends Document {
  userId: mongoose.Types.ObjectId;
  userText: [
    {
      userId: mongoose.Types.ObjectId;
      PostId: mongoose.Types.ObjectId;
      read: Boolean;
      text: string;
    }
  ];
}

const NotificationSchema: Schema = new Schema({
  userId: {
    type: mongoose.Types.ObjectId,
    ref: "user",
  },
  userText: [
    {
      PostId: {
        type: Schema.Types.ObjectId,
        ref: "post",
      },
      userId: {
        type: mongoose.Types.ObjectId,
        ref: "user",
      },
      read: {
        type: Boolean,
        default: false,
      },
    },
  ],
});

export default mongoose.model<report>("notification", NotificationSchema);
