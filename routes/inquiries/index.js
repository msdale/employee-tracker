const Employee = require('./lib/Employee.js');
const Manager = require('./lib/Manager.js');
const Engineer = require('./lib/Engineer.js');
const Intern = require('./lib/Intern.js');
const {ensureDir, writeFile, copyFile} = require('./utils/generate-site.js');
const { promptEngineerInfo, promptInternInfo, promptTeamInfo } = require('./utils/gather-team-data');
const generatePage = require('./utils/generate-page');

/*
 * Extract data executed from prompts...
 * Populate the team member class object appropriately
 */

/*const extractManager = function(teamData) {
  return new Manager(teamData.managerName,
     teamData.managerEmployeeId,
     teamData.managerEmail,
     teamData.managerOfficeNumber);
};

const extractEngineers = function(teamData) {
  let engineers = [];
  if (!teamData.engineers) {
    return engineers;
  }
  for (let i = 0; i < teamData.engineers.length; i++) {
    let eng = teamData.engineers[i];
    engineers.push(new Engineer(eng.engineerName,
                                eng.engineerEmployeeId,
                                eng.engineerEmail,
                                eng.engineerGithubUser));
  }
  return engineers;
};

const extractInterns = function(teamData) {
  let interns = [];
  if (!teamData.interns) {
    return interns;
  }
  for (let i = 0; i < teamData.interns.length; i++) {
    let eng = teamData.interns[i];
    interns.push(new Intern(eng.internName,
                                eng.internEmployeeId,
                                eng.internEmail,
                                eng.internSchool));
  }
  return interns;
};


/*
 * Global variables
 */
/*let manager = {};
let engineers = [];
let interns = []; 

/*
 * Process chain for generating Team Profile HTML
 */
/*promptTeamInfo()
  .then(teamData => {
    if (teamData.confirmAddMember) {
      if (teamData.memberTypeToAdd === 'engineer') {
        return promptEngineerInfo(teamData);
      } else if (teamData.memberTypeToAdd === 'intern') {
        return promptInternInfo(teamData);
      }
    }
    return teamData;
  })
  .then(teamData => {
    // Convert Inquirer JSON object to Team member class objects
    manager = extractManager(teamData);
    engineers = extractEngineers(teamData);
    interns = extractInterns(teamData);
    return generatePage(teamData.teamName, manager, engineers, interns);
  })
  .then(pageHTML => {
    ensureDir(pageHTML)
    .then(pageHTML => {
      return writeFile(pageHTML);
    })
    .then(writeFileResponse => {
      console.log(writeFileResponse);
      return copyFile();
    })
    .then(copyFileResponse => {
      console.log(copyFileResponse);
    })
  })
  .catch(err => {
    console.log(err);
  });*/