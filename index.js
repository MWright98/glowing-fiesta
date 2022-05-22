const inquirer = require("inquirer");
const mysql = require('mysql2');
const cTable = require('console.table');

let managerArray = [];
let employeeArray = [];
let roleArray = [];

//mysql database connection
const db = mysql.createConnection(
    {
        host: 'localhost',
        // Your MySQL username,
        user: 'root',
        // Your MySQL password
        password: 'localhost',
        database: 'employees'
    },
    console.log('Connected to the employee database.')
);

//Initial prompt to determine what action the user wants to perform
const promptUser = () => {
    return inquirer.prompt([
        {
            type: 'list',
            name: 'action',
            message: 'What would you like to do?',
            choices: ['View all departments', 'View all roles', 'View all employees',
                'Add a department', 'Add a role', 'Add an employee', 'Update an employee role', 'Exit']
        }
    ])
        .then((answer) => {
            actions(answer);
        })
}

//Switch function to handle action choice
const actions = (answer) => {
    switch (answer.action) {
        case 'View all departments':
            viewDepartments();
            break;
        case "View all roles":
            viewRoles();
            break;
        case "View all employees":
            viewEmployees();
            break;
        case "Add a department":
            addDepartment();
            break;
        case "Add a role":
            addRole();
            break;
        case "Add an employee":
            getManagers();
            break;
        case "Update an employee role":
            getEmployees();
            break;
        case "Exit":
            process.exit();
    }
};


//function to display all departments
function viewDepartments() {
    db.query(
        'SELECT * FROM department',
        function (err, results, fields) {
            console.table(results);
            promptUser();
        }
    )
};

//function to display all roles
function viewRoles() {
    db.query(
        'SELECT employee_role.*, department.name AS department FROM employee_role LEFT JOIN department ON employee_role.department_id = department.id',
        function (err, results, fields) {
            console.table(results);
            promptUser();
        }
    )
};

//function to display all employees
function viewEmployees() {
    db.query(
        //BELOW WORKS FOR ROLES
        // SELECT employee.id, employee.first_name, employee.last_name, employee.role_id, employee_role.title AS role,employee.manager_id FROM employee employee LEFT JOIN employee_role ON employee.role_id = employee_role.id 
        'SELECT employee.id, employee.first_name,employee.last_name,employee.role_id,employee.manager_id,manager.first_name AS ManagerFirstName ,manager.last_name AS ManagerLastName, employee_role.title AS role FROM employee employee LEFT JOIN employee_role ON employee.role_id = employee_role.id LEFT JOIN employee manager ON manager.id = employee.manager_id;',
        //BELOW WORKS FOR MANAGERS
        //'SELECT employee.id, employee.first_name,employee.last_name,employee.role_id,employee.manager_id,manager.first_name AS ManagerFirstName ,manager.last_name AS ManagerLastName FROM employee employee LEFT JOIN employee_role ON employee.role_id = employee_role.id LEFT JOIN employee manager ON manager.id = employee.manager_id;,
        function (err, results, fields) {
            console.table(results);
            promptUser();
        }
    )
};

//function to add a new department to the database
function addDepartment() {
    return inquirer.prompt(
        [{
            type: 'input',
            name: 'department',
            message: 'What is the name of the department you would like to add?'
        }
        ]
    )
        .then((answer) => {
            db.query(
                'INSERT INTO department (name) VALUES (?)',
                [answer.department], (err, results) => {
                    if (err) console.log(err);
                    viewDepartments();

                });

            console.log("Department added")
            promptUser();
        })
}

//function to add a new role to the database
function addRole() {
    return inquirer.prompt(
        [{
            type: 'input',
            name: 'role',
            message: 'What is the name of the role you would like to add?'
        },
        {
            type: 'input',
            name: 'salary',
            message: 'What is the salary for this role?'
        },
        {
            type: 'input',
            name: 'dID',
            message: 'What is the department ID for this role?'
        }
        ]
    )
        .then((answers) => {
            db.query(
                'INSERT INTO employee_role (title,salary,department_id) VALUES (?,?,?)',
                [answers.role, answers.salary, answers.dID], (err, results) => {
                    if (err) console.log(err);
                    viewRoles();

                });

            console.log("Role added")
            promptUser();
        })
}

//Function to put all employees into an array for use as manager options
function getManagers() {
    let itemsProcessed = 0;
    managerArray = [];

    db.query(
        'SELECT first_name, last_name FROM employee', (err, results) => {
            //console.log(results);
            results.forEach(element => {

                // var employee = ('"' + element.first_name + ' ' + element.last_name + '"' + ',')
                var employee = (element.first_name + ' ' + element.last_name)
                managerArray.push(employee);

                itemsProcessed++;
                if (itemsProcessed === results.length) {
                    addEmployee(managerArray);
                }
            })
        })
};

//Function to put all employees into an array for use in update function
function getEmployees() {
    let itemsProcessed = 0;
    employeeArray = [];

    db.query(
        'SELECT first_name, last_name FROM employee', (err, results) => {
            //console.log(results);
            results.forEach(element => {

                // var employee = ('"' + element.first_name + ' ' + element.last_name + '"' + ',')
                var employee = (element.first_name + ' ' + element.last_name)
                employeeArray.push(employee);

                itemsProcessed++;
                if (itemsProcessed === results.length) {
                    getRoles(employeeArray);
                }
            })
        })
};

function getRoles(employees) {
    let itemsProcessed = 0;
    roleArray = [];


    db.query(
        'SELECT title FROM employee_role', (err, results) => {
            //console.log(results);
            results.forEach(element => {

                // var employee = ('"' + element.first_name + ' ' + element.last_name + '"' + ',')
                var role = (element.title)
                roleArray.push(role);

                itemsProcessed++;
                if (itemsProcessed === results.length) {
                    updateEmployee(employees, roleArray);
                }
            })
        })
};



function addEmployee(managers) {

    return inquirer.prompt(
        [{
            type: 'input',
            name: 'firstName',
            message: "What is the employee's first name?"
        },
        {
            type: 'input',
            name: 'lastName',
            message: "What is the employee's last name?"
        },
        {
            type: 'input',
            name: 'roleID',
            message: 'What is the role ID for this employee?'
        },
        {
            type: 'list',
            name: 'manager',
            message: "Who is the employee's manager?",
            choices: managers
            //SELECT id FROM employees WHERE name = name
        }
        ]
    )
        .then((answers) => {
            var managerName = answers.manager;
            result = managerName.trim().split(/\s+/);
            db.query('SELECT id FROM employee WHERE employee.last_name = ?',
                [result[1]], (err, results) => {
                    //console.log(results[0].id);
                    db.query(
                        'INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?,?,?,?)',
                        [answers.firstName, answers.lastName, answers.roleID, results[0].id], (err, results) => {
                            if (err) console.log(err);
                            //viewEmployees();

                        });
                }
            )


            console.log("Employee added")
            promptUser();
        })
}

function updateEmployee(employees, roles) {
    return inquirer.prompt(
        [{
            type: 'list',
            name: 'employeeToUpdate',
            message: 'Which employee would you like to update?',
            choices: employees
        },
        {
            type: 'list',
            name: 'newRole',
            message: "What is the employee's new role?",
            choices: roles
        }
        ]
    )
        .then((answers) => {
            var updateName = answers.employeeToUpdate;
            result = updateName.trim().split(/\s+/);

            // console.log('employee first name ' + result[0]);
            //console.log('employee last name ' + result[1]);
            //console.log('new role is ' + answers.newRole);

            // console.log('answers.newRole ' + answers.newRole);
            db.query('SELECT id FROM employee_role WHERE employee_role.title = ?',
                [answers.newRole], (err, results) => {

                    let newRoleID = results[0].id
                    db.query('SELECT id FROM employee WHERE employee.last_name = ?',
                        [result[1]], (err, results) => {

                            //console.log('results[0].id, result[1] ' + results[0].id, result[1])
                            db.query(
                                'UPDATE employee SET role_id = ? WHERE id = ?', [newRoleID, results[0].id],
                                (err, results) => {
                                    console.log("Employee role updated!");
                                    promptUser();
                                }
                            )
                        })
                });
        });
}

promptUser();