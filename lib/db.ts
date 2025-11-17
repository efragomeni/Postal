import mongoose from "mongoose";
import { startBirthdayCron } from "./birthdayCron";

const MONGODB_URI = process.env.MONGODB_URI!;
if (!MONGODB_URI) {
  throw new Error("Por favor define MONGODB_URI en .env.local");
}

declare global {
  // eslint-disable-next-line no-var
  var _mongooseConnection:
    | { conn: typeof mongoose | null; promise: Promise<typeof mongoose> | null }
    | undefined;
}

let cached = global._mongooseConnection;
if (!cached) {
  cached = global._mongooseConnection = { conn: null, promise: null };
}

let cronStarted = false;

export async function connectDB() {
  if (!cronStarted) {
    startBirthdayCron();
    cronStarted = true;
  }

  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI).then((mongoose) => mongoose);
  }

  cached.conn = await cached.promise;
  return cached.conn;
}
