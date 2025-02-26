const sqlite3 = require("sqlite3").verbose();
const sqlite = require("sqlite");

let db;

async function makeConnection() {
  db = await sqlite.open({
    filename: "service_platform.db",
    driver: sqlite3.Database,
  });
}

// Business User Signup: Creates a new business account
async function createBusinessUser() {}

// Business User Login: Authenticates a business user
async function loginBusinessUser() {}

// Business User Change Password: Updates the password in the user table
async function changePassword() {}

// Show Business Info for Update: Retrieves business information
async function getBusinessInfo() {}

// Business User Update Business Info: Updates business profile
async function updateBusinessInfo() {}

// Business User Delete Account: Deletes the business account
async function deleteBusinessAccount() {}

// List All Businesses: Retrieves all registered businesses
async function getAllBusinesses() {}

// Car Owner Search by Price: Searches businesses by price
async function searchBusinessByPrice() {}

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
