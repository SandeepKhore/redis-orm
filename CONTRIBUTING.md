# 🤝 Contributing to Redis ORM

Thank you for considering contributing to **Redis ORM** 🚀  
Your help makes this project better for everyone!

---

## 🧱 Project Overview

**Redis ORM** is a lightweight MongoDB-like repository layer built on top of [ioredis](https://github.com/luin/ioredis).  
It adds query filtering, auto indexing, TTL, and collection-style APIs for Redis.

---

## 🧑‍💻 How to Contribute

### 1. Fork & Clone
```bash
git clone https://github.com/sandeepkhore/redis-lite-orm.git
cd redis-lite-orm
npm install
```

### 2. Create a New Branch
Follow naming convention:
```bash
git checkout -b feature/add-pagination
```
Examples:
- feature/add-ttl
- fix/index-cleanup
- docs/update-readme

### 3. Code Style
We follow:
- JavaScript ES2020+
- 2-space indentation
- Use async/await (no .then() chaining)
- Keep functions small & modular
- Add JSDoc comments for public methods

Use Prettier for formatting:
```bash
npm run format
```

### 4. Testing Your Changes
Make sure your code runs without breaking existing features:
```bash
node main.js
```
You can use a local Redis instance:
```bash
redis-server
```

### 5. Commit Convention
[Follow Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/):
| Type     | Example                                  | Description           |
| -------- | ---------------------------------------- | --------------------- |
| feat     | `feat: add auto-index cleanup on delete` | new feature           |
| fix      | `fix: regex query edge case`             | bug fix               |
| docs     | `docs: update README with usage example` | documentation         |
| refactor | `refactor: optimize key lookups`         | internal code changes |
| test     | `test: add tests for TTL support`        | test changes          |

### 6. Push and Open a PR
```bash
git push origin feature/add-pagination
```
Then open a Pull Request (PR) on GitHub with:
- A clear description of what you changed
- Screenshots or logs if helpful
- Reference related issues if any (e.g. Closes #12)

---

## 🧪 Running Redis Locally
Make sure Redis is running:
```bash
brew install redis
redis-server
```
or use Docker:
```bash
docker run --name redis -p 6379:6379 -d redis
```

---

## 🧠 Contribution Ideas
- 🧩 Add pagination support (limit, skip)
- 📊 Add .count() and .exists() helpers
- ⚡ Optimize index cleanup for TTL expiry
- 🧱 Add schema validation support
- 🧰 Add test suite (Jest / Mocha)

---

## 💬 Community
For feature requests or questions:
- [Open an Issue](https://github.com/sandeepkhore/redis-lite-orm/issues)
- [Start a Discussion](https://github.com/SandeepKhore/redis-lite-orm/discussions/)
