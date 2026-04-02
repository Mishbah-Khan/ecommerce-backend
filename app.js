import express from "express"
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import mongoSanitize from "express-mongo-sanitize";
import hpp from "hpp";
import cors from "cors";
import path, { dirname, resolve, join } from 'path';
import { fileURLToPath } from 'url';
import cookieParser from "cookie-parser";
import ConnectDB from "./src/config/database.config.js";
import adminRouter from "./src/routes/admin.route.js";
import userRouter from "./src/routes/user.route.js";
import productRouter from "./src/routes/product.route.js";
import brandRouter from "./src/routes/brand.route.js";
import categoryRouter from "./src/routes/category.route.js";

const app = express();

const __dirname = dirname(fileURLToPath(import.meta.url));

// Connect to MongoDB
ConnectDB();

// Global Middlewares - Order is important!
app.use(cookieParser());
app.use(cors({
    origin: ['http://localhost:5173' , 'http://localhost:5000'],
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
app.use("/api/v1/ep/user", userRouter);
app.use("/api/v1/ep/product", productRouter);
app.use("/api/v1/ep/brand", brandRouter);
app.use("/api/v1/ep/category", categoryRouter);
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