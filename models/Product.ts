import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: String },
  category: { type: String },
  stock: { type: Number, default: 0 },
  tags: { type: [String], default: [] },
  spiceLevel: { type: String, enum: ['mild', 'medium', 'hot', 'extra hot'], default: null },
  prepTime: { type: Number, default: null },
  isVegetarian: { type: Boolean, default: false },
  rating: { type: Number, min: 1, max: 5, default: 4.0 },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.Product || mongoose.model('Product', ProductSchema);
