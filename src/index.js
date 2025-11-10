import client from "./config.js";
import { RedisRepository } from "./redis/repository.js";

const redis = new RedisRepository(client, {
  useHash: false,
  ttl: 0,
  indexes: ["role", "age"],
});

export default redis;
