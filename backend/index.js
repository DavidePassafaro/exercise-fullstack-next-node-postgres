const express = require("express");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();
const app = express();

// JSON
app.use(express.json());

// CORS
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  next();
});

// TEST
app.get("/test", (req, res) => {
  res.json({ message: "Hello World" });
});

// GET users
app.get("/users", async (req, res) => {
  try {
    const users = await prisma.user.findMany();
    res.status(200).json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

// GET user by id
app.get("/users/:id", async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: parseInt(req.params.id),
      },
    });
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST user
app.post("/users", async (req, res) => {
  try {
    const user = await prisma.user.create({
      data: {
        name: req.body.name,
        email: req.body.email,
      },
    });
    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT user
app.put("/users/:id", async (req, res) => {
  try {
    const user = await prisma.user.update({
      where: {
        id: parseInt(req.params.id),
      },
      data: {
        name: req.body.name,
        email: req.body.email,
      },
    });
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE user
app.delete("/users/:id", async (req, res) => {
  try {
    const user = await prisma.user.delete({
      where: {
        id: parseInt(req.params.id),
      },
    });
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// START SERVER
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
