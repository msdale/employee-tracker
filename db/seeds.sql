DELETE FROM employee;
DELETE FROM role;
DELETE FROM department;

ALTER TABLE department AUTO_INCREMENT = 1;
INSERT INTO department
  (name)
VALUES
  ('Service'),
  ('Design'),
  ('Infrastructure'),
  ('Security'),
  ('Sales'),
  ('Legal'),
  ('Executive');

ALTER TABLE role AUTO_INCREMENT = 1;
INSERT INTO role
  (title, salary, dept_id)
VALUES
  ('Customer Service', 55000, 1),
  ('Business Analyst', 65000, 5),
  ('Developer', 85000, 3),
  ('System Administrator', 95000, 3),
  ('Security Administrator', 110000, 4),
  ('Attorney', 120000, 6),
  ('System Architect', 110000, 6),
  ('Service Manager', 120000, 1),
  ('Design Manager', 120000, 2),
  ('Infrastructure Manager', 120000, 3),
  ('Security Manager', 120000, 4),
  ('Sales Manager', 120000, 5),
  ('Legal Manager', 120000, 6),
  ('Executive Manager', 150000, 7);


ALTER TABLE employee AUTO_INCREMENT = 1;
INSERT INTO employee
  (first_name, last_name, role_id, manager_id)
VALUES
  ('Maura', 'Jordan', 14, null),
  ('John', 'Horshank', 8, 1 ),
  ('Ginger', 'Brouqet', 9, 1),
  ('Peter', 'Greenaway', 10, 1),
  ('Jane', 'Jarman', 11, 1),
  ('Paolo', 'Pasolini', 12, 1),
  ('Janeau', 'Williams', 13, 1),
  ('Silicia', 'Jonas', 1, 2),
  ('Bill', 'Jankowski', 1, 2),
  ('Grady', 'Powell', 3, 4),
  ('Cindy', 'Lashovka', 3, 4),
  ('Burly', 'Sosuta', 3, 4),
  ('Lola', 'Jasper', 2, 6),
  ('Jake', 'Collequan', 2, 6),
  ('Simon', 'Brown', 2, 6);
