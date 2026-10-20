const chatApi = require('../../api/chat');

Page({
  data: {
    unreadCount: 0
  },

  onLoad: function (options) {
    // 页面加载时的初始化逻辑
  },

  onReady: function () {
    // 页面初次渲染完成
  },

  onShow: function () {
    // 页面显示
    this.loadUnreadCount();
  },

  onHide: function () {
    // 页面隐藏
  },

  onUnload: function () {
    // 页面卸载
  },

  onPullDownRefresh: function () {
    // 下拉刷新
  },

  onReachBottom: function () {
    // 上拉触底
  },

  onShareAppMessage: function () {
    // 分享配置
    return {
      title: '佛山红韵 - 传承红色基因',
      path: '/pages/index/index'
    }
  },

  // 跳转到互动中心
  goToRedBase: function() {
    wx.navigateTo({
      url: '/pages/red-base/red-base'
    });
  },

  // 跳转到内容分享
  goToForum: function() {
    wx.navigateTo({
      url: '/subpackage_forum/forum/forum'
    });
  },

  // 跳转到消息（小微信）
  goToMessages: function() {
    wx.navigateTo({
      url: '/subpackage_chat/messages/messages'
    });
  },

  // 跳转到文创商城（导航页）
  goToCulture: function() {
    wx.switchTab({
      url: '/pages/culture/culture'
    });
  },

  // 加载未读消息数
  loadUnreadCount: function() {
    const userInfo = wx.getStorageSync('userInfo');
    if (userInfo && userInfo.userId) {
      chatApi.getUnreadCount(userInfo.userId).then(res => {
        if (res.success) {
          this.setData({ unreadCount: res.count });
        }
      }).catch(() => {});
    }
  },

  // 跳转到文创商城
  goToShop: function() {
    wx.switchTab({
      url: '/pages/culture/culture'
    });
  },

  // 跳转到任务中心
  goToTasks: function() {
    wx.navigateTo({
      url: '/subpackage_task/tasks/tasks'
    });
  },

  // 查看全部
  goToAll: function() {
    wx.switchTab({
      url: '/pages/mine/mine'
    });
  }
})