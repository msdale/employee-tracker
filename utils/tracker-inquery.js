const inquirer = require('inquirer');
const { restoreDefaultPrompts } = require('inquirer');

const promptTrackerAction = () => {
  return inquirer.prompt([
    {
      type: 'list',
      name: 'chooseAction',
      message: 'Choose what action to take:',
      choices: [
        'View all departments',
        'View all roles',
        'View all employees',
        'Add a department',
        'Add a role',
        'Add an employee',
        'Update an employee role',
      ],
    }
  ])
};

module.exports = { promptTrackerAction };