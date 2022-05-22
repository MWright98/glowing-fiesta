INSERT INTO department (name)
VALUES
('Accounting'),
('Engineering'),
('Marketing'),
('Shipping');

INSERT INTO employee_role (title, salary, department_id)
VALUES
('Accountant','50000',1),
('Engineer','70000',2),
('Social Media Manager','40000',3),
('Shipper','40000',4);

INSERT INTO employee (first_name, last_name, role_id, manager_id) 
VALUES
('James','Fraser',1,null),
('Jack','London',2,null),
('Robert','Bruce',3,1),
('Peter','Greenway',4,null),
('Samuel','Bruce',2,2);