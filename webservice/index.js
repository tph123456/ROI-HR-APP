const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

//Create the express application
const app = express();
app.use(bodyParser.json());
app.use(cors());

// Port set to 6000 to run server
const port = 6000;

//employee data file path
const employeesFilePath = path.join(__dirname, 'employees.json');
// Loading employee data from employees.json file
let employees = require(employeesFilePath);

// Route to handle GET requests to retrieve employees
app.get('/employees', (req, res) => res.json(employees));

// Route to handle POST requests to add a new employee
app.post('/employees', (req, res) => {
  const newEmployee = { ...req.body, id: employees.length + 1 };
  employees.push(newEmployee);
  // Saves the new employee to employees file
  saveEmployeesToFile();
  res.status(201).json(newEmployee);
});

// Route to handle PUT requests to update an existing employee ID
app.put('/employees/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  const employeeIndex = employees.findIndex((e) => e.id === id);

  // Check if the employee exists already
  if (employeeIndex === -1) {
    res.status(404).json({ error: 'Employee not found' });
    return;
  }
// Updates the existing employee data with new data
  employees[employeeIndex] = { ...employees[employeeIndex], ...req.body };
  // Saves the new updated data to employees file
  saveEmployeesToFile();
  res.status(200).json(employees[employeeIndex]);
});

// Route to handle DELETE requests to delete an employee
app.delete('/employees/:id', (req, res) => {
  // Uses the request paramaters to extract the specified employee
  const id = parseInt(req.params.id, 10);
  employees = employees.filter((e) => e.id !== id);
  // Saves the new update to the employee file
  saveEmployeesToFile();
  res.status(200).json({ message: 'Employee deleted successfully' });
});

// Saves the employee data to the employees file 
function saveEmployeesToFile() {
  fs.writeFileSync(employeesFilePath, JSON.stringify(employees, null, 2), 'utf8');
}

// Server listening on Port 3000
app.listen(port, () => console.log(`Employee Web Service - Started: Listening on port ${port}`));
