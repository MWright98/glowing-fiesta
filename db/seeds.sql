INSERT INTO department (name)
VALUES
('Accounting'),
('Engineering'),
('Marketing'),
('Shipping');

INSERT INTO employee_role (title, salary, department_id)
VALUES
('Accountant','50000',1),
('Engineer','60000',2),
('Social Media Manager','40000',3),
('Shipper','40000',4);

INSERT INTO employee (first_name, last_name, role_id) 
VALUES
('James','Fraser',1),
('Jack','London',2),
('Robert','Bruce',3),
('Peter','Greenway',4);