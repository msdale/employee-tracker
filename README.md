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

To install locally, clone this repository to your local environment.  This is a node application, so node must be installed.  MySQL must also be installed locally.  For mySQL installation see https://dev.mysql.com/doc/refman/8.0/en/installing.html  If you need to install node, check out this link  https://nodejs.org/en/download/.  Once mySQL and node (and npm) are installed, attach to the repository root directory and update npm dependencies with the following commands:

* npm install jest express mysql2 inquirer

To get started, first execute the 3 database initialization scripts.  Attach to the root directory of the repository and connect to mySQL, then type the source commands...

mysql> source db/db.sql

mysql> source db/schema.sql

mysql> source db/seeds.sql

The first 2 are required.  The db/seeds.sql script is only there to provide some initial test data.

See the installation demo below...



## Usage

To execute the application, from the root directory of the cloned repository, type the following:

node empoyee-tracker.js

OR

npm start

Follow the command-line prompts...

See the following demo...


https://user-images.githubusercontent.com/90280725/148714162-c196bb59-d0ca-49d6-bc31-7c4bcb4b669c.mp4



## Questions

Any questions, please contact Mark Dale.

My email address is: msdaledad@gmail.com
My github profile is https://github.com/msdale
