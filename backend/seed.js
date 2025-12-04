const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');

dotenv.config();

const User = require('./models/User');
const Book = require('./models/Book');
const Request = require('./models/Request');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected');
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
};

const seedDatabase = async () => {
  await connectDB();

  try {
    // Clear existing data
    await User.deleteMany({});
    await Book.deleteMany({});
    await Request.deleteMany({});
    console.log('Cleared existing data');

    // Create users (hash passwords first because insertMany bypasses mongoose pre 'save' hooks)
    const usersData = [
      {
        name: 'Admin User',
        email: 'admin@example.com',
        password: 'admin123',
        role: 'admin',
      },
      {
        name: 'John Doe',
        email: 'user@example.com',
        password: 'password123',
        role: 'user',
      },
      {
        name: 'Jane Smith',
        email: 'jane@example.com',
        password: 'password123',
        role: 'user',
      },
    ];

    // Hash passwords before insert
    for (const u of usersData) {
      const salt = await bcrypt.genSalt(10);
      u.password = await bcrypt.hash(u.password, salt);
    }

    const users = await User.insertMany(usersData);
    console.log('✓ Users created:', users.length);

    // Create books
    const books = await Book.insertMany([
      {
        title: 'The Great Gatsby',
        author: 'F. Scott Fitzgerald',
        description: 'A classic tale of love and ambition in the Jazz Age.',
        category: 'Fiction',
        isbn: '978-0743273565',
        stock: 5,
        coverImageUrl: 'https://images.unsplash.com/photo-1543002588-d0ac3f76b4c9?w=400',
      },
      {
        title: 'To Kill a Mockingbird',
        author: 'Harper Lee',
        description: 'A gripping tale of racial injustice and childhood innocence.',
        category: 'Fiction',
        isbn: '978-0061120084',
        stock: 3,
        coverImageUrl: 'https://images.unsplash.com/photo-1507842217343-583f7270bfba?w=400',
      },
      {
        title: '1984',
        author: 'George Orwell',
        description: 'A dystopian novel about totalitarianism and freedom.',
        category: 'Dystopian',
        isbn: '978-0451524935',
        stock: 4,
        coverImageUrl: 'https://images.unsplash.com/photo-1506880018603-83d5b814b5a6?w=400',
      },
      {
        title: 'Sapiens',
        author: 'Yuval Noah Harari',
        description: 'A brief history of humankind from the Stone Age to modern times.',
        category: 'Non-Fiction',
        isbn: '978-0062316097',
        stock: 2,
        coverImageUrl: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=400',
      },
      {
        title: 'The Lean Startup',
        author: 'Eric Ries',
        description: 'How today\'s entrepreneurs build successful businesses.',
        category: 'Business',
        isbn: '978-0307887894',
        stock: 3,
        coverImageUrl: 'https://images.unsplash.com/photo-1450026231511-45f94aaf4166?w=400',
      },
      {
        title: 'Atomic Habits',
        author: 'James Clear',
        description: 'Transform your habits and achieve remarkable results.',
        category: 'Self-Help',
        isbn: '978-0735211292',
        stock: 6,
        coverImageUrl: 'https://images.unsplash.com/photo-1546994124-3b8c9a01b309?w=400',
      },
      {
        title: 'The Catcher in the Rye',
        author: 'J.D. Salinger',
        description: 'A story of teenage rebellion and alienation.',
        category: 'Fiction',
        isbn: '978-0316769174',
        stock: 2,
        coverImageUrl: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400',
      },
      {
        title: 'Educated',
        author: 'Tara Westover',
        description: 'A memoir about a young woman who leaves her survivalist family.',
        category: 'Memoir',
        isbn: '978-0399590504',
        stock: 4,
        coverImageUrl: 'https://images.unsplash.com/photo-1507842217343-583f7270bfba?w=400',
      },
    ]);
    console.log('✓ Books created:', books.length);

    // Create some requests
    const requests = await Request.insertMany([
      {
        userId: users[1]._id,
        bookId: books[0]._id,
        status: 'Pending',
        requestDate: new Date(),
      },
      {
        userId: users[1]._id,
        bookId: books[1]._id,
        status: 'Approved',
        requestDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      },
      {
        userId: users[2]._id,
        bookId: books[2]._id,
        status: 'Issued',
        requestDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        issueDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      },
    ]);
    console.log('✓ Requests created:', requests.length);

    console.log('\n✅ Database seeded successfully!');
    console.log('\nDemo Credentials:');
    console.log('Admin - Email: admin@example.com, Password: admin123');
    console.log('User  - Email: user@example.com, Password: password123');

  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await mongoose.connection.close();
    console.log('\nDatabase connection closed');
  }
};

seedDatabase();
