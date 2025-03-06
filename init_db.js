var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('service_platform.db');

db.serialize(function () {
  // Drop existing tables if they exist
  db.run('DROP TABLE IF EXISTS User');
  db.run('DROP TABLE IF EXISTS Business');

  // Create User table
  db.run(`CREATE TABLE User (
    user_id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_name TEXT,
    password TEXT
  )`);

  // Create Business table
  db.run(`CREATE TABLE Business (
    business_id INTEGER PRIMARY KEY AUTOINCREMENT,
    business_name TEXT,
    phone TEXT,
    email TEXT,
    price REAL,
    logo TEXT,
    user_id INTEGER,
    FOREIGN KEY(user_id) REFERENCES User(user_id)
  )`);

  // Insert demo data into User table
  db.run(`INSERT INTO User (user_name, password) VALUES 
    ('business1', 'password1'),
    ('business2', 'password2'),
    ('business3', 'password3'),
    ('business4', 'password4')
  `);

  // Insert demo data into Business table
  db.run(`INSERT INTO Business (business_name, phone, email, price, logo, user_id) VALUES 
    ('Tire Change Co.', '1234567890', 'contact@tirechangeco.com', 50.0, 'logo1.png', 1),
    ('Quick Tire Service', '0987654321', 'info@quicktireservice.com', 60.0, 'logo2.png', 2),
    ('Premium Tire Shop', '5551234567', 'service@premiumtire.com', 70.0, 'logo3.png', 3),
    ('Elite Wheel Service', '5559876543', 'support@elitewheel.com', 80.0, 'logo4.png', 4)
  `);
});
