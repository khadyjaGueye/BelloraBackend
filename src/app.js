const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

const testRoute = require('./routes/test.route');
const categoryRoute = require('./routes/category.route');
const productRoute = require('./routes/product.route');
const orderRoute = require('./routes/order.route');
const authRoute = require("./routes/auth.route");
const userRoutes = require('./routes/user.route');

const path = require('path');

app.use('/api/test', testRoute);

app.use('/api/categories', categoryRoute);

app.use('/api/products', productRoute);

app.use(
    '/uploads',
    express.static(
        path.join(
            __dirname,
            '../uploads'
        )
    )
);

app.use('/api/orders', orderRoute);

app.use("/api/auth", authRoute);

app.use("/api/users", userRoutes);

  const prisma = require("./config/prisma");

app.get("/api/debug", async (req, res) => {
  try {
    res.json({
      prismaKeys: Object.keys(prisma),
      hasUser: !!prisma.user,
      databaseUrl: !!process.env.DATABASE_URL
    });
  } catch (e) {
    res.status(500).json({
      error: e.message
    });
  }
});

module.exports = app;