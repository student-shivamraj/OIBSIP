// ----- Shared auth helpers used by register, login, and dashboard pages -----

const USERS_KEY = 'oibsip_users';       // stores all registered users (username -> hashed password)
const SESSION_KEY = 'oibsip_session';   // stores the currently logged-in username

// Hash a password using SHA-256 (Web Crypto API) so plain text is never stored.
async function hashPassword(password) {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

function getUsers() {
  return JSON.parse(localStorage.getItem(USERS_KEY)) || {};
}

function saveUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function userExists(username) {
  const users = getUsers();
  return Object.prototype.hasOwnProperty.call(users, username.toLowerCase());
}

async function registerUser(username, password) {
  const users = getUsers();
  const key = username.toLowerCase();
  const hashed = await hashPassword(password);
  users[key] = { displayName: username, password: hashed };
  saveUsers(users);
}

async function validateLogin(username, password) {
  const users = getUsers();
  const key = username.toLowerCase();
  if (!users[key]) return false;
  const hashed = await hashPassword(password);
  return users[key].password === hashed;
}

function deleteUser(username) {
  const users = getUsers();
  const key = username.toLowerCase();
  delete users[key];
  saveUsers(users);
}

function startSession(username) {
  sessionStorage.setItem(SESSION_KEY, username);
}

function getSession() {
  return sessionStorage.getItem(SESSION_KEY);
}

function endSession() {
  sessionStorage.removeItem(SESSION_KEY);
}

// Password rule: minimum 8 characters, at least 1 number
function isPasswordValid(password) {
  return password.length >= 8 && /\d/.test(password);
}