const sqlite3 = require('sqlite3').verbose();
const sqlite = require('sqlite');

let db;

async function makeConnection() {
  db = await sqlite.open({
    filename: 'service_platform.db',
    driver: sqlite3.Database,
  });
}

// Business User Signup: Creates a new business account
async function createBusinessUser(userName, password, businessName, phone, email, price) {
  const userResult = await db.run('INSERT INTO User (user_name, password) VALUES (?, ?)', [userName, password]);

  const userId = userResult.lastID;

  await db.run('INSERT INTO Business (business_name, phone, email, price, user_id) VALUES (?, ?, ?, ?, ?)', [
    businessName,
    phone,
    email,
    price,
    userId,
  ]);
}

// Business User Login: Authenticates a business user
async function loginBusinessUser(userName, password) {
  const user = await db.get('SELECT user_id, user_name FROM User WHERE user_name = ? AND password = ?', [
    userName,
    password,
  ]);

  return user;
}

// Business User Change Password: Updates the password in the user table
async function changePassword(userId, newPassword) {
  await db.run('UPDATE User SET password = ? WHERE user_id = ?', [newPassword, userId]);
}

// Show Business Info for Update: Retrieves business information
async function getBusinessInfo(userId) {
  const businessInfo = await db.get(
    'SELECT b.* FROM Business b JOIN User u ON b.user_id = u.user_id WHERE u.user_id = ?',
    [userId]
  );

  return businessInfo;
}

// Business User Update Business Info: Updates business profile
async function updateBusinessInfo(userId, businessName, phone, email, price) {
  await db.run('UPDATE Business SET business_name=?, phone=?, email=?, price=? WHERE user_id=?', [
    businessName,
    phone,
    email,
    price,
    userId,
  ]);
}

// Business User Delete Account: Deletes the business account
async function deleteBusinessAccount(userId) {
  await db.run('DELETE FROM Business WHERE user_id = ?', [userId]);

  await db.run('DELETE FROM User WHERE user_id = ?', [userId]);
}

// List All Businesses: Retrieves all registered businesses
async function getAllBusinesses() {
  const businesses = await db.all('SELECT * FROM Business');

  return businesses;
}
// Car Owner Search by Price: Searches businesses by price
async function searchBusinessByPrice(maxPrice) {
  const businesses = await db.all(
    'SELECT b.* FROM Business b JOIN User u ON b.user_id = u.user_id WHERE b.price <= ?',
    [maxPrice]
  );

  return businesses;
}

module.exports = {
  makeConnection,
  createBusinessUser,
  loginBusinessUser,
  changePassword,
  getBusinessInfo,
  updateBusinessInfo,
  deleteBusinessAccount,
  getAllBusinesses,
  searchBusinessByPrice,
};
