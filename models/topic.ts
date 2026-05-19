import mongoose, { Schema, models } from "mongoose";

const ReplySchema = new Schema({
  // author: { type: String, required: true },
  author: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  // profileImage: { type: String },
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const TopicSchema = new Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  images: [{ type: String }],


  author: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  profileImage: { type: String },
  // normal | birthday
  type: { type: String, default: "normal" },

  createdAt: { type: Date, default: Date.now },
  reported: { type: Boolean, default: false },
  reportedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  // subdocumentos para las respuestas
  replies: [ReplySchema],
});

const Topic = models.Topic || mongoose.model("Topic", TopicSchema);

export default Topic;
