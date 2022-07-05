const express = require('express');
const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const validation = require('../../Middleware/Validation/Validation');
const { loginSchema, registerSchema } = require('../../Middleware/Validation/ValidationSchemas/userValidation');
const { mysqlConfig, jwtSecret } = require('../../config');
const router = express.Router();

router.post('/login', validation(loginSchema), async (req, res) => {
  try {
    const con = await mysql.createConnection(mysqlConfig);
    const [data] = await con.execute(
      `SELECT id, password FROM users WHERE email=${mysql.escape(req.body.email)} LIMIT 1`,
    );
    await con.end();
    if (data.length === 0) {
      return res.status(400).send({ err: 'user does not exists' });
    }
    const checkHash = bcrypt.compareSync(req.body.password, data[0].password);
    if (!checkHash) {
      return res.status(400).send({ err: 'wrong password passed' });
    }
    const token = jwt.sign(data[0].id, jwtSecret);
    return res.send({ token, msg: 'logged in successfully' });
  } catch (err) {
    res.status(500).send({ err: 'something wrong with the server. Please try again later' });
  }
});

router.post('/register', validation(registerSchema), async (req, res) => {
  try {
    const con = await mysql.createConnection(mysqlConfig);
    const hashedPassword = bcrypt.hashSync(req.body.password, 10);
    const [data] = await con.execute(`INSERT INTO users (email, password, username)
    VALUES(${mysql.escape(req.body.email)}, ${mysql.escape(hashedPassword)}, ${mysql.escape(req.body.username)})
    `);
    await con.end();
    if (data.affectedRows !== 1) {
      return res.status(500).send({
        err: 'something wrong with the server, please try again later',
      });
    }
    return res.send({ err: 'registration successfully completed' });
  } catch (err) {
    console.log(err);
    return res.status(500).send({ err: 'something wrong with the server. Please try again later' });
  }
});

module.exports = router;
