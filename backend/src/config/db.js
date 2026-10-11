const mongoose = require('mongoose');

const connectDB = async () => {
  const mongoUri = process.env.MONGO_URI;

  if (!mongoUri || mongoUri.includes('USERNAME:PASSWORD') || mongoUri.includes('CLUSTER.mongodb.net')) {
    console.warn('⚠️ WARNING: MONGO_URI is missing or contains placeholder credentials.');
    console.warn('👉 Please configure your real MongoDB Atlas connection string in .env:');
    console.warn('   MONGO_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/employee_management\n');
    return null;
  }

  try {
    const conn = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 8000,
    });

    console.log(`✅ MongoDB Atlas Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`❌ MongoDB Atlas Connection Error: ${error.message}`);
    console.warn('👉 Please verify your MongoDB Atlas username, password, IP whitelist, and network connectivity.');
    return null;
  }
};

module.exports = connectDB;
