const userApi = require('../../api/user');
const chatApi = require('../../api/chat');

Page({
  data: {
    userId: '',
    uid: '',
    createTime: '',
    nickName: '',
    avatar: '',
    isFriend: false,
    loading: true
  },

  onLoad: function(options) {
    this.setData({ userId: options.userId || '' });
    this.loadUserProfile();
  },

  // 通过云端获取用户信息
  loadUserProfile: function() {
    const userId = this.data.userId;
    if (!userId) {
      this.setData({ loading: false });
      return;
    }

    userApi.getUserInfo(userId).then(res => {
      if (res.success) {
        const info = res.data;
        // 格式化注册时间
        let timeStr = '';
        if (info.createTime) {
          const d = new Date(info.createTime);
          timeStr = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
        }
        this.setData({
          uid: info.uid || '',
          nickName: info.nickName || info.nickname || info.name || '用户',
          avatar: info.avatar || info.avatarUrl || '/images/default_avatar.png',
          createTime: timeStr,
          loading: false
        });
        wx.setNavigationBarTitle({ title: this.data.nickName });
      } else {
        this.setData({ loading: false });
      }
      this.checkFriendship();
    }).catch(err => {
      console.error('获取信息失败:', err);
      this.setData({ loading: false });
    });
  },

  // 检查好友关系（通过云函数）
  checkFriendship: function() {
    const myId = (wx.getStorageSync('userInfo') || {}).userId;
    const friendId = this.data.userId;

    chatApi.getFriends(myId).then(res => {
      if (res.success && res.data) {
        const isFriend = res.data.some(f => String(f.friendId || f._id) === String(friendId));
        this.setData({ isFriend });
      }
    }).catch(() => {});
  },

  // 复制UID
  copyUid: function() {
    if (!this.data.uid) return;
    wx.setClipboardData({
      data: this.data.uid,
      success: () => { wx.showToast({ title: '已复制', icon: 'success' }); }
    });
  },

  // 发消息
  goToChat: function() {
    wx.navigateTo({
      url: `/subpackage_chat/chat/chat?friendId=${this.data.userId}&name=${encodeURIComponent(this.data.nickName)}&avatar=${encodeURIComponent(this.data.avatar)}`
    });
  },

  // 删除好友（通过云函数）
  deleteFriend: function() {
    const myId = (wx.getStorageSync('userInfo') || {}).userId;
    const friendId = this.data.userId;

    wx.showModal({
      title: '删除好友',
      content: '确定要删除该好友吗？',
      confirmColor: '#e54545',
      success: (res) => {
        if (res.confirm) {
          wx.showLoading({ title: '处理中...' });
          chatApi.deleteFriend(myId, friendId).then(res => {
            wx.hideLoading();
            if (res.success) {
              wx.showToast({ title: '已删除', icon: 'success' });
              this.setData({ isFriend: false });
            } else {
              wx.showToast({ title: res.errMsg || '失败', icon: 'none' });
            }
          }).catch(() => {
            wx.hideLoading();
            wx.showToast({ title: '失败', icon: 'none' });
          });
        }
      }
    });
  }
});
