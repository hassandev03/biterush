import mongoose from 'mongoose';

let MONGODB_URI = process.env.MONGODB_URI!;

// Fix common typo where database name is appended after query parameters
if (MONGODB_URI && MONGODB_URI.includes('?appName=Cluster0/biterush')) {
  MONGODB_URI = MONGODB_URI.replace('?appName=Cluster0/biterush', 'biterush?appName=Cluster0');
}

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}

let cached = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

async function dbConnect() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      return mongoose;
    });
  }
  cached.conn = await cached.promise;
  return cached.conn;
}

export default dbConnect;
