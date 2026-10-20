App({
  onLaunch: function() {
    const logs = wx.getStorageSync('logs') || [];
    logs.unshift(Date.now());
    wx.setStorageSync('logs', logs.slice(0, 50));
    this.checkLoginStatus();
  },

  checkLoginStatus: function() {
    const userInfo = wx.getStorageSync('userInfo');
    if (!userInfo || !userInfo.token) {
      this.globalData.userInfo = null;
      return;
    }
    this.globalData.userInfo = userInfo;
  },

  globalData: {
    userInfo: null
  }
});
