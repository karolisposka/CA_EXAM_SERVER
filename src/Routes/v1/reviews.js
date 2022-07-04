const express = require('express');
const mysql = require('mysql2/promise');
const checkIfLoggedIn = require('../../Middleware/Auth/Authentification');
const validation = require('../../Middleware/Validation/Validation');
const { reviewsValidationSchema } = require('../../Middleware/Validation/ValidationSchemas/reviewsValidation');
const { mysqlConfig } = require('../../config');
const router = express.Router();

router.get('/ratings', async (req, res) => {
  try {
    const con = await mysql.createConnection(mysqlConfig);
    const [data] = await con.execute(
      'SELECT users.username, ratings.rating, ratings.comment, ratings.created_at FROM ratings LEFT JOIN users ON users.id = ratings.user_id',
    );
    await con.end();
    if (data.length === 0) {
      return res.status(500).send({ err: 'No data found' });
    }
    return res.send(data);
  } catch (err) {
    console.log(err);
    res.send({ err: 'something wrong with the server.Please try again later' });
  }
});

router.post('/rate', checkIfLoggedIn, validation(reviewsValidationSchema), async (req, res) => {
  try {
    const con = await mysql.createConnection(mysqlConfig);
    const [data] = await con.execute(`INSERT INTO ratings (user_id, comment, rating)
    VALUES(${mysql.escape(req.user)}, ${mysql.escape(req.body.text)}, ${mysql.escape(req.body.rating)})`);
    await con.end();
    if (!data.insertId) {
      res.status(500).send({ err: 'something wrong with the server.Please try again later' });
    }
    return res.send({ msg: 'comment successfully posted' });
  } catch (err) {
    console.log(err);
    return res.status(500).send({ err: 'Something wrong with the server. Please try again later' });
  }
});

module.exports = router;
