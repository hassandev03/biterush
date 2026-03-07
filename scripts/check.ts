import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['admin', 'customer'], default: 'customer' },
  createdAt: { type: Date, default: Date.now }
});

const User = mongoose.models.User || mongoose.model('User', UserSchema);

async function checkUsers() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error('No URI');
    process.exit(1);
  }
  await mongoose.connect(uri);
  const users = await User.find({});
  console.log(users);
  process.exit(0);
}

checkUsers();
