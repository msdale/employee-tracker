const db = require('../db/connection');
const inputCheck = require('../utils/inputCheck');
const util = require('util');
const query = util.promisify(db.query).bind(db);

const viewEmployees = async function() {
  const sql = `SELECT 
                  a.*,
                  CONCAT(b.first_name, " ", b.last_name) AS "manager_name",
                  role.title,
                  role.salary,
                  department.name as "department"
                FROM employee a
                LEFT JOIN employee b 
                ON a.manager_id = b.id
                LEFT JOIN role
                ON a.role_id = role.id
                LEFT JOIN department
                ON role.dept_id = department.id`;
  let rows;
  try {
    rows = await query(sql);
  } catch(err) {
    console.log(err);
  }
  return rows;
}

const listEmployeeNames = async function() {
  const sql = `SELECT
                CONCAT(first_name, " ", last_name) AS "name"
              FROM employee 
              ORDER BY name`;
  let rows;
  try {
    rows = await query(sql);
  } catch(err) {
    console.log(err);
  }
  return rows;
}

const convertEmployeeToId = async function(input) {
  const errors = inputCheck(
    input,
    'convertEmployeeToId',
  );

  columns = {name: input.convertEmployeeToId};

  const sql = `SELECT id as "employee_id" FROM employee
                WHERE CONCAT(first_name, " ", last_name) = '${columns.name}'`;

  let rows;
  try {
    rows = await query(sql);
  } catch(err) {
    console.log(err);
  }
  return rows;
}

const listManagerNames = async function() {
  const sql = `SELECT
                CONCAT(first_name, " ", last_name) AS "name"
                FROM employee
                LEFT JOIN role
                  ON employee.role_id = role.id
                WHERE role.title like '% Manager'
                ORDER BY name`;
  let rows;
  try {
    rows = await query(sql);
  } catch(err) {
    console.log(err);
  }
  return rows;
}

const addEmployee = async function(input) {
  const errors = inputCheck(
    input,
    'first_name',
    'last_name',
    'role_id',
    'manager_id'
  );

  columns = {first_name: input.first_name, last_name: input.last_name, role_id: input.role_id, manager_id: input.manager_id};

  const sql = `INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)`;
  const params = [
     columns.first_name,
     columns.last_name,
     columns.role_id,
     columns.manager_id 
  ];
  const sqlSelResults = `SELECT * FROM employee WHERE id = (SELECT MAX(id) FROM employee)`;

  let results;
  try {
    results = await query(sql, params);
    retResults = await query(sqlSelResults);
  } catch (err) {
    console.log(err);
  }

  return retResults;
}

const updateEmployeeRole = async function(input) {
  const errors = inputCheck(
    input,
    'role_id',
    'first_name',
    'last_name'
  );

  const sql = `UPDATE employee
               SET role_id = ${input.role_id}
               WHERE first_name = '${input.first_name}'
                AND last_name = '${input.last_name}'`;

  const sqlSel = `SELECT * 
                  FROM employee
                  WHERE first_name = '${input.first_name}'
                    AND last_name = '${input.last_name}'
                    AND role_id = ${input.role_id}`;

  let results;
  let sqlSelResults;

  try {
    results = await query(sql);
    sqlSelResults = await query(sqlSel);
  } catch (err) {
    console.log(err);
  }

  return sqlSelResults;
}

const deleteEmployee = async function(input) {
  const errors = inputCheck(
    input,
    'employee_id'
  );

  const sql = `DELETE FROM employee WHERE id = ${input.employee_id}`;

  let results;
  try {
    results = await query(sql);
  } catch (err) {
    console.log(err);
  }
  return results;
}

const updateEmployeeManager = async function(input) {
  const errors = inputCheck(
    input,
    'first_name',
    'last_name',
    'manager_id'
  );

  const sql = `UPDATE employee
               SET manager_id = ${input.manager_id}
               WHERE first_name = '${input.first_name}'
                 AND last_name = '${input.last_name}'`;

  const sqlSel = `SELECT * 
                  FROM employee
                  WHERE first_name = '${input.first_name}'
                    AND last_name = '${input.last_name}'
                    AND manager_id = ${input.manager_id}`;

  let results;
  let sqlResults;
  try {
    results = await query(sql);
    sqlResults = await query(sqlSel);
  } catch (err) {
    console.log(err);
  }
  return sqlResults;
}

const viewEmployeesByManager = async function(input) {
  const errors = inputCheck(
    input,
    'manager_id'
  );

  const sql = `SELECT 
                  a.*,
                  CONCAT(b.first_name, " ", b.last_name) AS "manager_name",
                  role.title,
                  department.name as "department"
                FROM employee a
                LEFT JOIN employee b 
                ON a.manager_id = b.id
                LEFT JOIN role
                ON a.role_id = role.id
                LEFT JOIN department
                ON role.dept_id = department.id
                WHERE a.manager_id = ${input.manager_id}`;

  let rows;
  try {
    rows = await query(sql);
  } catch(err) {
    console.log(err);
  }
  return rows;
}

const viewEmployeesByDepartment = async function(input) {
  const errors = inputCheck(
    input,
    'department_id'
  );

  const sql = `SELECT z.* FROM 
                (SELECT 
                  a.*,
                  CONCAT(b.first_name, " ", b.last_name) AS "manager_name",
                  role.title AS "title",
                  department.name AS "department",
                  department.id As "dept_id"
                FROM employee a
                LEFT JOIN employee b 
                ON a.manager_id = b.id
                LEFT JOIN role
                ON a.role_id = role.id
                LEFT JOIN department
                ON role.dept_id = department.id) z
                WHERE z.dept_id = ${input.department_id}`;

  let rows;
  try {
    rows = await query(sql);
  } catch(err) {
    console.log(err);
  }
  return rows;
}

const viewSalaryBudget = async function(input) {
  const errors = inputCheck(
    input,
    'department_id'
  );

  const sql = `SELECT department as "Department", sum(salary) as "Salary Budget" FROM 
                (SELECT 
                  department.name AS "department",
                  role.salary as "salary",
                  department.id as "dept_id"
                FROM employee a
                LEFT JOIN role
                ON a.role_id = role.id
                LEFT JOIN department
                ON role.dept_id = department.id) z
                WHERE z.dept_id = ${input.department_id}
                GROUP BY department`;

  let rows;
  try {
    rows = await query(sql);
  } catch(err) {
    console.log(err);
  }
  return rows;
}

module.exports = 
{
  viewEmployees,
  addEmployee,
  updateEmployeeRole,
  updateEmployeeManager,
  viewEmployeesByManager,
  viewEmployeesByDepartment,
  deleteEmployee,
  viewSalaryBudget,
  listEmployeeNames,
  listManagerNames,
  convertEmployeeToId
};