const chatApi = require('../../api/chat');

Page({
  data: {
    searchKey: '',
    results: [],
    searching: false,
    searched: false
  },

  onSearchInput: function(e) {
    this.setData({ searchKey: e.detail.value });
  },

  doSearch: function() {
    const key = this.data.searchKey.trim();
    if (!key) {
      wx.showToast({ title: '请输入搜索内容', icon: 'none' });
      return;
    }

    const myId = (wx.getStorageSync('userInfo') || {}).userId;
    if (!myId) {
      wx.showToast({ title: '请先登录', icon: 'none' });
      return;
    }

    this.setData({ searching: true, searched: true });

    // 判断搜索类型：UID 格式直接用云函数搜索，否则也用云函数搜索
    if (/^U\d{6}$/i.test(key)) {
      // 按 UID 搜索
      chatApi.searchUser(key.toUpperCase(), myId).then(res => {
        this.setData({ results: res.success ? res.data : [], searching: false });
      }).catch(err => {
        console.error('搜索失败:', err);
        this.setData({ searching: false, results: [] });
      });
    } else {
      // 按昵称搜索（仍需云函数支持，先走 searchUser 接口，后续可扩展）
      // searchUser 目前只按 UID 精确匹配，昵称搜索需要新增云函数 action
      // 暂时提示用户使用 UID 搜索
      chatApi.searchUser(key, myId).then(res => {
        this.setData({ results: res.success ? res.data : [], searching: false });
      }).catch(err => {
        console.error('搜索失败:', err);
        this.setData({ searching: false, results: [] });
      });
    }
  },

  sendRequest: function(e) {
    const myInfo = wx.getStorageSync('userInfo') || {};
    if (!myInfo.userId) {
      wx.showToast({ title: '请先登录', icon: 'none' });
      return;
    }

    const { id, name, avatar } = e.currentTarget.dataset;

    wx.showModal({
      title: '发送好友申请',
      content: `向 ${name} 发送好友申请？`,
      success: (res) => {
        if (res.confirm) {
          chatApi.sendFriendRequest(
            myInfo.userId,
            myInfo.nickName || myInfo.nickname || myInfo.name || '用户',
            myInfo.avatarUrl || myInfo.avatar || '',
            id
          ).then(res => {
            if (res.success) {
              wx.showToast({ title: '申请已发送', icon: 'success' });
              // 更新列表状态显示"等待对方"
              const updated = this.data.results.map(r =>
                r._id === id ? { ...r, requestPending: true } : r
              );
              this.setData({ results: updated });
            } else {
              wx.showToast({ title: res.errMsg || '发送失败', icon: 'none' });
            }
          }).catch(err => {
            console.error('发送申请失败:', err);
            wx.showToast({ title: '发送失败', icon: 'none' });
          });
        }
      }
    });
  }
});
