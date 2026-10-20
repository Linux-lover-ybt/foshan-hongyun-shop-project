const chatApi = require('../../api/chat');

// 字母表
const LETTERS = ['#', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M',
  'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];

Page({
  data: {
    friends: [],
    groupedFriends: [],
    letters: LETTERS,
    currentLetter: '',
    requestCount: 0,
    loading: false,
    myName: '',
    myAvatar: '',
    scrollToView: ''
  },

  onLoad: function() {
    const userInfo = wx.getStorageSync('userInfo') || {};
    this.setData({
      myName: userInfo.nickName || userInfo.name || '我的',
      myAvatar: userInfo.avatar || ''
    });
    this.loadFriends();
    this.loadRequestCount();
  },

  onShow: function() {
    this.loadRequestCount();
  },

  // 加载好友列表（通过云函数）
  loadFriends: function() {
    const userInfo = wx.getStorageSync('userInfo') || {};
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
      this.setData({ loading: false, friends: [], groupedFriends: [] });
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

  // 加载申请数（通过云函数）
  loadRequestCount: function() {
    const userInfo = wx.getStorageSync('userInfo');
    if (!userInfo || !userInfo.userId) return;

    chatApi.getFriendRequests(userInfo.userId).then(res => {
      if (res.success && res.data && res.data.received) {
        const pendingCount = res.data.received.filter(r => r.status === 'pending').length;
        this.setData({ requestCount: pendingCount });
      }
    }).catch(() => {});
  },

  // 打开聊天
  openChat: function(e) {
    const { friendId, friendName, avatar } = e.currentTarget.dataset;
    wx.navigateTo({
      url: `/subpackage_chat/chat/chat?friendId=${friendId}&name=${encodeURIComponent(friendName)}&avatar=${encodeURIComponent(avatar || '')}`
    });
  },

  // 跳转添加好友
  goToAddFriend: function() {
    wx.navigateTo({ url: '/subpackage_chat/add-friend/add-friend' });
  },

  goToFriendRequests: function() {
    wx.navigateTo({ url: '/subpackage_chat/friend-requests/friend-requests' });
  },
  goToGroupList: function() {
    wx.showToast({ title: '功能开发中', icon: 'none' });
  },
  goToTags: function() {
    wx.showToast({ title: '功能开发中', icon: 'none' });
  },
  viewMyProfile: function() {
    wx.showToast({ title: '个人资料', icon: 'none' });
  },

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
  }
});
