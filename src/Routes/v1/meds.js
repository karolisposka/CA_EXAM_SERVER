const express = require('express');
const mysql = require('mysql2/promise');
const validation = require('../../Middleware/Validation/Validation');
const {
  addMedicationSchema,
  searchMedicationSchema,
} = require('../../Middleware/Validation/ValidationSchemas/medicationsValidation');
const { mysqlConfig } = require('../../config');
const router = express.Router();
const checkIfLoggedIn = require('../../Middleware/Auth/Authentification');

router.get('/get', checkIfLoggedIn, async (req, res) => {
  try {
    console.log(req.user);
    const con = await mysql.createConnection(mysqlConfig);
    const [data] = await con.execute(
      `SELECT  id, title, time, description FROM users_medications WHERE user_id=${mysql.escape(req.user)} LIMIT 6`,
    );
    await con.end();
    if (data.length === 0) {
      return res.send({ err: 'No data' });
    }
    return res.send(data);
  } catch (err) {
    console.log(err);
    return res.status(500).send({ err: 'something wrong with the server. Please try again later' });
  }
});

router.post('/add', validation(addMedicationSchema), checkIfLoggedIn, async (req, res) => {
  try {
    const con = await mysql.createConnection(mysqlConfig);
    console.log(req.user);
    const [data] = await con.execute(`INSERT INTO users_medications (user_id, title, description, dosage, units, time) 
      VALUES(${mysql.escape(req.user)}, ${mysql.escape(req.body.title)}, ${mysql.escape(
      req.body.description,
    )}, ${mysql.escape(req.body.dosage)}, ${mysql.escape(req.body.units)}, ${mysql.escape(req.body.time)})`);
    await con.end();
    console.log(data);
    if (!data.insertId) {
      return res.status(500).send({ err: 'something wrong with the server. Please try again later' });
    }
    return res.send({ data, msg: 'data successfully added' });
  } catch (err) {
    console.log(err);
    return res.status(500).send({
      err: 'something wrong with the server. Please try again later',
    });
  }
});

router.delete('/delete/:id', checkIfLoggedIn, async (req, res) => {
  try {
    const con = await mysql.createConnection(mysqlConfig);
    const [data] = await con.execute(
      `DELETE FROM users_medications WHERE id=${mysql.escape(req.params.id)} and user_id=${mysql.escape(req.user)}`,
    );
    await con.end();
    if (!data.affectedRows) {
      return res.status(500).send({ err: 'something wrong with the server. Please try again later' });
    }
    return res.send({ msg: 'record successfully deleted' });
  } catch (err) {
    console.log(err);
    return res.status(500).send({ msg: 'Something wrong with the server. Please try again later' });
  }
});

router.post('/search', checkIfLoggedIn, validation(searchMedicationSchema), async (req, res) => {
  try {
    const con = await mysql.createConnection(mysqlConfig);
    const [data] = await con.execute(
      `SELECT * FROM users_medications WHERE user_id=${req.user} AND title LIKE ${mysql.escape(
        '%' + req.body.input + '%',
      )}`,
    );
    await con.end();
    if (data.length === 0) {
      return res.send({ err: 'No data found' });
    }
    return res.send(data);
  } catch (err) {
    console.log(err);
    res.status(500).send({ err: 'Something wrong with the server.Please try again later' });
  }
});

module.exports = router;
