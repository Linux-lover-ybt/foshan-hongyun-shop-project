// pages/my-orders/my-orders.js - 我的订单（含物流）
const shopApi = require('../../api/shop');

const STATUS_MAP = {
  pending: { text: '待付款', color: '#ff6b6b' },
  paid: { text: '已付款', color: '#1890ff' },
  shipped: { text: '运输中', color: '#52c41a' },
  received: { text: '已收货', color: '#999' },
  cancelled: { text: '已取消', color: '#999' }
};

Page({
  data: {
    activeTab: 'all',
    orders: [],
    loading: false,
    showLogistics: false,
    logisticsData: {}
  },

  getUserId: function () {
    const userInfo = wx.getStorageSync('userInfo');
    return userInfo && userInfo.userId ? userInfo.userId : '';
  },

  onLoad: function () {
    this.loadOrders();
  },

  onShow: function () {
    this.loadOrders();
  },

  switchTab: function (e) {
    const tab = e.currentTarget.dataset.tab;
    this.setData({ activeTab: tab });
    this.loadOrders();
  },

  loadOrders: function () {
    const userId = this.getUserId();
    if (!userId) {
      wx.showToast({ title: '请先登录', icon: 'none' });
      return;
    }

    this.setData({ loading: true });
    const status = this.data.activeTab === 'all' ? '' : this.data.activeTab;

    shopApi.getOrders(userId, status).then(res => {
      if (res.success) {
        const orders = res.data.map(order => {
          const statusInfo = STATUS_MAP[order.status] || { text: '未知', color: '#999' };
          const itemTotal = order.items ? order.items.reduce((sum, item) => sum + item.price * item.quantity, 0) : 0;
          return Object.assign({}, order, {
            statusText: statusInfo.text,
            statusColor: statusInfo.color,
            itemTotal: itemTotal.toFixed(2),
            createTimeStr: order.createTime ? this.formatTime(order.createTime) : ''
          });
        });
        this.setData({ orders, loading: false });
      }
    }).catch(err => {
      console.error('加载订单失败:', err);
      this.setData({ loading: false });
      wx.showToast({ title: '加载失败', icon: 'none' });
    });
  },

  formatTime: function (date) {
    if (!date) return '';
    const d = new Date(date);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
  },

  // 查看物流
  viewLogistics: function (e) {
    const orderId = e.currentTarget.dataset.id;
    const userId = this.getUserId();

    shopApi.getLogistics(userId, orderId).then(res => {
      if (res.success) {
        this.setData({
          showLogistics: true,
          logisticsData: res.data
        });
      }
    }).catch(err => {
      console.error('获取物流失败:', err);
      wx.showToast({ title: '获取物流失败', icon: 'none' });
    });
  },

  closeLogistics: function () {
    this.setData({ showLogistics: false });
  },

  // 取消订单
  cancelOrder: function (e) {
    const orderId = e.currentTarget.dataset.id;
    const userId = this.getUserId();

    wx.showModal({
      title: '提示',
      content: '确定要取消这个订单吗？',
      success: (res) => {
        if (res.confirm) {
          shopApi.cancelOrder(userId, orderId).then(() => {
            wx.showToast({ title: '已取消', icon: 'success' });
            this.loadOrders();
          });
        }
      }
    });
  },

  // 确认收货
  confirmReceive: function (e) {
    const orderId = e.currentTarget.dataset.id;
    const userId = this.getUserId();

    wx.showModal({
      title: '提示',
      content: '确认已收到商品？',
      success: (res) => {
        if (res.confirm) {
          shopApi.confirmReceive(userId, orderId).then(() => {
            wx.showToast({ title: '已确认收货', icon: 'success' });
            this.loadOrders();
          });
        }
      }
    });
  },

  // 去付款（模拟支付）
  goToPay: function (e) {
    const orderId = e.currentTarget.dataset.id;
    const userId = this.getUserId();

    wx.showModal({
      title: '确认支付',
      content: '是否确认支付该订单？',
      success: (res) => {
        if (res.confirm) {
          wx.showLoading({ title: '支付中...' });
          shopApi.payOrder(userId, orderId).then(() => {
            wx.hideLoading();
            wx.showToast({ title: '支付成功', icon: 'success' });
            this.loadOrders();
          }).catch(err => {
            wx.hideLoading();
            console.error('支付失败:', err);
            wx.showToast({ title: '支付失败', icon: 'none' });
          });
        }
      }
    });
  }
});
