const express = require('express');
const cors = require('cors');
const { port } = require('./config');
const app = express();
app.use(cors());
app.use(express.json());

const userRoutes = require('./Routes/v1/user');
const medsRoute = require('./Routes/v1/meds');
const reviewsRoute = require('./Routes/v1/reviews');

app.get('/', (req, res) => {
  return res.send({ msg: 'server is running' });
});

app.use('/v1/meds/', medsRoute);
app.use('/v1/user/', userRoutes);
app.use('/v1/reviews', reviewsRoute);

app.get('*', (req, res) => {
  res.send({ msg: 'everything is ok' });
});

app.listen(port, () => {
  console.log(`server is running on ${port}`);
});
