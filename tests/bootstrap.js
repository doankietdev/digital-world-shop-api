import { closeDB, connectDB } from "~/configs/mongodb";
import { RedisDB } from "~/databases/init.redis";

let redisClient;

beforeAll(async () => {
  await connectDB();
  redisClient = RedisDB.getInstance().getRedis();
});

afterAll(async () => {
  closeDB().then().catch(), redisClient.flushall().then().catch();
});
