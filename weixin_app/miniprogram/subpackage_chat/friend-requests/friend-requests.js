const chatApi = require('../../api/chat');

Page({
  data: {
    requests: [],
    loading: false
  },

  onLoad: function() { this.loadRequests(); },
  onShow: function() { this.loadRequests(); },

  // 加载好友申请列表（通过云函数）
  loadRequests: function() {
    const userInfo = wx.getStorageSync('userInfo');
    if (!userInfo || !userInfo.userId) return;

    this.setData({ loading: true });

    chatApi.getFriendRequests(userInfo.userId).then(res => {
      if (!res.success || !res.data) {
        this.setData({ requests: [], loading: false });
        return;
      }
      // 只显示我收到的申请
      const requests = (res.data.received || []).map(item => ({
        ...item,
        fromName: item.fromName || item.fromNickName || '未知用户',
        fromAvatar: item.fromAvatar || '/images/default_avatar.png',
        createTimeStr: this.formatTime(item.createTime)
      }));
      this.setData({ requests, loading: false });
    }).catch(err => {
      console.error('加载申请失败:', err);
      this.setData({ loading: false, requests: [] });
    });
  },

  // 接受好友申请（通过云函数）
  acceptRequest: function(e) {
    const id = e.currentTarget.dataset.id;
    const userInfo = wx.getStorageSync('userInfo');
    if (!userInfo || !userInfo.userId) return;

    console.log('接受好友申请:', { requestId: id, myId: userInfo.userId });

    wx.showLoading({ title: '处理中...' });
    
    chatApi.handleFriendRequest(id, 'accept', userInfo.userId).then(res => {
      wx.hideLoading();
      console.log('接受好友申请返回:', res);
      
      if (res.success) {
        wx.showToast({ title: '已接受', icon: 'success' });
        this.loadRequests();
      } else {
        wx.showModal({
          title: '操作失败',
          content: res.errMsg || '未知错误',
          showCancel: false
        });
      }
    }).catch(err => {
      wx.hideLoading();
      console.error('接受好友申请失败:', err);
      wx.showModal({
        title: '操作失败',
        content: err.errMsg || '网络错误，请重试',
        showCancel: false
      });
    });
  },

  // 拒绝好友申请（通过云函数）
  rejectRequest: function(e) {
    const id = e.currentTarget.dataset.id;
    const userInfo = wx.getStorageSync('userInfo');
    if (!userInfo || !userInfo.userId) return;

    wx.showModal({
      title: '提示',
      content: '确定拒绝该好友申请？',
      success: (modalRes) => {
        if (modalRes.confirm) {
          chatApi.handleFriendRequest(id, 'reject', userInfo.userId).then(res => {
            if (res.success) {
              wx.showToast({ title: '已拒绝', icon: 'success' });
              this.loadRequests();
            } else {
              wx.showToast({ title: res.errMsg || '操作失败', icon: 'none' });
            }
          }).catch(err => {
            console.error('操作失败:', err);
            wx.showToast({ title: '操作失败', icon: 'none' });
          });
        }
      }
    });
  },

  formatTime: function(time) {
    if (!time) return '';
    const d = new Date(time);
    const pad = (n) => String(n).padStart(2, '0');
    return `${d.getMonth()+1}-${d.getDate()} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
  }
});
