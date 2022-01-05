const express = require('express');
const router = express.Router();
const db = require('../../db/connection');
const inputCheck = require('../../utils/inputCheck');

// Get all roles and their department affiliation
router.get('/roles', (req, res) => {
  const sql = `SELECT role.*, dept.name 
                AS dept_name 
                FROM role 
                LEFT JOIN dept 
                ON role.dept_id = dept.id`;

  db.query(sql, (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({
      message: 'success',
      data: rows
    });
  });
});

// Get single role with department affiliation
router.get('/role/:id', (req, res) => {
  const sql = `SELECT role.*, dept.name 
               AS dept_name 
               FROM role 
               LEFT JOIN dept 
               ON role.dept_id = dept.id 
               WHERE role.id = ?`;
  const params = [req.params.id];

  db.query(sql, params, (err, row) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json({
      message: 'success',
      data: row
    });
  });
});

// Create a role
router.post('/role', ({ body }, res) => {
  const errors = inputCheck(
    body,
    'title',
    'salary',
    'dept_id'
  );
  if (errors) {
    res.status(400).json({ error: errors });
    return;
  }

  const sql = `INSERT INTO role (title, salary, dept_id) VALUES (?,?,?)`;
  const params = [
    body.title,
    body.salary,
    body.dept_id
  ];

  db.query(sql, params, (err, result) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json({
      message: 'success',
      data: body
    });
  });
});

// Update a role's department
router.put('/role/:id', (req, res) => {
  const errors = inputCheck(req.body, 'dept_id');
  if (errors) {
    res.status(400).json({ error: errors });
    return;
  }

  const sql = `UPDATE role SET dept_id = ? 
               WHERE id = ?`;
  const params = [req.body.dept_id, req.params.id];

  db.query(sql, params, (err, result) => {
    if (err) {
      res.status(400).json({ error: err.message });
    } else if (!result.affectedRows) {
      res.json({
        message: 'Role not found'
      });
    } else {
      res.json({
        message: 'success',
        data: req.body,
        changes: result.affectedRows
      });
    }
  });
});

// Delete a role
router.delete('/role/:id', (req, res) => {
  const sql = `DELETE FROM role WHERE id = ?`;

  db.query(sql, req.params.id, (err, result) => {
    if (err) {
      res.status(400).json({ error: res.message });
    } else if (!result.affectedRows) {
      res.json({
        message: 'Role not found'
      });
    } else {
      res.json({
        message: 'deleted',
        changes: result.affectedRows,
        id: req.params.id
      });
    }
  });
});

module.exports = router;
