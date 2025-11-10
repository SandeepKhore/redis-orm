export class RedisCollection {
  constructor(client, name, options = {}) {
    this.client = client;
    this.name = name;
    this.useHash = options.useHash || false;
    this.defaultTTL = options.ttl || 0;
    this.indexedFields = new Set(options.indexes || []);
  }

  _key(id) {
    return `${this.name}:${id}`;
  }

  _indexKey(field, value) {
    return `${this.name}:index:${field}:${value}`;
  }

  async _saveData(key, obj) {
    if (this.useHash) {
      await this.client.hmset(key, obj);
    } else {
      await this.client.set(key, JSON.stringify(obj));
    }
    if (this.defaultTTL > 0) await this.client.expire(key, this.defaultTTL);
  }

  async _getData(key) {
    if (this.useHash) return await this.client.hgetall(key);
    const raw = await this.client.get(key);
    return raw ? JSON.parse(raw) : null;
  }

  async _updateIndexes(obj) {
    const id = obj.id || obj.userId;
    const key = this._key(id);

    // Remove old index entries
    for (const field of this.indexedFields) {
      const oldKeys = await this.client.keys(this._indexKey(field, "*"));
      for (const oldKey of oldKeys) await this.client.srem(oldKey, key);
    }

    // Add new index entries
    for (const field of this.indexedFields) {
      if (obj[field] !== undefined) {
        const indexKey = this._indexKey(field, obj[field]);
        await this.client.sadd(indexKey, key);
      }
    }
  }

  async _removeIndexes(obj) {
    const id = obj.id || obj.userId;
    const key = this._key(id);

    for (const field of this.indexedFields) {
      if (obj[field] !== undefined) {
        const indexKey = this._indexKey(field, obj[field]);
        await this.client.srem(indexKey, key);
      }
    }
  }

  async set(obj, ttl = this.defaultTTL) {
    const id = obj.id || obj.userId;
    if (!id) throw new Error("Missing id or userId field");

    const key = this._key(id);
    await this._saveData(key, obj);
    await this._updateIndexes(obj);

    if (ttl > 0) await this.client.expire(key, ttl);
    return obj;
  }

  async find(query = {}) {
    const indexedKeys = [];
    const nonIndexed = {};

    for (const [field, value] of Object.entries(query)) {
      if (this.indexedFields.has(field) && typeof value === "string") {
        indexedKeys.push(this._indexKey(field, value));
      } else {
        nonIndexed[field] = value;
      }
    }

    let candidateKeys = [];
    if (indexedKeys.length === 1)
      candidateKeys = await this.client.smembers(indexedKeys[0]);
    else if (indexedKeys.length > 1)
      candidateKeys = await this.client.sinter(indexedKeys);
    else
      candidateKeys = await this.client.keys(`${this.name}:*`);

    const results = [];
    for (const key of candidateKeys) {
      const obj = await this._getData(key);
      if (obj && this._matchesQuery(obj, nonIndexed)) results.push(obj);
    }

    return results;
  }

  async findOne(query = {}) {
    const result = await this.find(query);
    return result[0] || null;
  }

  async update(query, updates) {
    const matches = await this.find(query);
    for (const obj of matches) {
      const id = obj.id || obj.userId;
      const updated = { ...obj, ...updates };
      await this._saveData(this._key(id), updated);
      await this._updateIndexes(updated);
    }
    return matches.length;
  }

  async delete(query) {
    const matches = await this.find(query);
    for (const obj of matches) {
      const id = obj.id || obj.userId;
      const key = this._key(id);
      await this._removeIndexes(obj);
      await this.client.del(key);
    }
    return matches.length;
  }

  _matchesQuery(obj, query) {
    return Object.entries(query).every(([field, condition]) => {
      const value = obj[field];
      if (typeof condition === "object" && condition !== null) {
        if ("$in" in condition) return condition.$in.includes(value);
        if ("$ne" in condition) return value !== condition.$ne;
        if ("$gt" in condition) return value > condition.$gt;
        if ("$lt" in condition) return value < condition.$lt;
        if ("$regex" in condition)
          return new RegExp(condition.$regex, condition.$options || "").test(value);
      }
      return value === condition;
    });
  }
}
