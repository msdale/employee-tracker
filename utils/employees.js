const db = require('../db/connection');
const inputCheck = require('../utils/inputCheck');
const util = require('util');
const query = util.promisify(db.query).bind(db);

/**
 * viewEmployees() queries the employee table and joins with role
 *   and department tables to provide title, salary and department
 *   in the results.  
 * @returns {Object} The query result.
 */
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

/**
 * listEmployeeNames() queries the employee table for all names.
 * @returns - All employee names (concatenation of first and last
 *    names) in the employee table.
 */
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

/**
 * convertEmployeeToId() accepts an employee name and queries for the
 *   employee id representing that employee.
 * @param {Object} input - contains the name element with it's value
 *   to facilitate the parameterized query. 
 * @returns - The employee id representing the employee name value. 
 */
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

/**
 * listManagerNames() queries the employee table for all names of managers.
 * @returns - All manager names (concatenation of first and last
 *    names) in the employee table.
 */
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

/**
 * addEmployee() accepts an employee first name, last name,
 *   role id and manager id, and persists the employee data
 *   in the employee table.
 * @param {Object} input - contains the employee first_name,
 *   last_name, role_id and manager id.
 * @returns - The new employee persisted in the employee table. 
 */
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

/**
 * updateEmployeeRole() accepts a role id, first name, and last name as input
 *   to facilitate a role id update of the named employee.
 * @param {Object} input - contains the role_id, first_name, and last_name
 *   elements to facilitate the update.
 * @returns The updated employee.
 */
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

/**
 * deleteEmployee() deletes the employee identified by the employee id value
 *   in the input parameter.
 * @param {Object} input - contains the employee_id value to be deleted.
 * @returns - deletion results.
 */
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

/**
 * updateEmployeeManager() accepts a manager id, first name, and last name as input
 *   to facilitate a manager id update of the named employee.
 * @param {Object} input - contains the manager_id, first_name, and last_name
 *   elements to facilitate the update.
 * @returns The updated employee.
 */
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

/**
 * viewEmployeesByManager() accepts a manager_id value to list all the employees
 *   belonging to that manager.
 * @param {Object} input - Contains the manager_id element. 
 * @returns All the employees belonging to the identified manager. 
 */
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

/**
 * viewEmployeesByDepartment() accepts a department id value to list all the employees
 *   belonging to that department.
 * @param {Object} input - Contains the department_id element. 
 * @returns All the employees belonging to the identified department. 
 */
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

/**
 * viewSalaryBudget() accepts the department id to summarize the total
 *   salary budget associated with the identified department.
 * @param {Object} input - Contains the department_id value. 
 * @returns - A summarized salary amount associated with the identified
 *   department.
 */
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