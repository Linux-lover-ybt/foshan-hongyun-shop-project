const DEFAULT_AVATAR = '/images/default_avatar.png';

function read(key, fallback) {
  const value = wx.getStorageSync(key);
  return value === '' || value === undefined || value === null ? fallback : value;
}

function write(key, value) {
  wx.setStorageSync(key, value);
  return value;
}

function createId(prefix) {
  return (prefix || 'local') + '_' + Date.now() + '_' + Math.random().toString(36).slice(2, 8);
}

function createUid(users) {
  const used = new Set((users || []).map(function(user) { return user.uid; }));
  let uid = '';
  do {
    uid = 'U' + String(Math.floor(100000 + Math.random() * 900000));
  } while (used.has(uid));
  return uid;
}

function getUsers() {
  const users = read('localUsers', []);
  return Array.isArray(users) ? users : [];
}

function saveUsers(users) {
  return write('localUsers', Array.isArray(users) ? users : []);
}

function normalizePhone(phone) {
  return String(phone || '').replace(/\s+/g, '');
}

function toPublicUser(user) {
  if (!user) return null;
  const result = Object.assign({}, user);
  delete result.password;
  return result;
}

function getUserById(userId) {
  if (!userId) return null;
  return getUsers().find(function(user) {
    return String(user.userId) === String(userId);
  }) || null;
}

function getCurrentUser() {
  return read('userInfo', null);
}

function saveCurrentUser(user) {
  write('userInfo', user);
  return user;
}

function clearSession() {
  wx.removeStorageSync('token');
  wx.removeStorageSync('userInfo');
  wx.removeStorageSync('isLoggedIn');
}

function getSessionUserId() {
  const user = getCurrentUser();
  return user && user.userId ? user.userId : '';
}

module.exports = {
  DEFAULT_AVATAR,
  read,
  write,
  createId,
  createUid,
  getUsers,
  saveUsers,
  normalizePhone,
  toPublicUser,
  getUserById,
  getCurrentUser,
  saveCurrentUser,
  clearSession,
  getSessionUserId
};
