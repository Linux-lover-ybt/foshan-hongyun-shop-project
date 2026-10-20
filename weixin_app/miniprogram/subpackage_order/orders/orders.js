// orders.js
Page({

  data: {
    currentTab: 'all',
    tabs: [
      { key: 'all', label: '全部' },
      { key: 'pending', label: '待付款' },
      { key: 'paid', label: '待发货' },
      { key: 'shipped', label: '待收货' },
      { key: 'aftersale', label: '售后' }
    ],
    orders: [],
    filteredOrders: []
  },

  onLoad: function (options) {
    this.loadOrders();
  },

  onShow: function () {
    this.loadOrders();
  },

  loadOrders: function() {
    const orders = wx.getStorageSync('purchaseOrders') || [];
    
    const formattedOrders = orders.map(order => ({
      ...order,
      status: order.status || 'pending',
      statusText: this.getStatusText(order.status || 'pending'),
      createTime: order.createTime || new Date().toLocaleString()
    }));

    this.setData({
      orders: formattedOrders
    }, () => {
      this.filterOrders();
    });
  },

  getStatusText: function(status) {
    const statusMap = {
      'pending': '待付款',
      'paid': '待发货',
      'shipped': '待收货',
      'completed': '已完成',
      'aftersale': '售后中'
    };
    return statusMap[status] || '待付款';
  },

  switchTab: function(e) {
    const tab = e.currentTarget.dataset.tab;
    this.setData({
      currentTab: tab
    }, () => {
      this.filterOrders();
    });
  },

  filterOrders: function() {
    const { orders, currentTab } = this.data;
    
    if (currentTab === 'all') {
      this.setData({
        filteredOrders: orders
      });
    } else {
      const filtered = orders.filter(order => order.status === currentTab);
      this.setData({
        filteredOrders: filtered
      });
    }
  },

  goToPay: function(e) {
    const orderId = e.currentTarget.dataset.id;
    wx.showModal({
      title: '确认支付',
      content: '是否确认支付该订单？',
      success: (res) => {
        if (res.confirm) {
          this.updateOrderStatus(orderId, 'paid');
        }
      }
    });
  },

  confirmReceive: function(e) {
    const orderId = e.currentTarget.dataset.id;
    wx.showModal({
      title: '确认收货',
      content: '确认已收到商品？',
      success: (res) => {
        if (res.confirm) {
          this.updateOrderStatus(orderId, 'completed');
        }
      }
    });
  },

  applyAfterSale: function(e) {
    const orderId = e.currentTarget.dataset.id;
    wx.showModal({
      title: '申请售后',
      content: '确认申请售后服务？',
      success: (res) => {
        if (res.confirm) {
          this.updateOrderStatus(orderId, 'aftersale');
        }
      }
    });
  },

  updateOrderStatus: function(orderId, status) {
    const orders = wx.getStorageSync('purchaseOrders') || [];
    const updatedOrders = orders.map(order => {
      if (order.id === orderId) {
        return Object.assign({}, order, { status: status });
      }
      return order;
    });
    
    wx.setStorageSync('purchaseOrders', updatedOrders);
    
    wx.showToast({
      title: '操作成功',
      icon: 'success'
    });
    
    this.loadOrders();
  },

  goBack: function() {
    wx.navigateBack();
  }
});
