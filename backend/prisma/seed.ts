import { PrismaClient } from '@prisma/client';

const Role = {
  STUDENT: 'STUDENT',
  KITCHEN_STAFF: 'KITCHEN_STAFF',
  ADMIN: 'ADMIN',
} as const;

const DietaryType = {
  VEGETARIAN: 'VEGETARIAN',
  NON_VEGETARIAN: 'NON_VEGETARIAN',
  VEGAN: 'VEGAN',
  EGG: 'EGG',
} as const;

const OrderStatus = {
  PLACED: 'PLACED',
  CONFIRMED: 'CONFIRMED',
  PREPARING: 'PREPARING',
  READY: 'READY',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED',
} as const;

const PaymentStatus = {
  PENDING: 'PENDING',
  SUCCESS: 'SUCCESS',
  FAILED: 'FAILED',
  REFUNDED: 'REFUNDED',
} as const;

const PaymentMethod = {
  MOCK: 'MOCK',
  UPI: 'UPI',
  CARD: 'CARD',
  ONLINE: 'ONLINE',
} as const;
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting CampusBite database seeding...');

  // 1. Clean existing database records
  await prisma.notification.deleteMany();
  await prisma.orderStatusHistory.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.foodItem.deleteMany();
  await prisma.foodCategory.deleteMany();
  await prisma.user.deleteMany();

  console.log('🧹 Cleaned existing tables.');

  // 2. Hash passwords
  const adminPassword = await bcrypt.hash('Admin@123', 10);
  const kitchenPassword = await bcrypt.hash('Kitchen@123', 10);
  const studentPassword = await bcrypt.hash('Student@123', 10);

  // 3. Create Admin & Kitchen Staff Users
  const adminUser = await prisma.user.create({
    data: {
      name: 'System Administrator',
      email: 'admin@campusbite.local',
      phone: '+91 9876543210',
      passwordHash: adminPassword,
      role: Role.ADMIN,
    },
  });

  const kitchenLead = await prisma.user.create({
    data: {
      name: 'Chef Rajesh Kumar',
      email: 'kitchen@campusbite.local',
      phone: '+91 9876543211',
      passwordHash: kitchenPassword,
      role: Role.KITCHEN_STAFF,
    },
  });

  const kitchenAssistant = await prisma.user.create({
    data: {
      name: 'Suresh Patil (Kitchen Staff)',
      email: 'chef@campusbite.local',
      phone: '+91 9876543212',
      passwordHash: kitchenPassword,
      role: Role.KITCHEN_STAFF,
    },
  });

  // 4. Create 10+ Student Users
  const studentData = [
    { name: 'Arjun Das', email: 'student@campusbite.local', phone: '+91 9876500001' },
    { name: 'Rahul Sharma', email: 'rahul.sharma@campusbite.local', phone: '+91 9876500002' },
    { name: 'Ananya Sen', email: 'ananya.sen@campusbite.local', phone: '+91 9876500003' },
    { name: 'Vikram Patel', email: 'vikram.patel@campusbite.local', phone: '+91 9876500004' },
    { name: 'Priya Nair', email: 'priya.nair@campusbite.local', phone: '+91 9876500005' },
    { name: 'Sneha Reddy', email: 'sneha.reddy@campusbite.local', phone: '+91 9876500006' },
    { name: 'Karthik M', email: 'karthik.m@campusbite.local', phone: '+91 9876500007' },
    { name: 'Pooja Iyer', email: 'pooja.iyer@campusbite.local', phone: '+91 9876500008' },
    { name: 'Rohit Verma', email: 'rohit.verma@campusbite.local', phone: '+91 9876500009' },
    { name: 'Meera Nambiar', email: 'meera.n@campusbite.local', phone: '+91 9876500010' },
    { name: 'Abhinav Gupta', email: 'abhinav.g@campusbite.local', phone: '+91 9876500011' },
  ];

  const students = [];
  for (const s of studentData) {
    const student = await prisma.user.create({
      data: {
        name: s.name,
        email: s.email,
        phone: s.phone,
        passwordHash: studentPassword,
        role: Role.STUDENT,
      },
    });
    students.push(student);
  }

  console.log(`👤 Seeded 1 Admin, 2 Kitchen Staff, and ${students.length} Students.`);

  // 5. Create Food Categories
  const categoryNames = [
    { name: 'Breakfast', description: 'Fresh morning meals, dosas, idlis and hot beverages' },
    { name: 'Lunch', description: 'Complete meals, thalis, and daily specials' },
    { name: 'Main Course', description: 'Aromatic biriyanis, curries, fried rice and breads' },
    { name: 'Snacks', description: 'Crispy samosas, cutlets, puffs, and tea-time quick bites' },
    { name: 'Beverages', description: 'Hot brewed tea, filter coffee, fresh juices, and milkshakes' },
    { name: 'Desserts', description: 'Sweet treats, gulab jamun, and ice creams' },
  ];

  const categoriesMap: Record<string, string> = {};
  for (const cat of categoryNames) {
    const created = await prisma.foodCategory.create({
      data: {
        name: cat.name,
        description: cat.description,
        active: true,
      },
    });
    categoriesMap[cat.name] = created.id;
  }

  console.log('📁 Seeded 6 Food Categories.');

  // 6. Create 20+ Realistic Food Items
  const foodItemsData = [
    // Main Course
    {
      name: 'Chicken Biriyani',
      category: 'Main Course',
      description: 'Fragrant basmati rice cooked with succulent chicken pieces, rich saffron, and authentic spices. Served with raita and salan.',
      price: 140,
      imageUrl: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800&auto=format&fit=crop&q=80',
      ingredients: 'Basmati Rice, Chicken, Saffron, Yogurt, Fried Onions, Spices, Mint, Coriander',
      dietaryType: DietaryType.NON_VEGETARIAN,
      available: true,
      stockQuantity: 60,
      preparationTime: 15,
    },
    {
      name: 'Vegetable Biriyani',
      category: 'Main Course',
      description: 'Layered basmati rice with farm-fresh seasonal vegetables, paneer cubes, and aromatic biriyani masala.',
      price: 100,
      imageUrl: 'https://images.unsplash.com/photo-1645177628172-a94c1f96e6db?w=800&auto=format&fit=crop&q=80',
      ingredients: 'Basmati Rice, Paneer, Carrots, Beans, Green Peas, Cardamom, Mint, Cashews',
      dietaryType: DietaryType.VEGETARIAN,
      available: true,
      stockQuantity: 45,
      preparationTime: 12,
    },
    {
      name: 'Chicken Fried Rice',
      category: 'Main Course',
      description: 'Wok-tossed rice with tender shredded chicken, scrambled eggs, bell peppers, spring onions, and light soy sauce.',
      price: 130,
      imageUrl: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=800&auto=format&fit=crop&q=80',
      ingredients: 'Rice, Chicken Breast, Eggs, Spring Onions, Capsicum, Soy Sauce, Black Pepper',
      dietaryType: DietaryType.NON_VEGETARIAN,
      available: true,
      stockQuantity: 40,
      preparationTime: 15,
    },
    {
      name: 'Veg Hakka Noodles',
      category: 'Main Course',
      description: 'Classic Indo-Chinese noodles tossed with crunchy cabbage, shredded carrots, capsicum, and oriental sauces.',
      price: 110,
      imageUrl: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?w=800&auto=format&fit=crop&q=80',
      ingredients: 'Wheat Noodles, Cabbage, Bell Peppers, Carrots, Spring Onions, Garlic, Soy Sauce',
      dietaryType: DietaryType.VEGAN,
      available: true,
      stockQuantity: 35,
      preparationTime: 12,
    },
    {
      name: 'Malabar Parotta with Chicken Curry',
      category: 'Main Course',
      description: 'Two flaky, layered Kerala parottas paired with rich, aromatic coastal chicken curry cooked in coconut gravy.',
      price: 120,
      imageUrl: 'https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?w=800&auto=format&fit=crop&q=80',
      ingredients: 'Maida, Chicken, Roasted Coconut, Curry Leaves, Mustard Seeds, Garam Masala',
      dietaryType: DietaryType.NON_VEGETARIAN,
      available: true,
      stockQuantity: 50,
      preparationTime: 10,
    },
    {
      name: 'Chapathi with Veg Kurma',
      category: 'Main Course',
      description: 'Three soft whole wheat rotis served with mildly spiced coconut vegetable kurma and onion salad.',
      price: 60,
      imageUrl: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=800&auto=format&fit=crop&q=80',
      ingredients: 'Whole Wheat Flour, Potatoes, Peas, Carrots, Coconut Milk, Spices',
      dietaryType: DietaryType.VEGETARIAN,
      available: true,
      stockQuantity: 40,
      preparationTime: 10,
    },
    {
      name: 'Paneer Butter Masala Combo',
      category: 'Main Course',
      description: 'Rich and creamy cottage cheese cubes in buttery tomato gravy, served with 2 butter naans or jeera rice.',
      price: 140,
      imageUrl: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=800&auto=format&fit=crop&q=80',
      ingredients: 'Fresh Paneer, Butter, Cream, Tomatoes, Cashew Paste, Kasuri Methi',
      dietaryType: DietaryType.VEGETARIAN,
      available: true,
      stockQuantity: 30,
      preparationTime: 15,
    },

    // Lunch
    {
      name: 'South Indian Thali Meals',
      category: 'Lunch',
      description: 'Wholesome student meal: boiled rice, sambar, rasam, kootu, avial, curd, crispy papad, and pickle.',
      price: 90,
      imageUrl: 'https://images.unsplash.com/photo-1610192244261-3f33de3f55e4?w=800&auto=format&fit=crop&q=80',
      ingredients: 'Ponni Rice, Toor Dal, Drumsticks, Coconut, Vegetables, Curd, Tamarind',
      dietaryType: DietaryType.VEGETARIAN,
      available: true,
      stockQuantity: 70,
      preparationTime: 5,
    },
    {
      name: 'Special Chicken Meals',
      category: 'Lunch',
      description: 'Traditional thali featuring hot steamed rice, spicy chicken curry, egg roast, rasam, kootu, and pickle.',
      price: 130,
      imageUrl: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=800&auto=format&fit=crop&q=80',
      ingredients: 'Rice, Chicken, Egg, Spices, Black Pepper, Tamarind, Dal',
      dietaryType: DietaryType.NON_VEGETARIAN,
      available: true,
      stockQuantity: 50,
      preparationTime: 5,
    },

    // Breakfast
    {
      name: 'Masala Dosa',
      category: 'Breakfast',
      description: 'Golden crispy fermented crepe stuffed with fragrant spiced potato masala, served with coconut chutney and piping hot sambar.',
      price: 60,
      imageUrl: 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?w=800&auto=format&fit=crop&q=80',
      ingredients: 'Rice, Urad Dal, Potatoes, Mustard Seeds, Onions, Curry Leaves, Coconut',
      dietaryType: DietaryType.VEGETARIAN,
      available: true,
      stockQuantity: 40,
      preparationTime: 8,
    },
    {
      name: 'Idli Vada Combo',
      category: 'Breakfast',
      description: 'Two fluffy steamed rice cakes and one crispy medu vada served with freshly ground coconut chutney and tangy sambar.',
      price: 50,
      imageUrl: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=800&auto=format&fit=crop&q=80',
      ingredients: 'Parboiled Rice, Black Gram (Urad Dal), Green Chillies, Ginger, Cumin Seeds',
      dietaryType: DietaryType.VEGETARIAN,
      available: true,
      stockQuantity: 50,
      preparationTime: 5,
    },
    {
      name: 'Puri Masala (3 Pcs)',
      category: 'Breakfast',
      description: 'Three puffed golden wheat puris served with potato sagu and tangy vegetable pickle.',
      price: 55,
      imageUrl: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=800&auto=format&fit=crop&q=80',
      ingredients: 'Whole Wheat Flour, Potatoes, Turmeric, Mustard Seeds, Green Chillies',
      dietaryType: DietaryType.VEGETARIAN,
      available: true,
      stockQuantity: 30,
      preparationTime: 10,
    },

    // Snacks
    {
      name: 'Crispy Samosa (2 pcs)',
      category: 'Snacks',
      description: 'Crunchy golden pastry stuffed with spiced mashed potatoes, green peas, and cashews. Served with mint chutney.',
      price: 30,
      imageUrl: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=800&auto=format&fit=crop&q=80',
      ingredients: 'Maida, Potatoes, Peas, Coriander, Garam Masala, Mint Chutney',
      dietaryType: DietaryType.VEGETARIAN,
      available: true,
      stockQuantity: 80,
      preparationTime: 5,
    },
    {
      name: 'Chicken Cutlet (2 pcs)',
      category: 'Snacks',
      description: 'Breadcrumb-crusted deep-fried cutlets packed with spiced minced chicken, potatoes, and herbs.',
      price: 45,
      imageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&auto=format&fit=crop&q=80',
      ingredients: 'Chicken Mince, Potatoes, Breadcrumbs, Egg Wash, Ginger, Garlic, Spices',
      dietaryType: DietaryType.NON_VEGETARIAN,
      available: true,
      stockQuantity: 40,
      preparationTime: 6,
    },
    {
      name: 'Egg Puffs',
      category: 'Snacks',
      description: 'Flaky baked pastry filled with half a boiled egg wrapped in sautéed spiced onion masala.',
      price: 25,
      imageUrl: 'https://images.unsplash.com/photo-1541592106381-b31e9677c0e5?w=800&auto=format&fit=crop&q=80',
      ingredients: 'Puff Pastry, Boiled Egg, Caramelized Onions, Pepper, Curry Masala',
      dietaryType: DietaryType.EGG,
      available: true,
      stockQuantity: 45,
      preparationTime: 3,
    },
    {
      name: 'French Fries',
      category: 'Snacks',
      description: 'Crispy golden potato fries lightly salted and seasoned with peri-peri sprinkle.',
      price: 50,
      imageUrl: 'https://images.unsplash.com/photo-1576107232684-1279f3908594?w=800&auto=format&fit=crop&q=80',
      ingredients: 'Potatoes, Vegetable Oil, Peri Peri Seasoning, Sea Salt',
      dietaryType: DietaryType.VEGAN,
      available: true,
      stockQuantity: 50,
      preparationTime: 7,
    },

    // Beverages
    {
      name: 'Campus Special Masala Chai',
      category: 'Beverages',
      description: 'Strong, aromatic black tea brewed with fresh ginger, cardamom pods, cloves, and rich dairy milk.',
      price: 15,
      imageUrl: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=800&auto=format&fit=crop&q=80',
      ingredients: 'Assam Tea Leaves, Fresh Ginger, Green Cardamom, Milk, Sugar',
      dietaryType: DietaryType.VEGETARIAN,
      available: true,
      stockQuantity: 100,
      preparationTime: 3,
    },
    {
      name: 'South Indian Filter Coffee',
      category: 'Beverages',
      description: 'Authentic frothy chicory-blended decoction coffee served hot in traditional brass tumbler-davarah style.',
      price: 20,
      imageUrl: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800&auto=format&fit=crop&q=80',
      ingredients: 'Dark Roast Coffee Beans, Chicory, Boiled Milk, Sugar',
      dietaryType: DietaryType.VEGETARIAN,
      available: true,
      stockQuantity: 80,
      preparationTime: 4,
    },
    {
      name: 'Fresh Mint Lime Soda',
      category: 'Beverages',
      description: 'Refreshing sparkling lime juice muddled with fresh mint leaves and black salt (Sweet or Salted).',
      price: 35,
      imageUrl: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=800&auto=format&fit=crop&q=80',
      ingredients: 'Fresh Lime, Mint Leaves, Carbonated Soda, Sugar Syrup, Black Salt',
      dietaryType: DietaryType.VEGAN,
      available: true,
      stockQuantity: 60,
      preparationTime: 4,
    },
    {
      name: 'Mango Lassi',
      category: 'Beverages',
      description: 'Thick, chilled sweet yogurt blended with Alphonso mango pulp and garnished with crushed pistachios.',
      price: 50,
      imageUrl: 'https://images.unsplash.com/photo-1553530666-ba11a7da3888?w=800&auto=format&fit=crop&q=80',
      ingredients: 'Fresh Curd (Yogurt), Mango Pulp, Cardamom, Sugar, Pistachios',
      dietaryType: DietaryType.VEGETARIAN,
      available: true,
      stockQuantity: 35,
      preparationTime: 5,
    },

    // Desserts
    {
      name: 'Warm Gulab Jamun (2 pcs)',
      category: 'Desserts',
      description: 'Melt-in-mouth fried milk dumplings soaked in rose water and cardamom infused sugar syrup.',
      price: 40,
      imageUrl: 'https://images.unsplash.com/photo-1589119908995-c6837fa14d48?w=800&auto=format&fit=crop&q=80',
      ingredients: 'Khoya, Paneer, Cardamom, Rose Water, Sugar Syrup',
      dietaryType: DietaryType.VEGETARIAN,
      available: true,
      stockQuantity: 40,
      preparationTime: 3,
    },
    {
      name: 'Chocolate Brownie with Ice Cream',
      category: 'Desserts',
      description: 'Warm fudge chocolate walnut brownie topped with a scoop of creamy vanilla ice cream and chocolate drizzle.',
      price: 70,
      imageUrl: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=800&auto=format&fit=crop&q=80',
      ingredients: 'Dark Chocolate, Flour, Butter, Sugar, Vanilla Ice Cream',
      dietaryType: DietaryType.VEGETARIAN,
      available: true,
      stockQuantity: 25,
      preparationTime: 5,
    },
  ];

  const createdFoodItems = [];
  for (const item of foodItemsData) {
    const created = await prisma.foodItem.create({
      data: {
        name: item.name,
        categoryId: categoriesMap[item.category],
        description: item.description,
        price: item.price,
        imageUrl: item.imageUrl,
        ingredients: item.ingredients,
        dietaryType: item.dietaryType,
        available: item.available,
        stockQuantity: item.stockQuantity,
        preparationTime: item.preparationTime,
      },
    });
    createdFoodItems.push(created);
  }

  console.log(`🍛 Seeded ${createdFoodItems.length} Food Items.`);

  // 7. Generate 30 Days of Historical Orders for Analytics & Moving Average Forecasting
  console.log('📈 Generating 30 days of realistic historical order data for Moving Average forecasting...');

  const now = new Date();
  let orderSequence = 1000;

  // Base daily demand targets for key items to create realistic statistical curves
  const dailyBaseSales: Record<string, number> = {
    'Chicken Biriyani': 42,
    'Vegetable Biriyani': 28,
    'Chicken Fried Rice': 35,
    'Veg Hakka Noodles': 22,
    'Malabar Parotta with Chicken Curry': 38,
    'Chapathi with Veg Kurma': 20,
    'South Indian Thali Meals': 50,
    'Special Chicken Meals': 32,
    'Masala Dosa': 36,
    'Idli Vada Combo': 30,
    'Crispy Samosa (2 pcs)': 55,
    'Chicken Cutlet (2 pcs)': 26,
    'Egg Puffs': 32,
    'Campus Special Masala Chai': 75,
    'South Indian Filter Coffee': 48,
    'Fresh Mint Lime Soda': 30,
    'Mango Lassi': 25,
    'Warm Gulab Jamun (2 pcs)': 20,
    'Chocolate Brownie with Ice Cream': 15,
  };

  for (let daysAgo = 30; daysAgo >= 1; daysAgo--) {
    const orderDate = new Date(now);
    orderDate.setDate(orderDate.getDate() - daysAgo);

    // Weekday vs weekend factor
    const dayOfWeek = orderDate.getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    const dayMultiplier = isWeekend ? 0.6 : (dayOfWeek === 5 ? 1.2 : 1.0); // Fridays peak, weekends lower

    // Generate 15-25 orders for this day
    const numOrders = Math.floor((16 + Math.random() * 8) * dayMultiplier);

    for (let o = 0; o < numOrders; o++) {
      orderSequence++;
      const student = students[Math.floor(Math.random() * students.length)];

      // Random order time during college hours (8:30 AM to 5:30 PM)
      const orderTime = new Date(orderDate);
      const hour = 8 + Math.floor(Math.random() * 9);
      const minute = Math.floor(Math.random() * 60);
      orderTime.setHours(hour, minute, 0, 0);

      // Select 1 to 3 distinct items
      const numItems = Math.random() > 0.6 ? (Math.random() > 0.8 ? 3 : 2) : 1;
      const shuffledItems = [...createdFoodItems].sort(() => 0.5 - Math.random());
      const selectedItems = shuffledItems.slice(0, numItems);

      let orderTotal = 0;
      const orderItemsPayload = [];

      for (const item of selectedItems) {
        // Quantity usually 1, sometimes 2
        const qty = Math.random() > 0.75 ? 2 : 1;
        const subtotal = item.price * qty;
        orderTotal += subtotal;

        orderItemsPayload.push({
          foodItemId: item.id,
          quantity: qty,
          unitPrice: item.price,
          subtotal: subtotal,
        });
      }

      const order = await prisma.order.create({
        data: {
          orderNumber: `CB-${orderTime.getFullYear()}-${orderSequence}`,
          userId: student.id,
          totalAmount: orderTotal,
          status: OrderStatus.COMPLETED,
          paymentStatus: PaymentStatus.SUCCESS,
          pickupTime: new Date(orderTime.getTime() + 20 * 60000),
          createdAt: orderTime,
          updatedAt: new Date(orderTime.getTime() + 25 * 60000),
          items: {
            create: orderItemsPayload,
          },
          payment: {
            create: {
              transactionReference: `TXN-${orderTime.getTime()}-${orderSequence}`,
              amount: orderTotal,
              method: PaymentMethod.MOCK,
              status: PaymentStatus.SUCCESS,
              paidAt: orderTime,
            },
          },
          statusHistory: {
            create: [
              { status: OrderStatus.PLACED, changedBy: student.id, timestamp: orderTime },
              { status: OrderStatus.CONFIRMED, changedBy: kitchenLead.id, timestamp: new Date(orderTime.getTime() + 2 * 60000) },
              { status: OrderStatus.PREPARING, changedBy: kitchenLead.id, timestamp: new Date(orderTime.getTime() + 5 * 60000) },
              { status: OrderStatus.READY, changedBy: kitchenLead.id, timestamp: new Date(orderTime.getTime() + 18 * 60000) },
              { status: OrderStatus.COMPLETED, changedBy: kitchenLead.id, timestamp: new Date(orderTime.getTime() + 25 * 60000) },
            ],
          },
        },
      });
    }
  }

  // 8. Generate Active Orders for Today to Demonstrate Live Kitchen Queue and Student Tracker
  console.log('⚡ Generating live demo orders for today...');

  const todayOrders = [
    {
      status: OrderStatus.PLACED,
      studentIndex: 0, // Arjun Das (student@campusbite.local)
      itemIndices: [0, 16], // Chicken Biriyani, Masala Chai
      minutesAgo: 3,
      pickupMinutes: 20,
    },
    {
      status: OrderStatus.CONFIRMED,
      studentIndex: 1, // Rahul Sharma
      itemIndices: [1, 18], // Veg Biriyani, Lime Soda
      minutesAgo: 6,
      pickupMinutes: 18,
    },
    {
      status: OrderStatus.PREPARING,
      studentIndex: 2, // Ananya Sen
      itemIndices: [9, 17], // Masala Dosa, Filter Coffee
      minutesAgo: 12,
      pickupMinutes: 10,
    },
    {
      status: OrderStatus.PREPARING,
      studentIndex: 3, // Vikram Patel
      itemIndices: [4, 12], // Malabar Parotta, Samosa
      minutesAgo: 15,
      pickupMinutes: 12,
    },
    {
      status: OrderStatus.READY,
      studentIndex: 4, // Priya Nair
      itemIndices: [7, 19], // South Indian Thali, Mango Lassi
      minutesAgo: 22,
      pickupMinutes: 0,
    },
    {
      status: OrderStatus.COMPLETED,
      studentIndex: 5, // Sneha Reddy
      itemIndices: [2, 14], // Chicken Fried Rice, Egg Puffs
      minutesAgo: 45,
      pickupMinutes: 0,
    },
  ];

  for (const demo of todayOrders) {
    orderSequence++;
    const student = students[demo.studentIndex];
    const orderTime = new Date(Date.now() - demo.minutesAgo * 60000);
    const pickupTime = new Date(Date.now() + demo.pickupMinutes * 60000);

    let total = 0;
    const itemsPayload = [];
    for (const idx of demo.itemIndices) {
      const item = createdFoodItems[idx];
      total += item.price;
      itemsPayload.push({
        foodItemId: item.id,
        quantity: 1,
        unitPrice: item.price,
        subtotal: item.price,
      });
    }

    const order = await prisma.order.create({
      data: {
        orderNumber: `CB-${now.getFullYear()}-${orderSequence}`,
        userId: student.id,
        totalAmount: total,
        status: demo.status,
        paymentStatus: PaymentStatus.SUCCESS,
        pickupTime: pickupTime,
        createdAt: orderTime,
        updatedAt: new Date(),
        items: {
          create: itemsPayload,
        },
        payment: {
          create: {
            transactionReference: `TXN-DEMO-${orderSequence}`,
            amount: total,
            method: PaymentMethod.MOCK,
            status: PaymentStatus.SUCCESS,
            paidAt: orderTime,
          },
        },
        statusHistory: {
          create: [
            { status: OrderStatus.PLACED, changedBy: student.id, timestamp: orderTime },
            ...(demo.status !== OrderStatus.PLACED ? [{ status: OrderStatus.CONFIRMED, changedBy: kitchenLead.id, timestamp: new Date(orderTime.getTime() + 2 * 60000) }] : []),
            ...(demo.status === OrderStatus.PREPARING || demo.status === OrderStatus.READY || demo.status === OrderStatus.COMPLETED ? [{ status: OrderStatus.PREPARING, changedBy: kitchenLead.id, timestamp: new Date(orderTime.getTime() + 5 * 60000) }] : []),
            ...(demo.status === OrderStatus.READY || demo.status === OrderStatus.COMPLETED ? [{ status: OrderStatus.READY, changedBy: kitchenLead.id, timestamp: new Date(orderTime.getTime() + 18 * 60000) }] : []),
            ...(demo.status === OrderStatus.COMPLETED ? [{ status: OrderStatus.COMPLETED, changedBy: kitchenLead.id, timestamp: new Date(orderTime.getTime() + 25 * 60000) }] : []),
          ],
        },
        notifications: {
          create: [
            {
              userId: student.id,
              type: 'ORDER_UPDATE',
              title: demo.status === OrderStatus.READY ? 'Order Ready for Pickup! 🔔' : `Order Update: ${demo.status}`,
              message: demo.status === OrderStatus.READY 
                ? `Your order #CB-${now.getFullYear()}-${orderSequence} is ready at Counter 1.` 
                : `Your order #CB-${now.getFullYear()}-${orderSequence} is currently ${demo.status.toLowerCase()}.`,
              read: false,
            },
          ],
        },
      },
    });
  }

  console.log('✅ CampusBite seed completed successfully!');
  console.log('---------------------------------------------------------');
  console.log('Demo Credentials for MCA Presentation:');
  console.log('👉 Admin:   admin@campusbite.local   / Admin@123');
  console.log('👉 Kitchen: kitchen@campusbite.local / Kitchen@123');
  console.log('👉 Student: student@campusbite.local / Student@123');
  console.log('---------------------------------------------------------');
}

main()
  .catch((e) => {
    console.error('❌ Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
