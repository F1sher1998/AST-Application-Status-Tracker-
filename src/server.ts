import express from "express";
import cors from 'cors'
import dotenv from 'dotenv'
import userRouter from "./routes/user-routes"
import applicationRouter from "./routes/application-routes"
import http from 'http'
import roundRouter from './routes/round-routes'
import checkRouter from './routes/checks-routes'
import cookieParser from "cookie-parser";
import { createClient } from 'redis';


dotenv.config()
const app = express();
const server = http.createServer(app)

const redis = createClient({
    username: process.env.REDIS_USERNAME,
    password: process.env.REDIS_PASSWORD,
    socket: {
        host: process.env.REDIS_HOST,
        port: Number(process.env.REDIS_PORT)
    }
})


// body parses
app.use(cookieParser())
app.use(express.json());
app.use(express.urlencoded({ extended:true }))

app.use((req, res, next) => {
  if (isShuttingDown) {
    res.status(503).send("Server is shutting down");
    return;
  }
  next();
});



// security
app.use(cors({
    origin: [
        'http://localhost:5173',
        'http://localhost:8000',
        'http://localhost:5500',
        'http://127.0.0.1:5500',
        'http://127.0.0.1:8000'
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}))


//server config
app.use("/users", userRouter)
app.use("/applications", applicationRouter)
app.use("/rounds", roundRouter)
app.use("/check", checkRouter)


// start server
server.listen(process.env.PORT, () => {});

// start redis
redis.connect();
redis.on("error", (err) => {
    console.log("Redis error:", err)
})


// Hnadling gracefull exits

interface DbPool {
  end: () => Promise<void>;
}

const dbPool: DbPool = {
  async end() {
    console.log("DB pool closed");
  },
};


let isShuttingDown = false;

async function gracefulShutdown(signal: string) {
  if (isShuttingDown) return;
  isShuttingDown = true;

  console.log(`\n${signal} received. Shutting down gracefully…`);

  // Stop accepting new HTTP connections
  await new Promise<void>((resolve) => {
    server.close(() => {
      console.log("HTTP server closed");
      resolve();
    });
  });

  // Close DB pool
  try {
    await dbPool.end();
  } catch (err) {
    console.error("DB shutdown error:", err);
  }

  // Close Redis
  try {
    await redis.quit();
    console.log("Redis connection closed");
  } catch (err) {
    console.error("Redis shutdown error:", err);
  }

  console.log("Shutdown complete.");
  process.exit(0);
}

process.on("SIGINT", gracefulShutdown);
process.on("SIGTERM", gracefulShutdown);



const FORCE_EXIT_TIMEOUT = 10_000;

process.on("SIGTERM", (signal) => {
  setTimeout(() => {
    console.error("Forced shutdown after timeout");
    process.exit(1);
  }, FORCE_EXIT_TIMEOUT);
});