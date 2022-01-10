const db = require('../db/connection');
const inputCheck = require('../utils/inputCheck');
const util = require('util');
const query = util.promisify(db.query).bind(db);

/**
 * viewRoles() queries the role table and joins with department table
 *   to provide the department name in the results.  
 * @returns {Object} The query result.
 */
const viewRoles = async function() {
  const sql = `SELECT role.*, department.name 
  AS dept_name 
  FROM role 
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
 * convertRoleToId() accepts a role (title) and queries for the role id
 *   representing that role.
 * @param {Object} input - contains the role (title) element with it's value
 *   to facilitate the parameterized query. 
 * @returns - The role id representing the role (title) value. 
 */
const convertRoleToId = async function(input) {
  const errors = inputCheck(
    input,
    'convertRoleToId',
  );

  columns = {title: input.convertRoleToId};

  const sql = `SELECT id AS "role_id" FROM role
                WHERE title = '${columns.title}'`;

  let rows;
  try {
    rows = await query(sql);
  } catch(err) {
    console.log(err);
  }
  return rows;
}

/**
 * addRole() accepts a role (title), salary, and department id and
 *   and persists the role data in the role table.
 * @param {Object} input - contains the role (title), salary, and
 *   and associated department id. 
 * @returns - The new role persisted in the role table. 
 */
const addRole = async function(input) {
  const errors = inputCheck(
    input,
    'addRole',
    'salary',
    'dept_id'
  );

  columns = {title: input.addRole, salary: input.salary, dept_id: input.dept_id};

  const sql = `INSERT INTO role (title, salary, dept_id) VALUES (?, ?, ?)`;
  const params = [
     columns.title,
     columns.salary,
     columns.dept_id 
  ];
  const sqlSelResults = `SELECT * FROM role WHERE id = (SELECT MAX(id) FROM role)`;

  let results;
  let retResults;
  try {
    results = await query(sql, params);
    retResults = await query(sqlSelResults);
  } catch (err) {
    console.log(err);
  }
  return retResults;
}

/**
 * deleteRole() deletes the role identified by the role id value
 *   in the input parameter from the role table.
 * @param {Object} input - contains the role_id value to be deleted.
 * @returns - deletion results.
 */
const deleteRole = async function(input) {
  const errors = inputCheck(
    input,
    'role_id'
  );

  const sql = `DELETE FROM role WHERE id = ${input.role_id}`;

  let results;
  try {
    results = await query(sql);
  } catch (err) {
    console.log(err);
  }
  return results;
}

/**
 * listRoleNames() queries the role table for all roles.
 * @returns - All role titles in the role table.
 */
const listRoleNames = async function() {
  const sql = `SELECT title as "name" FROM role ORDER BY name`;
  let rows;
  try {
    rows = await query(sql);
  } catch(err) {
    console.log(err);
  }
  return rows;
}


module.exports = {
                    viewRoles,
                    addRole,
                    deleteRole,
                    listRoleNames,
                    convertRoleToId
                  };