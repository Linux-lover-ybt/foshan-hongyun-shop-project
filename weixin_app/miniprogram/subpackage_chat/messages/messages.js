const chatApi = require('../../api/chat');

// 字母表
const LETTERS = ['#', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M',
  'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];

Page({
  data: {
    currentTab: 'chat',       // chat=消息, contacts=通讯录
    conversations: [],        // 会话列表
    requestCount: 0,          // 好友申请数
    loading: false,
    userInfo: {},
    // 通讯录相关
    friends: [],
    groupedFriends: [],
    letters: LETTERS,
    currentLetter: '',
    scrollToView: '',
    // 好友详情弹窗
    showFriendModal: false,
    selectedFriend: {}
  },

  _pollTimer: null,

  onLoad: function() {
    this.data.userInfo = wx.getStorageSync('userInfo') || {};
  },

  onShow: function() {
    if (this.data.currentTab === 'chat') {
      this.loadConversations();
      this.loadRequestCount();
      this.startPolling();
    } else if (this.data.currentTab === 'contacts') {
      this.loadFriends();
      this.loadRequestCount();
    }
  },

  onHide: function() {
    this.stopPolling();
  },

  onUnload: function() {
    this.stopPolling();
  },

  // 消息列表轮询（每5秒刷新会话）
  startPolling: function() {
    this.stopPolling();
    this._pollTimer = setInterval(() => {
      if (this.data.currentTab === 'chat') {
        this.loadConversations();
        this.loadRequestCount();
      }
    }, 5000);
  },

  stopPolling: function() {
    if (this._pollTimer) {
      clearInterval(this._pollTimer);
      this._pollTimer = null;
    }
  },

  // 切换底部Tab
  switchTab: function(e) {
    const tab = e.currentTarget.dataset.tab;
    if (this.data.currentTab !== tab) {
      this.setData({ currentTab: tab });
      if (tab === 'chat') {
        this.loadConversations();
        this.loadRequestCount();
      } else if (tab === 'contacts') {
        this.loadFriends();
        this.loadRequestCount();
      }
    }
  },

  // ==================== 消息列表相关 ====================

  // 加载会话列表（通过云函数）
  loadConversations: function() {
    const userId = this.data.userInfo.userId;
    if (!userId) return;

    this.setData({ loading: true });

    chatApi.getConversations(userId).then(res => {
      if (!res.success) {
        this.setData({ loading: false, conversations: [] });
        return;
      }
      const conversations = this.groupConversations(res.data, userId);
      this.setData({
        conversations: conversations,
        loading: false
      });
    }).catch(err => {
      console.error('加载消息列表失败:', err);
      this.setData({ loading: false, conversations: [] });
    });
  },

  // 将消息按好友分组为会话（按 friendId 去重合并）
  groupConversations: function(messages, myId) {
    const convMap = {};
    const myIdStr = String(myId);

    messages.forEach(msg => {
      // 统一提取对方ID（转为字符串确保类型一致）
      var friendId = '';
      if (String(msg.fromUserId) === myIdStr) {
        friendId = String(msg.toUserId);
      } else {
        friendId = String(msg.fromUserId);
      }

      if (!friendId || friendId === 'undefined') return;

      // 已存在该好友会话 → 更新最新消息
      if (convMap[friendId]) {
        var conv = convMap[friendId];
        
        // 累加未读数
        if (!msg.isRead && String(msg.toUserId) === myIdStr) {
          conv.unreadCount++;
        }

        // 用时间比较更新最后一条消息
        var msgTime = msg.createTime ? new Date(msg.createTime).getTime() : 0;
        if (msgTime > conv._latestTime) {
          conv._latestTime = msgTime;
          conv.lastMsg = msg.type === 'text' ? msg.content : (msg.type === 'image' ? '[图片]' : '[消息]');
          conv.lastMsgType = msg.type || 'text';
          conv.lastTime = this.formatMsgTime(msg.createTime);
          // 更新昵称和头像（取最新的）
          if (String(msg.fromUserId) === myIdStr) {
            conv.friendName = msg.toUserName || conv.friendName;
            conv.friendAvatar = msg.toUserAvatar || conv.friendAvatar;
          } else {
            conv.friendName = msg.fromUserName || conv.friendName;
            conv.friendAvatar = msg.fromUserAvatar || conv.friendAvatar;
          }
        }
        return;
      }

      // 新建会话条目
      var msgTime = msg.createTime ? new Date(msg.createTime).getTime() : 0;
      convMap[friendId] = {
        _id: friendId,
        friendId: friendId,
        friendName: String(msg.fromUserId) === myIdStr 
          ? (msg.toUserName || '用户') 
          : (msg.fromUserName || '用户'),
        friendAvatar: String(msg.fromUserId) === myIdStr
          ? (msg.toUserAvatar || '')
          : (msg.fromUserAvatar || ''),
        lastMsg: msg.type === 'text' ? msg.content : (msg.type === 'image' ? '[图片]' : '[消息]'),
        lastMsgType: msg.type || 'text',
        lastTime: this.formatMsgTime(msg.createTime),
        unreadCount: (!msg.isRead && String(msg.toUserId) === myIdStr) ? 1 : 0,
        _latestTime: msgTime
      };
    });

    // 按 _latestTime 降序排列
    var result = Object.values(convMap);
    result.sort(function(a, b) { return b._latestTime - a._latestTime; });
    return result;
  },

  // 加载好友申请数量（通过云函数）
  loadRequestCount: function() {
    const userId = this.data.userInfo.userId;
    if (!userId) return;

    chatApi.getFriendRequests(userId).then(res => {
      if (res.success && res.data && res.data.received) {
        const pendingCount = res.data.received.filter(r => r.status === 'pending').length;
        this.setData({ requestCount: pendingCount });
      }
    }).catch(() => {});
  },

  // 打开聊天
  openChat: function(e) {
    const { id, friendId, name, avatar } = e.currentTarget.dataset;
    wx.navigateTo({
      url: `/subpackage_chat/chat/chat?friendId=${friendId}&name=${encodeURIComponent(name)}&avatar=${encodeURIComponent(avatar || '')}`
    });
  },

  // 跳转好友申请
  goToFriendRequests: function() {
    wx.navigateTo({
      url: '/subpackage_chat/friend-requests/friend-requests'
    });
  },

  // 跳转群聊列表
  goToGroupList: function() {
    wx.showToast({ title: '功能开发中', icon: 'none' });
  },

  goToSearch: function() {
    wx.showToast({ title: '功能开发中', icon: 'none' });
  },

  // ==================== 通讯录相关 ====================

  // 加载好友列表（通过云函数）
  loadFriends: function() {
    const userInfo = this.data.userInfo;
    if (!userInfo.userId) return;

    this.setData({ loading: true });

    chatApi.getFriends(userInfo.userId).then(res => {
      if (!res.success) {
        this.setData({ friends: [], groupedFriends: [], loading: false });
        return;
      }
      const friends = res.data.map(f => ({
        _id: f.friendId || f._id,
        friendId: f.friendId || f._id,
        name: f.name || '',
        nickName: f.nickName || f.name || '未知用户',
        avatar: f.avatar || '/images/default_avatar.png',
        signature: f.signature || '',
        uid: f.uid || ''
      }));
      this.groupByLetter(friends);
    }).catch(err => {
      console.error('加载好友失败:', err);
      this.setData({ friends: [], groupedFriends: [], loading: false });
    });
  },

  // 按首字母分组
  groupByLetter: function(friends) {
    const groups = {};
    LETTERS.forEach(letter => { groups[letter] = []; });

    friends.forEach(friend => {
      const name = friend.nickName || friend.name || '';
      const letter = this.getFirstLetter(name);
      if (!groups[letter]) groups[letter] = [];
      groups[letter].push(friend);
    });

    const result = [];
    LETTERS.forEach(letter => {
      if (groups[letter] && groups[letter].length > 0) {
        result.push({ letter: letter, list: groups[letter] });
      }
    });

    this.setData({
      friends: friends,
      groupedFriends: result,
      loading: false
    });
  },

  getFirstLetter: function(name) {
    if (!name) return '#';
    const first = name.charAt(0).toUpperCase();
    const code = first.charCodeAt(0);
    if (code >= 0x4E00 && code <= 0x9FFF) {
      const pinyinMap = {
        '张': 'Z', '李': 'L', '王': 'W', '刘': 'L', '陈': 'C', '杨': 'Y', '赵': 'Z', '黄': 'H',
        '周': 'Z', '吴': 'W', '徐': 'X', '孙': 'S', '马': 'M', '朱': 'Z', '胡': 'H', '郭': 'G',
        '何': 'H', '林': 'L', '罗': 'L', '高': 'G', '郑': 'Z', '梁': 'L', '谢': 'X', '唐': 'T',
        '许': 'X', '邓': 'D', '冯': 'F', '韩': 'H', '曹': 'C', '曾': 'Z', '彭': 'P', '萧': 'X',
        '蔡': 'C', '潘': 'P', '田': 'T', '董': 'D', '袁': 'Y', '于': 'Y', '余': 'Y', '叶': 'Y'
      };
      return pinyinMap[first] || '#';
    }
    if (code >= 65 && code <= 90) return first;
    if (code >= 97 && code <= 122) return first.toUpperCase();
    return '#';
  },

  // 跳转添加好友
  goToAddFriend: function() {
    wx.navigateTo({ url: '/subpackage_chat/add-friend/add-friend' });
  },

  // 查看好友信息弹窗
  viewFriendInfo: function(e) {
    const { friendId, friendName, avatar, signature, uid } = e.currentTarget.dataset;
    this.setData({
      showFriendModal: true,
      selectedFriend: {
        friendId: friendId,
        name: friendName,
        avatar: avatar,
        signature: signature || '',
        uid: uid || ''
      }
    });
  },

  // 关闭好友弹窗
  closeFriendModal: function() {
    this.setData({ showFriendModal: false, selectedFriend: {} });
  },

  // 从弹窗打开聊天
  openChatFromModal: function() {
    const friend = this.data.selectedFriend;
    this.closeFriendModal();
    wx.navigateTo({
      url: `/subpackage_chat/chat/chat?friendId=${friend.friendId}&name=${encodeURIComponent(friend.name)}&avatar=${encodeURIComponent(friend.avatar || '')}`
    });
  },

  // 查看完整资料
  viewFullProfile: function() {
    const friend = this.data.selectedFriend;
    wx.navigateTo({
      url: `/subpackage_chat/friend-profile/friend-profile?userId=${friend.friendId}`
    });
  },

  // 字母索引触摸
  onIndexTouchStart: function(e) {
    this._touching = true;
    this.onIndexTouchMove(e);
  },
  onIndexTouchMove: function(e) {
    if (!this._touching) return;
    const y = e.touches[0].clientY;
    const itemHeight = 36;
    const topOffset = 300;
    const idx = Math.floor((y - topOffset) / itemHeight);
    if (idx >= 0 && idx < LETTERS.length) {
      const letter = LETTERS[idx];
      this.setData({
        currentLetter: letter,
        scrollToView: `section-${letter}`
      });
    }
  },
  onIndexTouchEnd: function() {
    this._touching = false;
    setTimeout(() => {
      this.setData({ currentLetter: '' });
    }, 500);
  },

  // ==================== 工具方法 ====================

  formatMsgTime: function(time) {
    if (!time) return '';
    const d = new Date(time);
    const now = new Date();
    const isToday = d.toDateString() === now.toDateString();

    if (isToday) {
      return `${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}`;
    }
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    if (d.toDateString() === yesterday.toDateString()) {
      return `昨天 ${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}`;
    }
    return `${d.getMonth()+1}/${d.getDate()}`;
  }
});
