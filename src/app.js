const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

const testRoute = require('./routes/test.route');
const categoryRoute = require('./routes/category.route');
const productRoute = require('./routes/product.route');
const orderRoute = require('./routes/order.route');

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

module.exports = app;