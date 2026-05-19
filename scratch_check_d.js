const mongoose = require('mongoose');
const fs = require('fs');

if (fs.existsSync('.env.local')) {
  const content = fs.readFileSync('.env.local', 'utf-8');
  content.split('\n').forEach(line => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#')) {
      const parts = trimmed.split('=');
      const key = parts[0].trim();
      const val = parts.slice(1).join('=').trim().replace(/^['"]|['"]$/g, '');
      process.env[key] = val;
    }
  });
}

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  console.error("MONGODB_URI no definida");
  process.exit(1);
}

const TopicSchema = new mongoose.Schema({
  title: String,
  content: String,
  images: [String],
  type: String,
  createdAt: Date
});

const Topic = mongoose.models.Topic || mongoose.model('Topic', TopicSchema);

async function check() {
  await mongoose.connect(MONGODB_URI);
  console.log("Conectado a MongoDB");
  const topic = await Topic.findOne({ title: "d" }).sort({ createdAt: -1 });
  console.log("Tema 'd':", JSON.stringify(topic, null, 2));
  await mongoose.disconnect();
}

check().catch(console.error);
