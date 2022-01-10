/**
 * Employee Tracker Application 
 */
const inquirer = require('inquirer');
const { 
        viewDepartments,
        addDepartment,
        deleteDepartment,
        listDepartments,
        convertDepartmentToId
      } = require('../utils/departments');
const {
        viewRoles,
        addRole,
        deleteRole,
        listRoleNames,
        convertRoleToId
      } = require('../utils/roles');
const {
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
        convertEmployeeToId,
      } = require('../utils/employees');

/**
 * promptTrackerAction() is the main driver of the application
 * @param {text} runmsg - A pre-cursor to the initial question.
 *      Typically use 'Execute' at startup and will automatically
 *      use 'Continue' for recursed calls.  See how ${runmsg} is used
 *      in the initial inquirer.prompt() confirm message.
 * @returns
 */
const promptTrackerAction = function (runmsg) {
  return inquirer.prompt([
    {
      type: 'confirm',
      name: 'confirmTakeAction',
      message: `${runmsg} Employee Tracker`,
      default: true
    },
    {
      type: 'list',
      name: 'chooseAction',
      message: 'Actions to take:',
      choices: [
        'View all departments',
        'View all roles',
        'View all employees',
        'Add a department',
        'Add a role',
        'Add an employee',
        'Update an employee\'s role',
        'Update an employee\'s manager',
        'View employees by manager',
        'View employees by department',
        'Delete a department',
        'Delete a role',
        'Delete an employee',
        'View the salary budget for a department'
      ],
      when: ({ confirmTakeAction }) => confirmTakeAction
    }
  ])
    /**
     * Execute the Action choosen from the list above.
     */
    .then(actionToTake => {
      if (actionToTake.confirmTakeAction) {
        if (actionToTake.chooseAction === 'View all departments') {
          console.log('*** View all departments ***');
          return viewDepartments();

        } else if (actionToTake.chooseAction === 'View all roles') {
          console.log('*** View all roles ***');
          return viewRoles();

        } else if (actionToTake.chooseAction === 'View all employees') {
          console.log('*** View all employees ***');
          return viewEmployees();

        } else if (actionToTake.chooseAction === 'Add a department') {
          console.log('*** Add a department ***');
          return promptAddDepartment();

        } else if (actionToTake.chooseAction === 'Add a role') {
          console.log('*** Add a role ***');
          return promptAddRole();

        } else if (actionToTake.chooseAction === 'Add an employee') {
          console.log('** Add an employee ***');
          return promptAddEmployee();

        } else if (actionToTake.chooseAction === 'Update an employee\'s role') {
          console.log('*** Update an employee\'s role ***');
          return promptUpdateEmployeeRole();

        } else if (actionToTake.chooseAction === 'Update an employee\'s manager') {
          console.log('*** Update an employee\'s manager ***');
          return promptUpdateEmployeeManager();

        } else if (actionToTake.chooseAction === 'View employees by manager') {
          console.log('*** View employees by manager ***');
          return promptViewEmployeesByManager();

        } else if (actionToTake.chooseAction === 'View employees by department') {
          console.log('*** View employees by department ***');
          return promptViewEmployeesByDepartment();

        } else if (actionToTake.chooseAction === 'Delete a department') {
          console.log('*** Delete a department ***');
          return promptDeleteDepartment();

        } else if (actionToTake.chooseAction === 'Delete a role') {
          console.log('*** Delete a role ***');
          return promptDeleteRole();

        } else if (actionToTake.chooseAction === 'Delete an employee') {
          console.log('*** Delete an employee ***');
          return promptDeleteEmployee();

        } else if (actionToTake.chooseAction === 'View the salary budget for a department') {
          console.log('*** View the salary budget for a department ***');
          return promptViewSalaryBudget();

        }
      } else {
        return null;
      }
    })
    .then(data => {
      // If no response is captured from the chosen task, the app will exit.
      if (data) {
        return data;
      } else {
        process.exit(0);
      }
    })
    // The response from the executed task is "printed" and the app
    // prompts for more.
    .then(data => {
      console.table(data);
      return promptTrackerAction('Continue');
    })
    .catch(err => {
      console.log(err);
    });
};

/**
 * promptAddDepartment() queries for department data required to
 *   add another department to the database. 
 * @returns {Object} Added department row.
 */
const promptAddDepartment = async function () {
  let deptData = await inquirer.prompt([
    {
      type: 'input',
      name: 'addDepartment',
      message: "What is the Department name? (Required)",
      validate: addDepartment => {
        if (addDepartment) {
          return true;
        } else {
          console.log("Please enter the Department name!");
          return false;
        }
      }
    }
  ])
  return await addDepartment(deptData);
};

/**
 * promptAddRole() queries for role data required to
 *   add another role to the database. 
 * @returns {Object} Added role row.
 */
const promptAddRole = async function () {
  let departmentList = await listDepartments();
  let roleData = await inquirer.prompt([
    {
      type: 'input',
      name: 'addRole',
      message: "What is the Role name? (Required)",
      validate: addRole => {
        if (addRole) {
          return true;
        } else {
          console.log("Please enter the Role name!");
          return false;
        }
      }
    },
    {
      type: 'input',
      name: 'salary',
      message: "What is the Salary amount? (Required)",
      validate: salary => {
        if (salary) {
          return true;
        } else {
          console.log("Please enter the Salary amount!");
          return false;
        }
      }
    },
    {
      type: 'list',
      name: 'chooseDepartment',
      message: 'Choose a department',
      choices: departmentList
    }
  ]);
  let departmentId = await convertDepartmentToId({convertDepartmentToId: roleData.chooseDepartment});
  Object.assign(roleData, {dept_id: departmentId[0].department_id});
  return await addRole(roleData);
};

/**
 * promptAddEmployee() queries for employee data required to
 *   add another employee to the database. 
 * @returns {Object} Added employee row.
 */
const promptAddEmployee = async function () {
  let managerList = await listManagerNames();
  let roleList = await listRoleNames();
  let empData = await inquirer.prompt([
    {
      type: 'input',
      name: 'first_name',
      message: "What is the Employee first name? (Required)",
      validate: first_name => {
        if (first_name) {
          return true;
        } else {
          console.log("Please enter the Employee first name!");
          return false;
        }
      }
    },
    {
      type: 'input',
      name: 'last_name',
      message: "What is the Employee last name? (Required)",
      validate: last_name => {
        if (last_name) {
          return true;
        } else {
          console.log("Please enter the Employee last name!");
          return false;
        }
      }
    },
    {
      type: 'list',
      name: 'chooseRole',
      message: 'Choose a role',
      choices: roleList
    },
    {
      type: 'list',
      name: 'chooseManager',
      message: 'Choose a manager',
      choices: managerList
    }
  ]);
  let employeeId = await convertEmployeeToId({convertEmployeeToId: empData.chooseManager});
  let managerId = {manager_id: employeeId[0].employee_id};
  let roleId = await convertRoleToId({convertRoleToId: empData.chooseRole});
  Object.assign(empData, managerId, roleId[0]);
  return await addEmployee(empData);
};

/**
 * promptUpdateEmployeeRole() queries for an employee picked from a
 *   list, as well as a role picked from a role list...to update
 *   the chosen employee with different role (title). 
 * @returns {Object} Updated employee row.
 */
const promptUpdateEmployeeRole = async function () {
  let roleList = await listRoleNames();
  let empData = await inquirer.prompt([
    {
      type: 'input',
      name: 'first_name',
      message: "What is the Employee first name? (Required)",
      validate: first_name => {
        if (first_name) {
          return true;
        } else {
          console.log("Please enter the Employee first name!");
          return false;
        }
      }
    },
    {
      type: 'input',
      name: 'last_name',
      message: "What is the Employee last name? (Required)",
      validate: last_name => {
        if (last_name) {
          return true;
        } else {
          console.log("Please enter the Employee last name!");
          return false;
        }
      }
    },
    {
      type: 'list',
      name: 'chooseRole',
      message: 'Choose a role',
      choices: roleList
    }
  ]);
  let roleId = await convertRoleToId({convertRoleToId: empData.chooseRole});
  Object.assign(empData, roleId[0]);
  return await updateEmployeeRole(empData);
};

/**
 * promptUpdateEmployeeManager() queries for an employee picked from a
 *   list, as well as a manager picked from a manager list...to update
 *   the chosen employee with different manager. 
 * @returns {Object} Updated employee row.
 */
const promptUpdateEmployeeManager = async function () {
  let managerList = await listManagerNames();
  let empData = await inquirer.prompt([
    {
      type: 'input',
      name: 'first_name',
      message: "What is the Employee first name? (Required)",
      validate: first_name => {
        if (first_name) {
          return true;
        } else {
          console.log("Please enter the Employee first name!");
          return false;
        }
      }
    },
    {
      type: 'input',
      name: 'last_name',
      message: "What is the Employee last name? (Required)",
      validate: last_name => {
        if (last_name) {
          return true;
        } else {
          console.log("Please enter the Employee last name!");
          return false;
        }
      }
    },
    {
      type: 'list',
      name: 'chooseManager',
      message: 'Choose a manager',
      choices: managerList
    }
  ]);
  let managerId = await convertEmployeeToId({convertEmployeeToId: empData.chooseManager});
  Object.assign(empData, {manager_id: managerId[0].employee_id});
  return await updateEmployeeManager(empData);
};

/**
 * promptViewEmployeesByManager() queries for a manager picked from a
 *   list, and returns a listing of all employees under that chosen manager. 
 * @returns {Object} Employees working for the chosen manager.
 */
const promptViewEmployeesByManager = async function () {
  let managerList = await listManagerNames();
  let managerName = await inquirer.prompt([
    {
      type: 'list',
      name: 'chooseManager',
      message: 'Choose a manager',
      choices: managerList
    }
  ])
  let employeeId = await convertEmployeeToId({convertEmployeeToId: managerName.chooseManager});
  let managerId = {manager_id: employeeId[0].employee_id};
  return await viewEmployeesByManager(managerId);
};

/**
 * promptViewEmployeesByDepartment() queries for a department picked from a
 *   list, and returns a listing of all employees belonging to that department. 
 * @returns {Object} Employees belonging to the chosen department.
 */
const promptViewEmployeesByDepartment = async function () {
  let departmentList = await listDepartments();
  let department = await inquirer.prompt([
    {
      type: 'list',
      name: 'chooseDepartment',
      message: 'Choose a department',
      choices: departmentList
    }
  ])
  let department_id = await convertDepartmentToId({convertDepartmentToId: department.chooseDepartment});
  return await viewEmployeesByDepartment(department_id[0]);
};

/**
 * promptDeleteDepartment() queries for a department picked from a
 *   list, and removes that department from the department table.
 * @returns {Object} Results of the delete process.
 */
const promptDeleteDepartment = async function () {
  let departmentList = await listDepartments();
  let department = await inquirer.prompt([
    {
      type: 'list',
      name: 'chooseDepartment',
      message: 'Choose a department',
      choices: departmentList
    }
  ])
  let departmentId = await convertDepartmentToId({convertDepartmentToId: department.chooseDepartment});
  return await deleteDepartment(departmentId[0]);
};

/**
 * promptDeleteRole() queries for a role (title) picked from a
 *   list, and removes that role from the role table.
 * @returns {Object} Results of the delete process.
 */
const promptDeleteRole = async function () {
  let roleList = await listRoleNames();
  let role = await inquirer.prompt([
    {
      type: 'list',
      name: 'chooseRole',
      message: 'Choose a role',
      choices: roleList
    }
  ])
  let roleId = await convertRoleToId({convertRoleToId: role.chooseRole});
  return await deleteRole(roleId[0]);
};

/**
 * promptDeleteEmployee() queries for an employee picked from a
 *   list, and removes that employee from the employee table.
 * @returns {Object} Results of the delete process.
 */
const promptDeleteEmployee = async function () {
  let employeeList = await listEmployeeNames();
  let employee = await inquirer.prompt([
    {
      type: 'list',
      name: 'chooseEmployee',
      message: 'Choose an employee',
      choices: employeeList
    }
  ])
  let employeeId = await convertEmployeeToId({convertEmployeeToId: employee.chooseEmployee});
  return await deleteEmployee(employeeId[0]);
};

/**
 * promptViewSalaryBudget() queries for a department picked from a
 *   list, and summarizes the total salary budget for that department
 * @returns {Object} Summary value of total salary budget for the chosen department.
 */
const promptViewSalaryBudget = async function () {
  let departmentList = await listDepartments();
  let department = await inquirer.prompt([
    {
      type: 'list',
      name: 'chooseDepartment',
      message: 'Choose a department',
      choices: departmentList
    }
  ])
  let department_id = await convertDepartmentToId({convertDepartmentToId: department.chooseDepartment});
  return await viewSalaryBudget(department_id[0]);
};

module.exports = { promptTrackerAction };