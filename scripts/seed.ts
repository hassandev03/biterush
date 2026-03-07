import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

// Define Models inline to avoid Next.js import issues in a raw Node script
const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['admin', 'customer'], default: 'customer' },
  createdAt: { type: Date, default: Date.now }
});

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: String },
  category: { type: String },
  stock: { type: Number, default: 0 },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now }
});

const User = mongoose.models.User || mongoose.model('User', UserSchema);
const Product = mongoose.models.Product || mongoose.model('Product', ProductSchema);

const sampleProducts = [
  // --- Burgers ---
  { name: 'Zinger Burger', description: 'Crispy fried chicken thigh fillet with spicy mayo and fresh lettuce in a sesame bun.', price: 4.99, image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80', category: 'Burgers', stock: 100 },
  { name: 'Grilled Chicken Burger', description: 'Healthy grilled chicken breast with tomatoes, lettuce, and garlic sauce.', price: 5.49, image: 'https://images.unsplash.com/photo-1606755962773-d324e0a13086?auto=format&fit=crop&w=800&q=80', category: 'Burgers', stock: 60 },
  { name: 'Jalapeno Beef Burger', description: 'Spicy beef patty loaded with jalapenos, pepper jack cheese, and spicy sauce.', price: 6.99, image: 'https://images.unsplash.com/photo-1553979459-d2229ba7433b?auto=format&fit=crop&w=800&q=80', category: 'Burgers', stock: 50 },
  { name: 'Mushroom Swiss Burger', description: 'Juicy beef patty topped with sautéed mushrooms and melted Swiss cheese.', price: 7.49, image: 'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?auto=format&fit=crop&w=800&q=80', category: 'Burgers', stock: 40 },
  { name: 'BBQ Smokey Burger', description: 'Beef patty with smoky BBQ sauce, crispy onion rings, and cheddar cheese.', price: 7.99, image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=800&q=80', category: 'Burgers', stock: 45 },
  { name: 'Double Zinger Burger', description: 'Two crispy fried chicken fillets with cheese and spicy mayo for the ultimate hunger.', price: 6.99, image: 'https://images.unsplash.com/photo-1615719413546-198b25453f85?auto=format&fit=crop&w=800&q=80', category: 'Burgers', stock: 55 },
  { name: 'Fish Fillet Burger', description: 'Crispy fried fish fillet with tartar sauce and fresh lettuce.', price: 5.99, image: 'https://images.unsplash.com/photo-1521305916504-4a1121188589?auto=format&fit=crop&w=800&q=80', category: 'Burgers', stock: 30 },
  { name: 'Chapli Kebab Burger', description: 'Traditional Peshawari chapli kebab served in a soft bun with mint chutney and onions.', price: 4.49, image: 'https://images.unsplash.com/photo-1603064752734-4c48eff53d05?auto=format&fit=crop&w=800&q=80', category: 'Burgers', stock: 65 },
  
  // --- Pizza ---
  { name: 'Chicken Tikka Pizza', description: 'Spicy chicken tikka chunks, onions, green peppers, and lots of mozzarella cheese.', price: 12.99, image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=800&q=80', category: 'Pizza', stock: 40 },
  { name: 'Fajita Sensation', description: 'Chicken fajita, onions, green peppers, tomatoes, and black olives.', price: 13.49, image: 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?auto=format&fit=crop&w=800&q=80', category: 'Pizza', stock: 45 },
  { name: 'Margherita Pizza', description: 'Classic cheese pizza with a rich tomato base and fresh basil.', price: 10.99, image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=800&q=80', category: 'Pizza', stock: 30 },
  { name: 'Pepperoni Feast', description: 'Loaded with premium beef pepperoni and extra mozzarella cheese.', price: 14.99, image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&w=800&q=80', category: 'Pizza', stock: 50 },
  { name: 'Veggie Supreme', description: 'Mushrooms, green peppers, onions, black olives, and sweet corn.', price: 11.99, image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80', category: 'Pizza', stock: 25 },
  { name: 'BBQ Chicken Pizza', description: 'Smoky BBQ sauce base topped with grilled chicken, onions, and mozzarella.', price: 13.99, image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80', category: 'Pizza', stock: 35 },
  { name: 'Afghani Tikka Pizza', description: 'Creamy base topped with mildly spiced Afghani chicken tikka and cheese.', price: 14.49, image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=800&q=80', category: 'Pizza', stock: 40 },
  { name: 'Malai Boti Pizza', description: 'Rich and creamy Malai Boti chunks with bell peppers and a blend of cheeses.', price: 14.99, image: 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?auto=format&fit=crop&w=800&q=80', category: 'Pizza', stock: 35 },
  { name: 'Spicy Ranch Pizza', description: 'Ranch sauce base with spicy chicken chunks, jalapenos, and tomatoes.', price: 13.49, image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=800&q=80', category: 'Pizza', stock: 45 },
  { name: 'Cheese Lover\'s Pizza', description: 'A massive blend of Mozzarella, Cheddar, Parmesan, and Feta cheese.', price: 12.49, image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80', category: 'Pizza', stock: 50 },

  // --- Pakistani / Desi ---
  { name: 'Chicken Biryani', description: 'Aromatic basmati rice cooked with spicy chicken, herbs, and traditional spices.', price: 5.99, image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=800&q=80', category: 'Pakistani', stock: 150 },
  { name: 'Mutton Karahi', description: 'Tender mutton cooked in a wok with tomatoes, green chilies, and ginger.', price: 14.99, image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=800&q=80', category: 'Pakistani', stock: 40 },
  { name: 'Chicken Tikka Boti', description: 'Charcoal-grilled chicken pieces marinated in spicy yogurt.', price: 7.49, image: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?auto=format&fit=crop&w=800&q=80', category: 'Pakistani', stock: 60 },
  { name: 'Seekh Kebab', description: 'Minced beef kebabs mixed with herbs and spices, grilled to perfection.', price: 6.99, image: 'https://images.unsplash.com/photo-1603360946369-dc9bb6258143?auto=format&fit=crop&w=800&q=80', category: 'Pakistani', stock: 80 },
  { name: 'Nihari', description: 'Slow-cooked beef stew with bone marrow, garnished with ginger and green chilies.', price: 8.99, image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=800&q=80', category: 'Pakistani', stock: 30 },
  { name: 'Beef Pulao', description: 'Traditional Bannu style beef pulao cooked in rich bone broth with aromatic spices.', price: 6.99, image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=800&q=80', category: 'Pakistani', stock: 70 },
  { name: 'Chicken Haleem', description: 'Slow-cooked blend of lentils, wheat, and shredded chicken, topped with fried onions and ginger.', price: 5.49, image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=800&q=80', category: 'Pakistani', stock: 60 },
  { name: 'Daal Chawal', description: 'Comforting yellow lentils served over steamed white rice with a side of mixed pickle.', price: 3.99, image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=800&q=80', category: 'Pakistani', stock: 100 },
  { name: 'Peshawari Charsi Tikka', description: 'Authentic Peshawari style mutton tikka grilled over charcoal with minimal spices and lamb fat.', price: 16.99, image: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?auto=format&fit=crop&w=800&q=80', category: 'Pakistani', stock: 25 },
  { name: 'Balochi Sajji', description: 'Whole chicken marinated in traditional Balochi spices and roasted over an open fire, served with rice.', price: 18.99, image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=800&q=80', category: 'Pakistani', stock: 20 },

  // --- Fast Food & Wraps ---
  { name: 'Chicken Shawarma', description: 'Middle Eastern style roasted chicken slices wrapped in pita bread with garlic sauce.', price: 3.99, image: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=800&q=80', category: 'Wraps', stock: 120 },
  { name: 'Club Sandwich', description: 'Triple-decker sandwich with chicken, egg, cheese, lettuce, and mayo. Served with fries.', price: 6.99, image: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=800&q=80', category: 'Sandwiches', stock: 50 },
  { name: 'Loaded Fries', description: 'Crispy fries topped with melted cheese, jalapenos, and grilled chicken chunks.', price: 5.49, image: 'https://images.unsplash.com/photo-1576107232684-1279f390859f?auto=format&fit=crop&w=800&q=80', category: 'Sides', stock: 100 },
  { name: 'Crispy Fried Chicken (2 Pcs)', description: 'Two pieces of golden, crispy, and juicy fried chicken.', price: 4.99, image: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&w=800&q=80', category: 'Fast Food', stock: 150 },
  { name: 'Chicken Nuggets (10 Pcs)', description: 'Bite-sized crispy chicken nuggets served with BBQ sauce.', price: 4.49, image: 'https://images.unsplash.com/photo-1562967914-608f82629710?auto=format&fit=crop&w=800&q=80', category: 'Fast Food', stock: 80 },

  // --- Pasta & Italian ---
  { name: 'Fettuccine Alfredo', description: 'Creamy white sauce pasta with grilled chicken strips and parmesan cheese.', price: 9.99, image: 'https://images.unsplash.com/photo-1645112411341-6c4fd023714a?auto=format&fit=crop&w=800&q=80', category: 'Pasta', stock: 40 },
  { name: 'Spaghetti Bolognese', description: 'Classic Italian spaghetti served with a rich minced beef and tomato sauce.', price: 8.99, image: 'https://images.unsplash.com/photo-1622973536968-3ead9e780960?auto=format&fit=crop&w=800&q=80', category: 'Pasta', stock: 35 },
  { name: 'Mac & Cheese', description: 'Oven-baked macaroni in a rich, creamy, and gooey cheese sauce.', price: 7.49, image: 'https://images.unsplash.com/photo-1543339494-b4cd4f7ba686?auto=format&fit=crop&w=800&q=80', category: 'Pasta', stock: 50 },

  // --- Desserts ---
  { name: 'Chocolate Molten Lava Cake', description: 'Warm chocolate cake with a gooey chocolate center, served with vanilla ice cream.', price: 5.99, image: 'https://images.unsplash.com/photo-1624353365286-3f8d62daad51?auto=format&fit=crop&w=800&q=80', category: 'Desserts', stock: 30 },
  { name: 'Gulab Jamun (4 Pcs)', description: 'Traditional Pakistani sweet, deep-fried dough balls soaked in sugar syrup.', price: 3.49, image: 'https://images.unsplash.com/photo-1596803244618-8dbee441d70b?auto=format&fit=crop&w=800&q=80', category: 'Desserts', stock: 100 },
  { name: 'New York Cheesecake', description: 'Classic, creamy cheesecake with a graham cracker crust.', price: 6.49, image: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?auto=format&fit=crop&w=800&q=80', category: 'Desserts', stock: 25 },
  { name: 'Brownie with Ice Cream', description: 'Fudgy walnut brownie topped with a scoop of vanilla ice cream and chocolate syrup.', price: 5.49, image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=800&q=80', category: 'Desserts', stock: 45 },

  // --- Beverages ---
  { name: 'Mint Margarita', description: 'Refreshing blend of mint, lemon, ice, and soda.', price: 2.99, image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=800&q=80', category: 'Beverages', stock: 150 },
  { name: 'Mango Lassi', description: 'Traditional yogurt-based drink blended with sweet mangoes.', price: 3.49, image: 'https://images.unsplash.com/photo-1570696516188-ade861b84a49?auto=format&fit=crop&w=800&q=80', category: 'Beverages', stock: 80 },
  { name: 'Karak Chai', description: 'Strong, brewed Pakistani tea with milk and cardamom.', price: 1.99, image: 'https://images.unsplash.com/photo-1561336313-0bd5e0b27ec8?auto=format&fit=crop&w=800&q=80', category: 'Beverages', stock: 200 },
  { name: 'Oreo Shake', description: 'Thick milkshake blended with vanilla ice cream and crushed Oreo cookies.', price: 4.99, image: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=800&q=80', category: 'Beverages', stock: 60 },
  { name: 'Fresh Lime Soda', description: 'Freshly squeezed lime juice mixed with soda water and a pinch of salt.', price: 2.49, image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=800&q=80', category: 'Beverages', stock: 120 },
  { name: 'Cold Coffee', description: 'Chilled coffee blended with milk, ice cream, and chocolate syrup.', price: 4.49, image: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&w=800&q=80', category: 'Beverages', stock: 90 },
];

async function seedDatabase() {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    console.error('❌ Missing MONGODB_URI environment variable. Please check your .env.local file.');
    process.exit(1);
  }

  try {
    console.log('⏳ Connecting to MongoDB...');
    await mongoose.connect(uri);
    console.log('✅ Connected to MongoDB');

    // 1. Clear existing data
    console.log('⏳ Clearing existing users and products...');
    await User.deleteMany({});
    await Product.deleteMany({});
    console.log('✅ Database cleared');

    // 2. Create Admin Users
    console.log('⏳ Creating admin users...');
    const hashedPassword = await bcrypt.hash('admin@br', 10);
    
    const admins = [
      {
        name: 'Ali Khan', // Male
        email: 'admin1@bite-rush.pk',
        password: hashedPassword,
        role: 'admin'
      },
      {
        name: 'Usman Tariq', // Male
        email: 'admin2@bite-rush.pk',
        password: hashedPassword,
        role: 'admin'
      },
      {
        name: 'Fatima Ahmed', // Female
        email: 'admin3@bite-rush.pk',
        password: hashedPassword,
        role: 'admin'
      }
    ];

    const createdAdmins = await User.insertMany(admins);
    console.log(`✅ ${createdAdmins.length} Admin users created successfully.`);

    // 3. Insert Products
    console.log('⏳ Inserting sample products...');
    // Assign the first admin as the creator of all products
    const productsWithAdminRef = sampleProducts.map(product => ({
      ...product,
      createdBy: createdAdmins[0]._id
    }));
    
    await Product.insertMany(productsWithAdminRef);
    console.log(`✅ Inserted ${sampleProducts.length} diverse sample products`);

    console.log('\n🎉 Seed complete! You can now log in with the new admin credentials.');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();
