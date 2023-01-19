import mongoose, { Schema, Document } from "mongoose";

export  interface chat extends Document{
    members:[]
}

const chatSchema: Schema = new Schema(
  {
    members: {
      type: Array,
    },
  },
  {
    timestamps: true,
  }
);
export default mongoose.model<chat>("chat",chatSchema );