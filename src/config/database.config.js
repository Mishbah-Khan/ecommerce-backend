import dotEnv from "dotenv";
import mongoose from "mongoose";

dotEnv.config();

if (!process.env.DB_USER || !process.env.DB_PASS || !process.env.DB_CLUSTER || !process.env.DB_NAME) {
  throw new Error("Missing DB configuration");
}

const ConnectDB = async () => {
// const URL = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.${process.env.DB_CLUSTER}.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const URL = 'mongodb://localhost:27017/ecommarce'
const option = {
    autoIndex: process.env.NODE_ENV !== 'production',
    serverSelectionTimeoutMS: 50000,
}


  try {
    const conn = await mongoose.connect(URL, option);
    console.log(`✅ DB Connected - Name: ${conn.connection.name}`);
  } catch (error) {
    console.error('❌ Database connection error:', error.message);
    process.exit(1);
  }
};

mongoose.set('strictQuery', true);
export default ConnectDB;