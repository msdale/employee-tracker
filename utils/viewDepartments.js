
const viewDepartments = async function () {
  console.log("INSIDE viewDepartments");
  const response = await fetch('localhost:3001/api/departments');
  const myJson = await response.json(); //extract JSON from the http response
  
}

module.exports = {viewDepartments};

