import mongoose, { Schema, Document } from "mongoose";

export interface Comment extends Document {
  userId: mongoose.Types.ObjectId;
  postId: mongoose.Types.ObjectId;
  comment: string;
  likes: string[];
  replayComment:[{
    userId:mongoose.Types.ObjectId,
    comment:String,
    likes: string[];
}]
}

const replayCommentSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "user",
    },
    comment: {
      type: String,
    },
    likes: [
        {
          type: String,
        },
      ],
  },
  {
    timestamps: true,
  }
);

const videoCommentSchema: Schema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    postId: {
      type: Schema.Types.ObjectId,
      ref: "video",
      required: true,
    },
    comment: {
      type: String,
      required: true,
    },
    likes: [
      {
        type: String,
      },
    ],
    replayComment: [replayCommentSchema],
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<Comment>("videoComment", videoCommentSchema);
