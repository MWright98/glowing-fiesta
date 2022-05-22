const inquirer = require("inquirer");
const mysql = require('mysql2');
const cTable = require('console.table');

const managerArray = [];

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
                'Add a department', 'Add a role', 'Add an employee', 'Update an employee role']
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
            getEmployees();
            break;
        case "Update an employee role":
            console.log("Updating role");
            break;
    }
};

//function to display all departments
function viewDepartments() {
    db.query(
        'SELECT * FROM department',
        function (err, results, fields) {
            console.table(results);
        }
    )
};

//function to display all roles
function viewRoles() {
    db.query(
        'SELECT * FROM employee_role',
        function (err, results, fields) {
            console.table(results);
        }
    )
};

//function to display all employees
function viewEmployees() {
    db.query(
        'SELECT * FROM employee',
        function (err, results, fields) {
            console.table(results);
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
        })
}

//Function to put all employees into an array for use as manager options
function getEmployees() {
    let itemsProcessed = 0;

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


            }

            )
        }
    )


}



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
            db.query(
                'INSERT INTO employee (first_name, last_name, role_id) VALUES (?,?,?)',
                [answers.firstName, answers.lastName, answers.roleID], (err, results) => {
                    if (err) console.log(err);
                    viewEmployees();

                });

            console.log("Employee added")
        })
}

function updateEmployee() {

}

promptUser();