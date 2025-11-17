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

const dbCache = cached as {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
};

let cronStarted = false;

export async function connectDB() {
  if (!cronStarted) {
    startBirthdayCron();
    cronStarted = true;
  }

  if (dbCache.conn) return dbCache.conn;

  if (!dbCache.promise) {
    dbCache.promise = mongoose.connect(MONGODB_URI).then((mongoose) => mongoose);
  }

  dbCache.conn = await dbCache.promise;
  return dbCache.conn;
}
