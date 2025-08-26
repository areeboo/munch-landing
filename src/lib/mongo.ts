import { MongoClient } from "mongodb";
import { env } from "./env";
import { getDbPoolConfig, config } from "./config";

const uri = env.MONGODB_URI;

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

declare global {
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

// Get pool configuration from centralized config
const poolConfig = getDbPoolConfig();
const timeouts = config.database.timeouts;

// Better connection handling for both dev and production
if (process.env.NODE_ENV === "development") {
  // In development, use a global variable to preserve the connection across module reloads
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, {
      maxPoolSize: poolConfig.max,
      minPoolSize: poolConfig.min,
      maxIdleTimeMS: timeouts.idle,
      serverSelectionTimeoutMS: timeouts.server,
    });
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise!;
} else {
  // In production, always create a new connection with proper pooling
  client = new MongoClient(uri, {
    maxPoolSize: poolConfig.max,
    minPoolSize: poolConfig.min,
    maxIdleTimeMS: timeouts.idle,
    serverSelectionTimeoutMS: timeouts.server,
    socketTimeoutMS: timeouts.socket,
  });
  clientPromise = client.connect();
}

export default clientPromise;