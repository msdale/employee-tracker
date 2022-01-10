const db = require('../db/connection');
const inputCheck = require('../utils/inputCheck');
const util = require('util');
const query = util.promisify(db.query).bind(db);

/**
 * viewDepartments() queries the departments table to
 *   provide the department name in the results.  
 * @returns {Object} The query result.
 */
const viewDepartments = async function() {
  const sql = `SELECT * from department`; 
  let rows;
  try {
    rows = await query(sql);
  } catch(err) {
    console.log(err);
  }
  return rows;
}

/**
 * listDepartments() queries the department table for all department names.
 * @returns - All department names in the department table.
 */
const listDepartments = async function() {
  const sql = `SELECT name FROM department ORDER BY name`; 
  let rows;
  try {
    rows = await query(sql);
  } catch(err) {
    console.log(err);
  }
  return rows;
}

/**
 * addDepartment() accepts a department name
 *   and persists the department data in the department table.
 * @param {Object} input - contains the department name.
 * @returns - The new department persisted in the department table. 
 */
const addDepartment = async function(input) {
  const errors = inputCheck(
    input,
    'addDepartment'
  );

  columns = {name: input.addDepartment};

  const sql = `INSERT INTO department (name) VALUES ('${columns.name}')`;
  const sqlSelResults = `SELECT * FROM department WHERE id = (SELECT MAX(id) FROM department)`;

  let results;
  let retResults;
  try {
    results = await query(sql);
    retResults = await query(sqlSelResults);
  } catch (err) {
    console.log(err);
  }

  return retResults;
}

/**
 * deleteDepartment() deletes the department identified by the
 *   department id element in the input parameter object.
 * @param {Object} input - contains the department_id value
 *   to be deleted.
 * @returns - deletion results.
 */
const deleteDepartment = async function(input) {
  const errors = inputCheck(
    input,
    'department_id'
  );

  const sql = `DELETE FROM department WHERE id = ${input.department_id}`;

  let results;
  try {
    results = await query(sql);
  } catch (err) {
    console.log(err);
  }
  return results;
}

/**
 * convertDepartmentToId() accepts a department name and queries for
 *   the role id representing that department name.
 * @param {Object} input - contains the department element with it's
 *   name value to facilitate the query. 
 * @returns - The department id representing the department name. 
 */
const convertDepartmentToId = async function(input) {
  const errors = inputCheck(
    input,
    'convertDepartmentToId',
  );

  columns = {department: input.convertDepartmentToId};

  const sql = `SELECT id AS "department_id" FROM department
                WHERE name = '${columns.department}'`;

  let rows;
  try {
    rows = await query(sql);
  } catch(err) {
    console.log(err);
  }
  return rows;
}

module.exports = {
                    viewDepartments,
                    addDepartment,
                    deleteDepartment,
                    listDepartments,
                    convertDepartmentToId
                  };