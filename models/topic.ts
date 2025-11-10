import mongoose, { Schema, models } from "mongoose";

const ReplySchema = new Schema({
  author: { type: String, required: true },
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const TopicSchema = new Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  // Podrías guardar el userId también si luego querés vincular usuarios

  author: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  // subdocumentos para las respuestas
  replies: [ReplySchema],
});

const Topic = models.Topic || mongoose.model("Topic", TopicSchema);

export default Topic;
