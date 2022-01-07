const express = require('express');
const router = express.Router();
const db = require('../../db/connection');
const inputCheck = require('../../utils/inputCheck');

// Get all employees and their assigned role and manager
router.get('/employees', (req, res) => {
  const sql = `SELECT 
                  a.*,
                  CONCAT(b.first_name, " ", b.last_name) AS "manager_name",
                  role.title
                FROM employee a
                LEFT JOIN employee b 
                ON a.manager_id = b.id
                LEFT JOIN role
                ON a.role_id = role.id`;

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

// Get the total salary budget of a single department
router.get('/salary_budget_by_department/:id', (req, res) => {
  const params = [req.params.id];
  const sql = `
  SELECT department.name as department, SUM(salary) as salary_budget FROM 
  (
    SELECT
      role.salary as salary,
      role.dept_id as dept_id
    FROM employee a
      LEFT JOIN employee b 
        ON a.manager_id = b.id
      LEFT JOIN role
        ON a.role_id = role.id
  ) selEmp 
  RIGHT JOIN department
    ON selEmp.dept_id = department.id 
  WHERE department.id = ?;`;

  db.query(sql, params, (err, rows) => {
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

// Get all employees who are a member of a single department
router.get('/employees_by_department/:id', (req, res) => {
  const params = [req.params.id];
  const sql = `
  SELECT department.name as department, selEmp.* FROM 
  (
    SELECT
      role.dept_id as dept_id,
      role.title as title,
      a.first_name as first_name,
      a.last_name as last_name,
      a.manager_id as manager_id,
      CONCAT(b.first_name, " ", b.last_name) AS "manager_name",
      a.role_id as role_id
    FROM employee a
      LEFT JOIN employee b 
        ON a.manager_id = b.id
      LEFT JOIN role
        ON a.role_id = role.id
  ) selEmp 
  RIGHT JOIN department
    ON selEmp.dept_id = department.id 
  WHERE department.id = ?;`;

  db.query(sql, params, (err, rows) => {
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

// Get all employees under a single manager
router.get('/employees_by_manager/:id', (req, res) => {
  const params = [req.params.id];
  const sql = `SELECT 
                  a.*,
                  CONCAT(b.first_name, " ", b.last_name) AS "manager_name",
                  role.title
                FROM employee a
                LEFT JOIN employee b 
                ON a.manager_id = b.id
                LEFT JOIN role
                ON a.role_id = role.id
                WHERE a.manager_id = ?`;

  db.query(sql, params, (err, rows) => {
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

// Get single employee with assigned role and manager
router.get('/employee/:id', (req, res) => {
  const sql = `SELECT 
                  a.*,
                  CONCAT(b.first_name, " ", b.last_name) AS "manager_name",
                  role.title
                FROM employee a
                LEFT JOIN employee b 
                ON a.manager_id = b.id
                LEFT JOIN role
                ON a.role_id = role.id
                WHERE a.id = ?`;
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

// Create an employee
router.post('/employee', ({ body }, res) => {
  const errors = inputCheck(
    body,
    'first_name',
    'last_name',
    'role_id',
    'manager_id'
  );
  if (errors) {
    res.status(400).json({ error: errors });
    return;
  }

  const sql = `INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?,?,?,?)`;
  const params = [
    body.first_name,
    body.last_name,
    body.role_id,
    body.manager_id
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

// Update an employees's role
router.put('/employee/:id', (req, res) => {
  const errors = inputCheck(req.body, 'role_id');
  if (errors) {
    res.status(400).json({ error: errors });
    return;
  }

  const sql = `UPDATE employee SET role_id = ? 
               WHERE id = ?`;
  const params = [req.body.role_id, req.params.id];

  db.query(sql, params, (err, result) => {
    if (err) {
      res.status(400).json({ error: err.message });
    } else if (!result.affectedRows) {
      res.json({
        message: 'Employee not found'
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

// Update an employees's manager
router.put('/employee_manager/:id', (req, res) => {
  const errors = inputCheck(req.body, 'manager_id');
  if (errors) {
    res.status(400).json({ error: errors });
    return;
  }

  const sql = `UPDATE employee SET manager_id = ? 
               WHERE id = ?`;
  const params = [req.body.manager_id, req.params.id];

  db.query(sql, params, (err, result) => {
    if (err) {
      res.status(400).json({ error: err.message });
    } else if (!result.affectedRows) {
      res.json({
        message: 'Employee not found'
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

// Delete an employee
router.delete('/employee/:id', (req, res) => {
  const sql = `DELETE FROM employee WHERE id = ?`;

  db.query(sql, req.params.id, (err, result) => {
    if (err) {
      res.status(400).json({ error: res.message });
    } else if (!result.affectedRows) {
      res.json({
        message: 'Employee not found'
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
