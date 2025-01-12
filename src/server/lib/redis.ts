import { createClient, type RedisClientType } from "redis";
import { env } from "~/env";

export class RedisOperator {
  private client: RedisClientType;

  constructor() {
    this.client = createClient({ url: env.REDIS_URL });

    // Handle Redis connection errors
    this.client.on("error", (err) => console.error("Redis Client Error", err));

    // Connect to Redis when the class is instantiated
    this.client
      .connect()
      .catch((err) => console.error("Failed to connect to Redis:", err));
  }

  // Fetch a value by key from Redis
  async get(key: string): Promise<string | null> {
    try {
      return await this.client.get(key);
    } catch (error) {
      console.error(`Error fetching key ${key} from Redis:`, error);
      throw error;
    }
  }

  // Set a key-value pair in Redis with an optional expiration time in seconds
  async set(
    key: string,
    value: string,
    expirationTimeInSeconds?: number,
  ): Promise<string | null> {
    try {
      if (expirationTimeInSeconds) {
        return await this.client.set(key, value, {
          EX: expirationTimeInSeconds,
        });
      }
      return await this.client.set(key, value);
    } catch (error) {
      console.error(`Error setting key ${key} in Redis:`, error);
      throw error;
    }
  }

  // Optionally close the Redis connection
  async close(): Promise<void> {
    try {
      await this.client.quit();
    } catch (error) {
      console.error("Error closing Redis connection:", error);
      throw error;
    }
  }
}
