import { closeDB, connectDB } from "~/configs/mongodb";
import { RedisDB } from "~/databases/init.redis";

let redisClient;

beforeAll(async () => {
  await connectDB();
  redisClient = RedisDB.getInstance().getRedis();
});

afterAll(async () => {
  closeDB()
    .then(() => {
      console.log("Disconnected from MongoDB successfully");
    })
    .catch(() => {
      console.log("Disconnect from MongoDB failed");
    }),
    redisClient
      .flushall()
      .then(() => {
        console.log("Flushed all Redis cache successfully");
      })
      .catch((err) => {
        console.log("Failed to flush Redis cache", err);
      });
});
