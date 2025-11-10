import Redis from "ioredis";

const client = new Redis({
  host: process.env.REDIS_HOST || "127.0.0.1",
  port: process.env.REDIS_PORT || 6379,
  password: process.env.REDIS_PASSWORD || null,
});

client.on("connect", () => console.log("✅ Redis connected"));
client.on("error", (err) => console.error("❌ Redis Error:", err));

export default client;
