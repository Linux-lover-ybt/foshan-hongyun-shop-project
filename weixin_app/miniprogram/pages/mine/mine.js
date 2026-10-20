const pointsApi = require('../../api/points');
const shopApi = require('../../api/shop');
const userApi = require('../../api/user');

Page({
  data: {
    isLoggedIn: false,
    userInfo: {},
    points: 0,
    coupons: 0,
    orderCount: 0,
    pendingOrderCount: 0,
    shippedOrderCount: 0,
    showPointsLog: false,
    pointsLog: [],
    hasMbtiResult: false,
    mbtiData: {}
  },

  onShow() {
    const token = wx.getStorageSync('token');
    const userInfo = wx.getStorageSync('userInfo');
    if (!token || !userInfo) {
      this.setData({
        isLoggedIn: false,
        userInfo: {},
        points: 0,
        coupons: 0,
        pointsLog: []
      });
      return;
    }

    this.setData({
      isLoggedIn: true,
      userInfo
    });
    if (!userInfo.uid) this.fetchUidFromCloud(userInfo.userId);
    this.loadUserPoints();
    this.loadPointsLog();
    this.loadMbtiResult();
    this.loadCouponCount();
    this.loadOrderCount();
  },

  fetchUidFromCloud(userId) {
    if (!userId) return;
    userApi.getUserInfo(userId).then(res => {
      if (!res.success || !res.data.uid) return;
      const userInfo = wx.getStorageSync('userInfo') || {};
      userInfo.uid = res.data.uid;
      wx.setStorageSync('userInfo', userInfo);
      this.setData({ 'userInfo.uid': res.data.uid });
    }).catch(() => {});
  },

  goToLogin() {
    wx.navigateTo({ url: '/pages/login/login' });
  },

  handleLogout() {
    wx.showModal({
      title: '提示',
      content: '确定要退出登录吗？',
      success: (res) => {
        if (!res.confirm) return;
        wx.removeStorageSync('token');
        wx.removeStorageSync('userInfo');
        wx.removeStorageSync('isLoggedIn');
        const app = getApp();
        if (app) app.globalData.userInfo = null;
        this.setData({
          isLoggedIn: false,
          userInfo: {},
          points: 0,
          coupons: 0,
          pointsLog: []
        });
        wx.showToast({ title: '已退出', icon: 'success' });
      }
    });
  },

  loadUserPoints() {
    const userInfo = wx.getStorageSync('userInfo');
    if (!userInfo || !userInfo.userId) return;
    pointsApi.getPoints(userInfo.userId).then(res => {
      if (res.success) this.setData({ points: res.data.points });
    }).catch(() => {});
  },

  loadPointsLog() {
    const userInfo = wx.getStorageSync('userInfo');
    if (!userInfo || !userInfo.userId) return;
    pointsApi.getPointsLog().then(res => {
      if (!res.success) return;
      const pointsLog = res.data.slice(0, 20).map(item => ({
        source: item.reason || '积分变动',
        time: item.createTime || '',
        points: item.points
      }));
      this.setData({ pointsLog });
    }).catch(() => {});
  },

  togglePointsLog() {
    this.setData({ showPointsLog: !this.data.showPointsLog });
  },

  goToPoints() {
    this.setData({ showPointsLog: true });
  },

  goToCoupons() {
    wx.switchTab({ url: '/pages/culture/culture' });
  },

  goToOrders() {
    wx.navigateTo({ url: '/pages/my-orders/my-orders' });
  },

  goToShop() {
    wx.navigateTo({ url: '/pages/shop/shop' });
  },

  goToTasks() {
    wx.navigateTo({ url: '/subpackage_task/tasks/tasks' });
  },

  goToPosts() {
    wx.navigateTo({ url: '/subpackage_forum/my-posts/my-posts' });
  },

  goToUserManage() {
    wx.navigateTo({ url: '/subpackage_forum/user-manage/user-manage' });
  },

  goToFeedback() {
    wx.navigateTo({ url: '/pages/feedback/feedback' });
  },

  goToHelp() {
    wx.navigateTo({ url: '/pages/help/help' });
  },

  loadMbtiResult() {
    const userInfo = wx.getStorageSync('userInfo');
    if (!userInfo || !userInfo.userId) return;
    const results = wx.getStorageSync('mbtiResults') || {};
    const data = results[userInfo.userId];
    if (!data) {
      this.setData({ hasMbtiResult: false, mbtiData: {} });
      return;
    }
    this.setData({
      hasMbtiResult: true,
      mbtiData: {
        mbtiType: data.mbtiType,
        mbtiName: data.mbtiName,
        figureName: data.figureName,
        figureDesc: data.figureDesc,
        figureTraits: data.figureTraits || [],
        figureBg: data.figureBg || 'linear-gradient(135deg, #667eea, #764ba2)',
        figureIcon: data.figureIcon || ''
      }
    });
  },

  goToMbtiTest() {
    wx.navigateTo({ url: '/pages/mbti-test/mbti-test' });
  },

  loadCouponCount() {
    const userInfo = wx.getStorageSync('userInfo');
    if (!userInfo || !userInfo.userId) return;
    shopApi.getMyCoupons(userInfo.userId).then(res => {
      if (res.success) this.setData({ coupons: res.data.length });
    }).catch(() => {});
  },

  loadOrderCount() {
    const userInfo = wx.getStorageSync('userInfo');
    if (!userInfo || !userInfo.userId) return;
    shopApi.getOrders(userInfo.userId).then(res => {
      if (!res.success) return;
      const orders = res.data;
      this.setData({
        orderCount: orders.length,
        pendingOrderCount: orders.filter(order => order.status === 'pending').length,
        shippedOrderCount: orders.filter(order => order.status === 'shipped').length
      });
    }).catch(() => {});
  },

  copyUid() {
    const uid = this.data.userInfo.uid;
    if (!uid) return;
    wx.setClipboardData({
      data: uid,
      success: () => wx.showToast({ title: 'UID已复制', icon: 'success' })
    });
  }
});
