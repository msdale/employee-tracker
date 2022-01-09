const db = require('../db/connection');
const inputCheck = require('../utils/inputCheck');
const util = require('util');
const query = util.promisify(db.query).bind(db);

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