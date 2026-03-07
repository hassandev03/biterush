import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

// Fix common URI typo
let MONGODB_URI = process.env.MONGODB_URI as string;
if (MONGODB_URI && MONGODB_URI.includes('?appName=Cluster0/biterush')) {
  MONGODB_URI = MONGODB_URI.replace('?appName=Cluster0/biterush', 'biterush?appName=Cluster0');
}

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
  tags: { type: [String], default: [] },
  spiceLevel: { type: String, enum: ['mild', 'medium', 'hot', 'extra hot'], default: null },
  prepTime: { type: Number, default: null },
  isVegetarian: { type: Boolean, default: false },
  rating: { type: Number, min: 1, max: 5, default: 4.0 },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now }
});

const User = mongoose.models.User || mongoose.model('User', UserSchema);
const Product = mongoose.models.Product || mongoose.model('Product', ProductSchema);

const sampleProducts = [
  // ─── BURGERS ────────────────────────────────────────────────────────────────
  {
    name: 'Zinger Burger',
    description: 'Crispy fried chicken thigh fillet with spicy mayo, fresh lettuce, and a sesame-topped bun. The original desi favourite.',
    price: 590,
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80',
    category: 'Burgers', stock: 100,
    spiceLevel: 'medium', prepTime: 12, isVegetarian: false, rating: 4.7,
    tags: ['crispy', 'chicken', 'spicy', 'bestseller'],
  },
  {
    name: 'Grilled Chicken Burger',
    description: 'Tender grilled chicken breast with garlic mayo, tomatoes, and crunchy lettuce on a toasted bun.',
    price: 650,
    image: 'https://images.unsplash.com/photo-1606755962773-d324e0a13086?auto=format&fit=crop&w=800&q=80',
    category: 'Burgers', stock: 60,
    spiceLevel: 'mild', prepTime: 15, isVegetarian: false, rating: 4.4,
    tags: ['grilled', 'healthy', 'chicken'],
  },
  {
    name: 'Jalapeno Beef Burger',
    description: 'Thick beef patty loaded with pickled jalapenos, pepper jack cheese, and fiery sriracha sauce.',
    price: 790,
    image: 'https://images.unsplash.com/photo-1553979459-d2229ba7433b?auto=format&fit=crop&w=800&q=80',
    category: 'Burgers', stock: 50,
    spiceLevel: 'hot', prepTime: 14, isVegetarian: false, rating: 4.5,
    tags: ['beef', 'spicy', 'jalapeno', 'cheesy'],
  },
  {
    name: 'BBQ Smokey Burger',
    description: 'Juicy beef patty, smoky BBQ sauce, crispy onion rings, and melted cheddar in a brioche bun.',
    price: 850,
    image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=800&q=80',
    category: 'Burgers', stock: 45,
    spiceLevel: 'mild', prepTime: 14, isVegetarian: false, rating: 4.6,
    tags: ['beef', 'bbq', 'smoky', 'crispy'],
  },
  {
    name: 'Double Zinger Burger',
    description: 'Two crispy fried chicken fillets stacked with extra cheese and spicy mayo. For the truly hungry.',
    price: 890,
    image: 'https://images.unsplash.com/photo-1615719413546-198b25453f85?auto=format&fit=crop&w=800&q=80',
    category: 'Burgers', stock: 55,
    spiceLevel: 'hot', prepTime: 15, isVegetarian: false, rating: 4.8,
    tags: ['double', 'crispy', 'chicken', 'bestseller'],
  },
  {
    name: 'Chapli Kebab Burger',
    description: 'Authentic Peshawari chapli kebab in a soft bun with mint chutney, sliced onions, and tomatoes.',
    price: 690,
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80',
    category: 'Burgers', stock: 65,
    spiceLevel: 'medium', prepTime: 10, isVegetarian: false, rating: 4.6,
    tags: ['desi', 'chapli', 'kebab', 'peshawari'],
  },
  {
    name: 'Mushroom Swiss Burger',
    description: 'Beef patty topped with golden sautéed mushrooms, melted Swiss cheese, and truffle mayo.',
    price: 820,
    image: 'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?auto=format&fit=crop&w=800&q=80',
    category: 'Burgers', stock: 40,
    spiceLevel: 'mild', prepTime: 16, isVegetarian: false, rating: 4.3,
    tags: ['beef', 'mushroom', 'cheesy'],
  },

  // ─── PIZZA ──────────────────────────────────────────────────────────────────
  {
    name: 'Chicken Tikka Pizza',
    description: 'Boldly spiced chicken tikka chunks, onions, green peppers, and generous mozzarella on a thin base.',
    price: 1390,
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=800&q=80',
    category: 'Pizza', stock: 40,
    spiceLevel: 'hot', prepTime: 20, isVegetarian: false, rating: 4.8,
    tags: ['desi', 'tikka', 'spicy', 'bestseller'],
  },
  {
    name: 'Fajita Sensation',
    description: 'Chicken fajita strips, onions, green peppers, tomatoes, and black olives with a tangy fajita sauce.',
    price: 1490,
    image: 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?auto=format&fit=crop&w=800&q=80',
    category: 'Pizza', stock: 45,
    spiceLevel: 'medium', prepTime: 20, isVegetarian: false, rating: 4.6,
    tags: ['chicken', 'fajita', 'loaded'],
  },
  {
    name: 'Malai Boti Pizza',
    description: 'Creamy, mildly spiced Malai Boti chicken chunks with bell peppers on a white garlic sauce base.',
    price: 1590,
    image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=800&q=80',
    category: 'Pizza', stock: 35,
    spiceLevel: 'mild', prepTime: 22, isVegetarian: false, rating: 4.7,
    tags: ['desi', 'malai', 'creamy', 'chicken'],
  },
  {
    name: 'Pepperoni Feast',
    description: 'Loaded with premium beef pepperoni rounds and a double layer of mozzarella cheese.',
    price: 1650,
    image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&w=800&q=80',
    category: 'Pizza', stock: 50,
    spiceLevel: 'mild', prepTime: 18, isVegetarian: false, rating: 4.5,
    tags: ['pepperoni', 'cheesy', 'classic'],
  },
  {
    name: 'Margherita Pizza',
    description: 'Classic Neapolitan pizza with a rich tomato base, fresh mozzarella, and aromatic basil.',
    price: 1190,
    image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=800&q=80',
    category: 'Pizza', stock: 30,
    spiceLevel: 'mild', prepTime: 18, isVegetarian: true, rating: 4.2,
    tags: ['vegetarian', 'classic', 'cheese'],
  },
  {
    name: 'Afghani Tikka Pizza',
    description: 'Creamy Afghani-style chicken tikka, roasted peppers, and a blend of four cheeses.',
    price: 1550,
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=800&q=80',
    category: 'Pizza', stock: 40,
    spiceLevel: 'medium', prepTime: 22, isVegetarian: false, rating: 4.6,
    tags: ['desi', 'afghani', 'creamy'],
  },

  // ─── PAKISTANI / DESI ────────────────────────────────────────────────────────
  {
    name: 'Chicken Biryani',
    description: 'Fragrant dum-cooked basmati rice layered with spiced chicken, saffron, caramelised onions, and a side of raita.',
    price: 450,
    image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=800&q=80',
    category: 'Pakistani', stock: 150,
    spiceLevel: 'medium', prepTime: 40, isVegetarian: false, rating: 4.9,
    tags: ['rice', 'dum', 'saffron', 'national-dish', 'bestseller'],
  },
  {
    name: 'Mutton Karahi',
    description: 'Tender bone-in mutton wok-cooked with tomatoes, fresh ginger, green chillies, and aromatic spices. Karahi at its best.',
    price: 1890,
    image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=800&q=80',
    category: 'Pakistani', stock: 40,
    spiceLevel: 'hot', prepTime: 50, isVegetarian: false, rating: 4.8,
    tags: ['mutton', 'karahi', 'wok', 'desi', 'bestseller'],
  },
  {
    name: 'Chicken Handi',
    description: 'Slow-cooked chicken in a clay handi with whole spices, thick yogurt gravy, and a buttery finish.',
    price: 890,
    image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=800&q=80',
    category: 'Pakistani', stock: 60,
    spiceLevel: 'medium', prepTime: 35, isVegetarian: false, rating: 4.6,
    tags: ['handi', 'clay-pot', 'chicken', 'desi'],
  },
  {
    name: 'Chicken Tikka Boti',
    description: 'Bone-in chicken pieces marinated in spiced yogurt and charcoal-grilled to juicy, smoky perfection.',
    price: 890,
    image: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?auto=format&fit=crop&w=800&q=80',
    category: 'Pakistani', stock: 60,
    spiceLevel: 'hot', prepTime: 25, isVegetarian: false, rating: 4.7,
    tags: ['tikka', 'grilled', 'charcoal', 'bbq'],
  },
  {
    name: 'Seekh Kebab (6 pcs)',
    description: 'Minced beef mixed with onions, green chillies, fresh coriander, and special spices — grilled on metal skewers.',
    price: 750,
    image: 'https://images.unsplash.com/photo-1603360946369-dc9bb6258143?auto=format&fit=crop&w=800&q=80',
    category: 'Pakistani', stock: 80,
    spiceLevel: 'medium', prepTime: 20, isVegetarian: false, rating: 4.6,
    tags: ['seekh', 'kebab', 'beef', 'grilled'],
  },
  {
    name: 'Nihari',
    description: 'Slow-cooked overnight beef shank with bone marrow, rich nihari masala, garnished with ginger, green chillies, and lemon.',
    price: 950,
    image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=800&q=80',
    category: 'Pakistani', stock: 30,
    spiceLevel: 'hot', prepTime: 60, isVegetarian: false, rating: 4.8,
    tags: ['nihari', 'beef', 'slow-cooked', 'karachi-special'],
  },
  {
    name: 'Beef Pulao (Bannu Style)',
    description: 'Authentic Bannu-style pulao cooked in bone broth with whole spices. Simple, aromatic, and deeply satisfying.',
    price: 590,
    image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=800&q=80',
    category: 'Pakistani', stock: 70,
    spiceLevel: 'mild', prepTime: 45, isVegetarian: false, rating: 4.7,
    tags: ['pulao', 'bannu', 'rice', 'beef'],
  },
  {
    name: 'Chicken Haleem',
    description: 'Thick lentil-and-wheat porridge slow-cooked with shredded chicken, topped with fried onions, ginger strips, and lemon.',
    price: 490,
    image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=800&q=80',
    category: 'Pakistani', stock: 60,
    spiceLevel: 'medium', prepTime: 30, isVegetarian: false, rating: 4.5,
    tags: ['haleem', 'lentil', 'comfort-food'],
  },
  {
    name: 'Peshawari Chapli Kebab',
    description: 'Flat, broad minced beef kebabs made with tomatoes, pomegranate seeds, and special Peshawari spices — cooked in tallow.',
    price: 690,
    image: 'https://images.unsplash.com/photo-1603360946369-dc9bb6258143?auto=format&fit=crop&w=800&q=80',
    category: 'Pakistani', stock: 65,
    spiceLevel: 'medium', prepTime: 15, isVegetarian: false, rating: 4.7,
    tags: ['chapli', 'peshawari', 'beef', 'desi'],
  },
  {
    name: 'Daal Chawal',
    description: 'Comforting yellow masoor daal simmered with tomatoes and cumin, served over steamed basmati with achar.',
    price: 350,
    image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=800&q=80',
    category: 'Pakistani', stock: 100,
    spiceLevel: 'mild', prepTime: 25, isVegetarian: true, rating: 4.3,
    tags: ['daal', 'lentil', 'rice', 'vegetarian', 'comfort-food'],
  },
  {
    name: 'Aloo Gosht',
    description: 'Tender mutton pieces cooked with potatoes in a rich, spiced tomato gravy. A true home-style classic.',
    price: 890,
    image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=800&q=80',
    category: 'Pakistani', stock: 50,
    spiceLevel: 'medium', prepTime: 45, isVegetarian: false, rating: 4.5,
    tags: ['mutton', 'potato', 'desi', 'home-style'],
  },
  {
    name: 'Paye (Trotters)',
    description: 'Slow-simmered beef trotters in a rich, spiced bone broth — the classic Lahori breakfast dish.',
    price: 750,
    image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=800&q=80',
    category: 'Pakistani', stock: 25,
    spiceLevel: 'hot', prepTime: 90, isVegetarian: false, rating: 4.6,
    tags: ['paye', 'trotters', 'lahori', 'breakfast'],
  },
  {
    name: 'Balochi Sajji',
    description: 'Whole chicken marinated in rock salt and regional spices, slow-roasted over open fire, served with rice and raita.',
    price: 2100,
    image: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?auto=format&fit=crop&w=800&q=80',
    category: 'Pakistani', stock: 20,
    spiceLevel: 'medium', prepTime: 120, isVegetarian: false, rating: 4.9,
    tags: ['sajji', 'balochi', 'whole-chicken', 'roasted', 'special'],
  },

  // ─── WRAPS ───────────────────────────────────────────────────────────────────
  {
    name: 'Chicken Shawarma',
    description: 'Marinated chicken strips slow-roasted on a spit, served in pita with garlic sauce, pickles, and fresh veggies.',
    price: 390,
    image: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=800&q=80',
    category: 'Wraps', stock: 120,
    spiceLevel: 'mild', prepTime: 8, isVegetarian: false, rating: 4.5,
    tags: ['shawarma', 'wrap', 'street-food', 'chicken'],
  },
  {
    name: 'Spicy Chicken Wrap',
    description: 'Crispy fried chicken strips, coleslaw, jalapeños, and sriracha mayo wrapped in a warm flour tortilla.',
    price: 490,
    image: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=800&q=80',
    category: 'Wraps', stock: 80,
    spiceLevel: 'hot', prepTime: 10, isVegetarian: false, rating: 4.4,
    tags: ['wrap', 'crispy', 'spicy', 'chicken'],
  },
  {
    name: 'Club Sandwich',
    description: 'Triple-decker sandwich with grilled chicken, fried egg, cheddar, lettuce, tomato, and honey mustard.',
    price: 750,
    image: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=800&q=80',
    category: 'Wraps', stock: 50,
    spiceLevel: 'mild', prepTime: 12, isVegetarian: false, rating: 4.4,
    tags: ['sandwich', 'triple-decker', 'chicken'],
  },

  // ─── SIDES & FAST FOOD ───────────────────────────────────────────────────────
  {
    name: 'Loaded Fries',
    description: 'Golden shoestring fries topped with melted cheddar sauce, jalapeños, grilled chicken, and sour cream.',
    price: 590,
    image: 'https://images.unsplash.com/photo-1576107232684-1279f390859f?auto=format&fit=crop&w=800&q=80',
    category: 'Sides', stock: 100,
    spiceLevel: 'medium', prepTime: 10, isVegetarian: false, rating: 4.6,
    tags: ['fries', 'loaded', 'cheesy', 'snack'],
  },
  {
    name: 'Crispy Fried Chicken (2 pcs)',
    description: 'Golden double-breaded fried chicken with 11 herbs and spices — juicy inside, shatteringly crispy outside.',
    price: 550,
    image: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&w=800&q=80',
    category: 'Sides', stock: 150,
    spiceLevel: 'medium', prepTime: 15, isVegetarian: false, rating: 4.7,
    tags: ['fried-chicken', 'crispy', 'classic'],
  },
  {
    name: 'Chicken Nuggets (10 pcs)',
    description: 'Bite-sized golden chicken nuggets — tender inside, crispy outside. Served with BBQ and chilli dip.',
    price: 490,
    image: 'https://images.unsplash.com/photo-1562967914-608f82629710?auto=format&fit=crop&w=800&q=80',
    category: 'Sides', stock: 80,
    spiceLevel: 'mild', prepTime: 8, isVegetarian: false, rating: 4.4,
    tags: ['nuggets', 'chicken', 'kids-favourite'],
  },

  // ─── PASTA ───────────────────────────────────────────────────────────────────
  {
    name: 'Fettuccine Alfredo',
    description: 'Silky fettuccine in a classic cream-butter-parmesan sauce topped with grilled chicken strips and cracked pepper.',
    price: 990,
    image: 'https://images.unsplash.com/photo-1645112411341-6c4fd023714a?auto=format&fit=crop&w=800&q=80',
    category: 'Pasta', stock: 40,
    spiceLevel: 'mild', prepTime: 20, isVegetarian: false, rating: 4.4,
    tags: ['pasta', 'creamy', 'alfredo', 'italian'],
  },
  {
    name: 'Spaghetti Bolognese',
    description: 'Al dente spaghetti with a slow-simmered minced beef and tomato ragù, topped with parmesan and basil.',
    price: 890,
    image: 'https://images.unsplash.com/photo-1622973536968-3ead9e780960?auto=format&fit=crop&w=800&q=80',
    category: 'Pasta', stock: 35,
    spiceLevel: 'mild', prepTime: 25, isVegetarian: false, rating: 4.3,
    tags: ['pasta', 'bolognese', 'beef', 'italian'],
  },
  {
    name: 'Penne Arabiata',
    description: 'Penne in a fiery tomato and garlic sauce with dried chillies, finished with olive oil and fresh parsley.',
    price: 790,
    image: 'https://images.unsplash.com/photo-1622973536968-3ead9e780960?auto=format&fit=crop&w=800&q=80',
    category: 'Pasta', stock: 40,
    spiceLevel: 'hot', prepTime: 18, isVegetarian: true, rating: 4.3,
    tags: ['pasta', 'spicy', 'vegetarian', 'italian'],
  },

  // ─── DESSERTS ────────────────────────────────────────────────────────────────
  {
    name: 'Chocolate Molten Lava Cake',
    description: 'Warm dark chocolate cake with a flowing molten centre, served with a scoop of vanilla ice cream.',
    price: 590,
    image: 'https://images.unsplash.com/photo-1624353365286-3f8d62daad51?auto=format&fit=crop&w=800&q=80',
    category: 'Desserts', stock: 30,
    spiceLevel: null, prepTime: 15, isVegetarian: true, rating: 4.8,
    tags: ['chocolate', 'warm', 'dessert', 'indulgent'],
  },
  {
    name: 'Gulab Jamun (4 pcs)',
    description: 'Soft, deep-fried khoya dumplings soaked in rose-scented sugar syrup. The ultimate desi dessert.',
    price: 290,
    image: 'https://images.unsplash.com/photo-1596803244618-8dbee441d70b?auto=format&fit=crop&w=800&q=80',
    category: 'Desserts', stock: 100,
    spiceLevel: null, prepTime: 10, isVegetarian: true, rating: 4.7,
    tags: ['desi', 'sweet', 'gulab-jamun', 'traditional'],
  },
  {
    name: 'New York Cheesecake',
    description: 'Dense, creamy baked cheesecake on a buttery graham cracker base with a berry compote topping.',
    price: 650,
    image: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?auto=format&fit=crop&w=800&q=80',
    category: 'Desserts', stock: 25,
    spiceLevel: null, prepTime: 5, isVegetarian: true, rating: 4.5,
    tags: ['cheesecake', 'creamy', 'american', 'dessert'],
  },
  {
    name: 'Brownie with Ice Cream',
    description: 'Fudgy walnut brownie fresh from the oven, served with a generous scoop of vanilla ice cream and chocolate drizzle.',
    price: 490,
    image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=800&q=80',
    category: 'Desserts', stock: 45,
    spiceLevel: null, prepTime: 10, isVegetarian: true, rating: 4.6,
    tags: ['brownie', 'ice-cream', 'chocolate', 'warm'],
  },
  {
    name: 'Kheer',
    description: 'Traditional Pakistani rice pudding with whole milk, sugar, green cardamom, and crushed pistachios.',
    price: 250,
    image: 'https://images.unsplash.com/photo-1596803244618-8dbee441d70b?auto=format&fit=crop&w=800&q=80',
    category: 'Desserts', stock: 80,
    spiceLevel: null, prepTime: 5, isVegetarian: true, rating: 4.5,
    tags: ['kheer', 'desi', 'rice-pudding', 'traditional'],
  },

  // ─── BEVERAGES ───────────────────────────────────────────────────────────────
  {
    name: 'Karak Chai',
    description: 'Strong Pakistani milk tea brewed with loose-leaf Assam, ginger, and crushed cardamom. Served piping hot.',
    price: 120,
    image: 'https://images.unsplash.com/photo-1561336313-0bd5e0b27ec8?auto=format&fit=crop&w=800&q=80',
    category: 'Beverages', stock: 200,
    spiceLevel: null, prepTime: 5, isVegetarian: true, rating: 4.8,
    tags: ['tea', 'chai', 'desi', 'hot', 'comfort'],
  },
  {
    name: 'Mango Lassi',
    description: 'Thick, chilled blend of ripe Chaunsa mangoes, full-fat yogurt, and a touch of sugar. Summer in a glass.',
    price: 290,
    image: 'https://images.unsplash.com/photo-1570696516188-ade861b84a49?auto=format&fit=crop&w=800&q=80',
    category: 'Beverages', stock: 80,
    spiceLevel: null, prepTime: 5, isVegetarian: true, rating: 4.7,
    tags: ['lassi', 'mango', 'yogurt', 'desi', 'cold'],
  },
  {
    name: 'Mint Margarita',
    description: 'Fresh mint, lime juice, sugar syrup, a pinch of rock salt, and chilled soda — perfectly refreshing.',
    price: 250,
    image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=800&q=80',
    category: 'Beverages', stock: 150,
    spiceLevel: null, prepTime: 5, isVegetarian: true, rating: 4.5,
    tags: ['mint', 'mocktail', 'refreshing', 'cold'],
  },
  {
    name: 'Oreo Milkshake',
    description: 'Thick milkshake blended with vanilla ice cream, whole Oreo cookies, and fresh milk. Topped with whipped cream.',
    price: 490,
    image: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=800&q=80',
    category: 'Beverages', stock: 60,
    spiceLevel: null, prepTime: 5, isVegetarian: true, rating: 4.6,
    tags: ['milkshake', 'oreo', 'cold', 'sweet'],
  },
  {
    name: 'Cold Coffee',
    description: 'Chilled espresso blended with milk, vanilla ice cream, and a swirl of chocolate syrup. Rich and refreshing.',
    price: 390,
    image: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&w=800&q=80',
    category: 'Beverages', stock: 90,
    spiceLevel: null, prepTime: 5, isVegetarian: true, rating: 4.5,
    tags: ['coffee', 'cold', 'iced', 'espresso'],
  },
  {
    name: 'Fresh Lime Soda',
    description: 'Squeezed lime, sugar, a pinch of salt, and chilled soda water. Simple, tangy, and instantly refreshing.',
    price: 190,
    image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=800&q=80',
    category: 'Beverages', stock: 120,
    spiceLevel: null, prepTime: 3, isVegetarian: true, rating: 4.4,
    tags: ['lime', 'soda', 'refreshing', 'mocktail'],
  },
];

async function seedDatabase() {
  if (!MONGODB_URI) {
    console.error('❌ Missing MONGODB_URI environment variable. Check your .env.local file.');
    process.exit(1);
  }

  try {
    console.log('⏳ Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    console.log('⏳ Clearing existing users and products...');
    await User.deleteMany({});
    await Product.deleteMany({});
    console.log('✅ Database cleared');

    console.log('⏳ Creating admin user...');
    const hashedPassword = await bcrypt.hash('Admin@123', 10);

    const [admin] = await User.insertMany([
      { name: 'BiteRush Admin', email: 'admin@biterush.pk', password: hashedPassword, role: 'admin' },
    ]);
    console.log('✅ Admin created — email: admin@biterush.pk  /  password: Admin@123');

    console.log(`⏳ Inserting ${sampleProducts.length} products...`);
    await Product.insertMany(sampleProducts.map(p => ({ ...p, createdBy: admin._id })));
    console.log(`✅ ${sampleProducts.length} products inserted`);

    console.log('\n🎉 Seed complete!');
    console.log('   Admin → admin@biterush.pk / Admin@123');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seed error:', error);
    process.exit(1);
  }
}

seedDatabase();
