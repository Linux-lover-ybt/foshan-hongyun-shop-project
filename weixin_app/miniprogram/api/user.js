const store = require('../utils/local-store');
const pointsUtil = require('../utils/points');

function withPoints(user) {
  if (!user) return null;
  return Object.assign(store.toPublicUser(user), {
    points: pointsUtil.getPoints()
  });
}

function register(params) {
  const phone = store.normalizePhone(params && params.phone);
  const password = String((params && params.password) || '');
  const nickname = String((params && params.nickname) || '').trim() || ('用户' + phone.slice(-4));

  if (!phone) {
    return Promise.resolve({ success: false, errMsg: '请输入手机号' });
  }

  const users = store.getUsers();
  if (users.some(function(user) { return user.phone === phone; })) {
    return Promise.resolve({ success: false, errMsg: '该手机号已注册' });
  }

  const userId = store.createId('user');
  const user = {
    userId,
    uid: store.createUid(users),
    phone,
    password,
    nickname,
    name: nickname,
    nickName: nickname,
    avatarUrl: store.DEFAULT_AVATAR,
    avatar: store.DEFAULT_AVATAR,
    signature: '',
    role: 'user',
    createTime: new Date().toISOString()
  };

  users.unshift(user);
  store.saveUsers(users);
  pointsUtil.setPoints(0);

  return Promise.resolve({
    success: true,
    data: withPoints(user)
  });
}

function loginByPassword(params) {
  const username = String((params && params.username) || '').trim();
  const password = String((params && params.password) || '');
  const users = store.getUsers();
  const user = users.find(function(item) {
    return item.phone === username ||
      item.nickname === username ||
      item.name === username ||
      item.uid === username.toUpperCase();
  });

  if (!user) {
    return Promise.resolve({ success: false, errMsg: '账号不存在，请先注册' });
  }
  if (user.password !== password) {
    return Promise.resolve({ success: false, errMsg: '密码不正确' });
  }

  return Promise.resolve({
    success: true,
    data: Object.assign(withPoints(user), {
      token: 'local_' + user.userId + '_' + Date.now()
    })
  });
}

function loginByCode(params) {
  const phone = store.normalizePhone(params && params.phone);
  const users = store.getUsers();
  let user = users.find(function(item) { return item.phone === phone; });
  const isNewUser = !user;

  if (!user) {
    const nickname = '用户' + phone.slice(-4);
    user = {
      userId: store.createId('user'),
      uid: store.createUid(users),
      phone,
      password: '',
      nickname,
      name: nickname,
      nickName: nickname,
      avatarUrl: store.DEFAULT_AVATAR,
      avatar: store.DEFAULT_AVATAR,
      signature: '',
      role: 'user',
      createTime: new Date().toISOString()
    };
    users.unshift(user);
    store.saveUsers(users);
    pointsUtil.setPoints(0);
  }

  return Promise.resolve({
    success: true,
    isNewUser,
    data: Object.assign(withPoints(user), {
      token: 'local_' + user.userId + '_' + Date.now()
    })
  });
}

function getUserInfo(userId) {
  const user = store.getUserById(userId) || store.getCurrentUser();
  if (!user) {
    return Promise.resolve({ success: false, errMsg: '用户不存在' });
  }
  return Promise.resolve({ success: true, data: withPoints(user) });
}

function updateProfile(userId, profile) {
  const users = store.getUsers();
  const index = users.findIndex(function(user) {
    return String(user.userId) === String(userId);
  });
  if (index < 0) {
    return Promise.resolve({ success: false, errMsg: '用户不存在' });
  }

  const nickname = String((profile && profile.nickname) || users[index].nickname || '').trim();
  const avatarUrl = (profile && profile.avatarUrl) || users[index].avatarUrl || store.DEFAULT_AVATAR;
  users[index] = Object.assign({}, users[index], {
    nickname,
    name: nickname,
    nickName: nickname,
    avatarUrl,
    avatar: avatarUrl
  });
  store.saveUsers(users);

  const current = store.getCurrentUser();
  if (current && String(current.userId) === String(userId)) {
    store.saveCurrentUser(Object.assign({}, current, store.toPublicUser(users[index])));
  }

  return Promise.resolve({ success: true, data: withPoints(users[index]) });
}

function listPublicUsers() {
  return store.getUsers().map(withPoints);
}

module.exports = {
  register,
  loginByCode,
  loginByPassword,
  getUserInfo,
  updateProfile,
  listPublicUsers
};
