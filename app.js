import express from "express"
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import mongoSanitize from "express-mongo-sanitize";
import hpp from "hpp";
import cors from "cors";
import path, { dirname, resolve, join } from 'path';
import { fileURLToPath } from 'url';
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import dotEnv from "dotenv";
import adminRouter from "./src/routes/admin.route.js";
dotEnv.config();

const app = express();

// const __dirname = dirname(fileURLToPath(import.meta.url));

// Connect to MongoDB
if (!process.env.DB_USER || !process.env.DB_PASS || !process.env.DB_CLUSTER || !process.env.DB_NAME) {
  throw new Error("Missing DB configuration");
}

const URL = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.${process.env.DB_CLUSTER}.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const option = {
    autoIndex: process.env.NODE_ENV !== 'production',
    serverSelectionTimeoutMS: 50000,
}

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(URL, option);
    console.log(`✅ DB Connected - Name: ${conn.connection.name}`);
  } catch (error) {
    console.error('❌ Database connection error:', error.message);
    process.exit(1);
  }
};

connectDB();
mongoose.set('strictQuery', true);

// Global Middlewares - Order is important!
app.use(cookieParser());
app.use(cors({
    origin: ['http://localhost:5173', 'http://localhost:5000'],
    credentials: true,
}));

// Parse request bodies FIRST
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  // Store original query
  req.originalQuery = { ...req.query };
  next();
});

// Helmet (doesn't modify req properties)
app.use(helmet.contentSecurityPolicy({
  useDefaults: true,
  directives: {
    'img-src': ["'self'", "https:", "data:"]
  }
}));

// HPP - but only for query parameters
app.use(hpp());

// MongoDB sanitization - but use a custom approach for query
app.use((req, res, next) => {
  if (req.body) {
    req.body = mongoSanitize.sanitize(req.body);
  }
  
  // Sanitize params
  if (req.params) {
    const sanitizedParams = {};
    Object.keys(req.params).forEach(key => {
      sanitizedParams[key] = mongoSanitize.sanitize(req.params[key]);
    });
    req.sanitizedParams = sanitizedParams;
  }
  
  next();
});

// Rate limiting
const reqLimit = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 3000,
});
app.use(reqLimit);

// Routes
app.use("/api/v1/ep/admin", adminRouter);
app.use("/api/v1/get-file", express.static("uploads"));

// app.use('/super-admin', 
//     express.static(join(__dirname, "client", "super-admin", "dist"), {
//         index: false,
//     })
// );
// app.get("/super-admin/*", (req, res) => {
//     res.sendFile(
//         resolve(__dirname, "client", "super-admin", "dist", "index.html")
//     );
// });


// app.use(express.static(join(__dirname, "client", "ecommerce", "dist"))
// );

// app.get("*", function(req, res){
//     res.sendFile(
//         resolve(__dirname, "client", "ecommerce", "dist", "index.html")
//     )
// });

export default app;