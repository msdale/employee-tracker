# employee-tracker 

## Description

A node-based CLI app for managing employee roles and accountabilities.


![screenshot](./images/screen-sample.png)


## Table Of Contents

- [employee-tracker](#employee-tracker)
  - [Description](#description)
  - [Table Of Contents](#table-of-contents)
  - [Installation](#installation)
  - [Usage](#usage)
  - [Questions](#questions)

## Installation

To install locally, clone this repository to your local environment.  This is a node application, so node must be installed.  MySQL must also be installed locally.  For mySQL installation see https://dev.mysql.com/doc/refman/8.0/en/installing.html  If you need to install node, check out this link  https://nodejs.org/en/download/.  Once mySQL and node (and npm) are installed, attach to the repository root directory and update npm dependencies with the following command:

* npm install jest express mysql2 inquirer console.table

Additionally you must execute the first 2 database initialization scripts.  Attach to the root directory of the repository and connect to mySQL, then type the source commands...

mysql> source db/db.sql

mysql> source db/schema.sql

mysql> source db/seeds.sql        (optional)

The first 2 are required INITIALLY.  The last, db/seeds.sql, provides some initial test data.

THE FIRST 2 SQL SCRIPTS SHOULD ONLY BE RUN TO RE-INITIALIZE THE MYSQL DATABASE AS A FIRST-TIME SETUP.  Or they can be run to restart from the beginning, as part of a test scenario.

See demo of the installation process below...


https://user-images.githubusercontent.com/90280725/148815844-bb2852ef-0bae-453c-b724-5b31d7ee5214.mp4


## Usage

To execute the application, from the root directory of the cloned repository, type the following:

node empoyee-tracker.js

OR

npm start

Follow the command-line prompts...

These are the listed functional options:

* View all departments
* View all roles
* View all employees
* Add a department
* Add a role
* Add an employee
* Update an employee's role
* Update an employee's manager
* View employees by manager
* View employees by department
* Delete a department
* Delete a role
* Delete an employee
* View the salary budget for a department

See the following demo...


https://user-images.githubusercontent.com/90280725/148820446-2609477b-5787-4296-8cdf-adb910e1fc02.mp4


## Questions

Any questions, please contact Mark Dale.

My email address is: msdaledad@gmail.com
My github profile is https://github.com/msdale
