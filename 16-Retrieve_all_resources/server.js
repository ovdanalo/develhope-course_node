const express = require('express');
require('dotenv').config();
const { PrismaClient } = require('@prisma/client');

const app = express();
const port = process.env.PORT;

const prisma = new PrismaClient();

app.get('/planets', async (req, res) => {
  const planets = await prisma.planet.findMany();

  res.json(planets);
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

module.exports = app;
