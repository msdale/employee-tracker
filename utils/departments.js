const db = require('../db/connection');
const inputCheck = require('../utils/inputCheck');
const util = require('util');
const query = util.promisify(db.query).bind(db);

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