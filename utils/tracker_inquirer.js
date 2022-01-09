const inquirer = require('inquirer');
const { restoreDefaultPrompts } = require('inquirer');
const { viewDepartments } = require('../utils/viewDepartments');

const promptTrackerAction = (runmsg) => {
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
        'Update an employee role',
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
          console.log('process -> View all departments');
          console.table(viewDepartments());
        } else if (actionToTake.chooseAction === 'View all roles') {
          console.log('process -> View all roles');
        } else if (actionToTake.chooseAction === 'View all employees') {
          console.log('process -> View all employees');
        } else if (actionToTake.chooseAction === 'Add a department') {
          console.log('process -> Add a department');
        } else if (actionToTake.chooseAction === 'Add a role') {
          console.log('process -> Add a role');
        } else if (actionToTake.chooseAction === 'Add an employee') {
          console.log('process -> Add an employee');
        } else if (actionToTake.chooseAction === 'Update an employee\'s role') {
          console.log('process -> Update an employee role');
        } else if (actionToTake.chooseAction === 'Update an employee\'s manager') {
          console.log('process -> Update an employee\'s manager');
        } else if (actionToTake.chooseAction === 'View employees by manager') {
          console.log('process -> View employees by manager');
        } else if (actionToTake.chooseAction === 'View employees by department') {
          console.log('process -> View employees by department');
        } else if (actionToTake.chooseAction === 'Delete a department') {
          console.log('process -> Delete a department');
        } else if (actionToTake.chooseAction === 'Delete a role') {
          console.log('process -> Delete a role');
        } else if (actionToTake.chooseAction === 'Delete an employee') {
          console.log('process -> Delete an employee');
        } else if (actionToTake.chooseAction === 'View the salary budget for a department') {
          console.log('process -> View the salary budget for a department');
        }
      }
    })
};

module.exports = { promptTrackerAction };