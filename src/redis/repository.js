import { RedisCollection } from "./collection.js";

export class RedisRepository {
  constructor(client, options = {}) {
    this.client = client;
    this.defaultOptions = options;
    this.collection = new Proxy(
      {},
      {
        get: (_, name) =>
          new RedisCollection(this.client, name, this.defaultOptions),
      }
    );
  }
}
