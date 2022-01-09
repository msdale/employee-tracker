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
      if (data) {
        return data;
      } else {
        process.exit(0);
      }
    })
    .then(data => {
      console.table(data);
      return promptTrackerAction('Continue');
    })
    .catch(err => {
      console.log(err);
    });
};

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
  console.log(departmentId[0]);
  return await deleteDepartment(departmentId[0]);
};

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
  console.log(JSON.stringify(empData));
  return await updateEmployeeRole(empData);
};

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

const promptListEmployees = async function (data) {
  let passThruData = {};
  if (data) passThruData = data;

  let employeeList = await listEmployeeNames();
  let employeeName = await inquirer.prompt([
    {
      type: 'list',
      name: 'chooseEmployee',
      message: 'Choose an employee',
      choices: employeeList
    }
  ]);
  Object.assign(passThruData, employeeName);
  let employeeId = await convertEmployeeToId({convertEmployeeToId: employeeName.chooseEmployee});
  Object.assign(passThruData, employeeId[0]);
  return passThruData;
}

const promptListRoles = async function (data) {
  let passThruData = {};
  if (data) passThruData = data;

  let roleList = await listRoleNames();
  let roleName = await inquirer.prompt([
    {
      type: 'list',
      name: 'chooseRole',
      message: 'Choose a role',
      choices: roleList
    }
  ]);
  Object.assign(passThruData, roleName);
  let roleId = await convertRoleToId({convertRoleToId: roleName.chooseRole});
  Object.assign(passThruData, roleId[0]);
  return passThruData;
}

const promptListDepartments = async function (data) {
  let passThruData = {};
  if (data) passThruData = data;

  let departmentList = await listDepartments();
  let deptList = departmentList.map(item => {
    return item.department;
  })

  let departmentName = await inquirer.prompt([
    {
      type: 'list',
      name: 'chooseDepartment',
      message: 'Choose a department',
      choices: departmentList
    }
  ]);
  Object.assign(passThruData, departmentName);
  let departmentId = await convertDepartmentToId({convertDepartmentToId: departmentName.chooseDepartment});
  Object.assign(passThruData, departmentId[0]);
  return passThruData;
}

const promptListManagers = async function (data) {
  let passThruData = {};
  if (data) passThruData = data;

  let managerList = await listManagerNames();
  let managerName = await inquirer.prompt([
    {
      type: 'list',
      name: 'chooseManager',
      message: 'Choose a manager',
      choices: managerList
    }
  ]);
  Object.assign(passThruData, managerName);
  let employeeId = await convertEmployeeToId({convertEmployeeToId: managerName.chooseManager});
  let managerId = {manager_id: employeeId[0].employee_id};
  Object.assign(passThruData, managerId);
  return passThruData;
}

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
  console.log(employeeId);
  return await deleteEmployee(employeeId[0]);
};

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