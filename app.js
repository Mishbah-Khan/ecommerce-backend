import express from "express"
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import ExpressMongoSanitize from "express-mongo-sanitize";
import hpp from "hpp";
import path from "path"
import cors from "cors"
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import  dotEnv  from "dotenv";


const app =  new express();

dotEnv.config();