const store = require('../utils/local-store');
const userApi = require('./user');

function readList(key) {
  const value = store.read(key, []);
  return Array.isArray(value) ? value : [];
}

function isParticipant(message, userId, friendId) {
  const from = String(message.fromUserId || '');
  const to = String(message.toUserId || '');
  return (from === String(userId) && to === String(friendId)) ||
    (from === String(friendId) && to === String(userId));
}

function getMessages(myId, friendId, limit) {
  const messages = readList('chatMessages')
    .filter(function(item) { return isParticipant(item, myId, friendId); })
    .sort(function(a, b) {
      return new Date(a.createTime || 0).getTime() - new Date(b.createTime || 0).getTime();
    });
  return Promise.resolve({
    success: true,
    data: messages.slice(-(Number(limit) || 50))
  });
}

function sendMessage(msgData) {
  const message = Object.assign({}, msgData, {
    _id: store.createId('msg'),
    isRead: false,
    createTime: new Date().toISOString()
  });
  const messages = readList('chatMessages');
  messages.push(message);
  store.write('chatMessages', messages);
  return Promise.resolve({ success: true, data: message });
}

function markAsRead(myId, friendId) {
  let changed = false;
  const messages = readList('chatMessages').map(function(message) {
    if (String(message.toUserId) === String(myId) &&
        String(message.fromUserId) === String(friendId) &&
        !message.isRead) {
      changed = true;
      return Object.assign({}, message, { isRead: true });
    }
    return message;
  });
  if (changed) store.write('chatMessages', messages);
  return Promise.resolve({ success: true });
}

function getConversations(userId) {
  const messages = readList('chatMessages')
    .filter(function(message) {
      return String(message.fromUserId) === String(userId) ||
        String(message.toUserId) === String(userId);
    })
    .sort(function(a, b) {
      return new Date(a.createTime || 0).getTime() - new Date(b.createTime || 0).getTime();
    });
  return Promise.resolve({ success: true, data: messages });
}

function pollLatest(myId, friendId) {
  return getMessages(myId, friendId, 1).then(function(res) {
    return {
      success: true,
      data: res.data.length > 0 ? res.data[res.data.length - 1] : null
    };
  });
}

function getFriends(userId) {
  const users = userApi.listPublicUsers();
  const friendIds = readList('chatFriends')
    .filter(function(item) { return String(item.userId) === String(userId); })
    .map(function(item) { return String(item.friendId); });
  const friends = friendIds.map(function(friendId) {
    const user = users.find(function(item) {
      return String(item.userId) === friendId || String(item._id) === friendId;
    });
    return user ? Object.assign({}, user, {
      friendId: user.userId,
      name: user.name || user.nickname || '用户',
      nickName: user.nickName || user.nickname || user.name || '用户',
      avatar: user.avatar || user.avatarUrl || store.DEFAULT_AVATAR
    }) : null;
  }).filter(Boolean);
  return Promise.resolve({ success: true, data: friends });
}

function sendFriendRequest(fromUserId, fromName, fromAvatar, toUserId) {
  if (String(fromUserId) === String(toUserId)) {
    return Promise.resolve({ success: false, errMsg: '不能添加自己为好友' });
  }
  const requests = readList('chatFriendRequests');
  const exists = requests.find(function(item) {
    return String(item.fromUserId) === String(fromUserId) &&
      String(item.toUserId) === String(toUserId) &&
      item.status === 'pending';
  });
  if (exists) {
    return Promise.resolve({ success: false, errMsg: '好友申请已发送' });
  }

  const request = {
    _id: store.createId('friend_request'),
    fromUserId,
    fromName: fromName || '用户',
    fromAvatar: fromAvatar || store.DEFAULT_AVATAR,
    toUserId,
    status: 'pending',
    message: '请求添加你为好友',
    createTime: new Date().toISOString()
  };
  requests.unshift(request);
  store.write('chatFriendRequests', requests);
  return Promise.resolve({ success: true, data: request });
}

function getFriendRequests(userId) {
  const requests = readList('chatFriendRequests');
  return Promise.resolve({
    success: true,
    data: {
      received: requests.filter(function(item) { return String(item.toUserId) === String(userId); }),
      sent: requests.filter(function(item) { return String(item.fromUserId) === String(userId); })
    }
  });
}

function addFriendship(userId, friendId) {
  if (!userId || !friendId) return;
  const friends = readList('chatFriends');
  const pairs = [[userId, friendId], [friendId, userId]];
  pairs.forEach(function(pair) {
    const exists = friends.some(function(item) {
      return String(item.userId) === String(pair[0]) &&
        String(item.friendId) === String(pair[1]);
    });
    if (!exists) {
      friends.push({
        _id: store.createId('friend'),
        userId: pair[0],
        friendId: pair[1],
        createTime: new Date().toISOString()
      });
    }
  });
  store.write('chatFriends', friends);
}

function handleFriendRequest(requestId, handleAction, myId) {
  let target = null;
  const requests = readList('chatFriendRequests').map(function(item) {
    if (String(item._id) !== String(requestId)) return item;
    target = Object.assign({}, item, {
      status: handleAction === 'accept' ? 'accepted' : 'rejected',
      updateTime: new Date().toISOString()
    });
    return target;
  });
  store.write('chatFriendRequests', requests);
  if (target && target.status === 'accepted') {
    addFriendship(myId || target.toUserId, target.fromUserId);
  }
  return Promise.resolve(target
    ? { success: true, data: target }
    : { success: false, errMsg: '好友申请不存在' });
}

function deleteFriend(myId, friendId) {
  const friends = readList('chatFriends').filter(function(item) {
    const direct = String(item.userId) === String(myId) && String(item.friendId) === String(friendId);
    const reverse = String(item.userId) === String(friendId) && String(item.friendId) === String(myId);
    return !direct && !reverse;
  });
  store.write('chatFriends', friends);
  return Promise.resolve({ success: true });
}

function searchUser(keyword, myId) {
  const key = String(keyword || '').trim().toLowerCase();
  if (!key) return Promise.resolve({ success: true, data: [] });

  const friendIds = new Set(getFriendIds(myId));
  const pendingIds = new Set(readList('chatFriendRequests')
    .filter(function(item) {
      return String(item.fromUserId) === String(myId) && item.status === 'pending';
    })
    .map(function(item) { return String(item.toUserId); }));

  const results = userApi.listPublicUsers()
    .filter(function(user) { return String(user.userId) !== String(myId); })
    .filter(function(user) {
      return String(user.uid || '').toLowerCase() === key ||
        String(user.nickname || user.name || '').toLowerCase().indexOf(key) >= 0;
    })
    .map(function(user) {
      return Object.assign({}, user, {
        _id: user.userId,
        displayName: user.nickname || user.name || '用户',
        displayAvatar: user.avatar || user.avatarUrl || store.DEFAULT_AVATAR,
        isFriend: friendIds.has(String(user.userId)),
        requestPending: pendingIds.has(String(user.userId))
      });
    });
  return Promise.resolve({ success: true, data: results });
}

function getFriendIds(userId) {
  return readList('chatFriends')
    .filter(function(item) { return String(item.userId) === String(userId); })
    .map(function(item) { return String(item.friendId); });
}

function getUnreadCount(userId) {
  const count = readList('chatMessages').filter(function(message) {
    return String(message.toUserId) === String(userId) && !message.isRead;
  }).length;
  return Promise.resolve({ success: true, count });
}

module.exports = {
  getMessages,
  sendMessage,
  markAsRead,
  getConversations,
  pollLatest,
  getFriends,
  sendFriendRequest,
  getFriendRequests,
  handleFriendRequest,
  deleteFriend,
  searchUser,
  getUnreadCount
};
