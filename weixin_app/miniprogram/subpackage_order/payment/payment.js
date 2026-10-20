const pointsUtil = require('../../utils/points.js');
const pointsApi = require('../../api/points');
const productsUtil = require('../../utils/products.js');
const shopApi = require('../../api/shop');

Page({
  data: {
    // 订单商品
    orderProducts: [],
    
    // 订单信息
    orderInfo: {
      originalPrice: 0,
      discount: 0,
      totalPrice: 0
    },
    
    // 用户信息
    userInfo: {
      availablePoints: 0
    },
    
    // 支付方式
    paymentMethods: [
      {
        id: 'rmb_only',
        name: '人民币支付',
        description: '仅使用人民币支付',
        icon: '/images/icons/wallet.svg'
      },
      {
        id: 'points_only',
        name: '积分支付',
        description: '仅使用积分支付',
        icon: '/images/icons/gift.svg'
      },
      {
        id: 'mixed',
        name: '积分+人民币',
        description: '积分抵扣部分，剩余用人民币',
        icon: '/images/icons/exchange.svg'
      }
    ],
    
    // 选中的支付方式
    selectedPaymentMethod: 'rmb_only',
    
    // 支付明细
    paymentDetail: {
      pointsUsed: 0,
      pointsDiscount: 0,
      needToPay: 0
    },
    
    // 提示信息
    showInsufficientWarning: false,
    warningMessage: '',
    
    // 提交状态
    submitting: false,
    
    // 提示弹窗
    toast: {
      show: false,
      type: '',
      message: ''
    }
  },

  onLoad: function(options) {
    console.log('=== 支付页面 onLoad 开始 ===');
    console.log('参数:', options);

    // 获取传入的商品信息
    this.loadOrderProducts(options);
    // 加载用户积分（内部会调用 calculatePaymentDetail）
    this.loadUserInfo();
    console.log('=== 支付页面 onLoad 完成 ===');
  },

  // 加载订单商品
  loadOrderProducts: function(options) {
    console.log('开始加载订单商品，参数:', options);
    try {
      let products = [];
      
      if (options.productId) {
        // 单个商品
        const product = productsUtil.getProductById(parseInt(options.productId));
        if (product) {
          products.push({
            ...product,
            quantity: parseInt(options.quantity) || 1
          });
          console.log('加载单个商品成功:', product);
        } else {
          console.error('商品不存在，ID:', options.productId);
          this.showToast('error', '商品不存在');
          setTimeout(() => { wx.navigateBack(); }, 1500);
          return;
        }
      } else if (options.products) {
        // 多个商品（JSON格式）
        const productsData = JSON.parse(decodeURIComponent(options.products));
        products = productsData.map(item => {
          const product = productsUtil.getProductById(item.id);
          return { ...product, quantity: item.quantity || 1 };
        });
        console.log('加载多个商品成功:', products);
      } else if (options.from === 'cart' || options.from === 'buy') {
        // 从购物车结算 或 立即购买 - 从本地存储读取选中商品
        const orderItems = wx.getStorageSync('orderItems') || [];
        console.log('从本地存储读取商品:', orderItems, '来源:', options.from);

        if (orderItems.length > 0) {
          products = orderItems.map(item => ({
            id: item.id || item.productId,
            name: item.name,
            image: item.image,
            price: parseFloat(item.price),
            originalPrice: parseFloat(item.originalPrice) || parseFloat(item.price),
            specText: item.specText || '',
            quantity: parseInt(item.quantity) || 1
          }));
          console.log('商品转换成功:', products);
          // 清除临时存储
          wx.removeStorageSync('orderItems');
        }
      }
      
      if (products.length === 0) {
        console.error('没有加载到商品');
        this.showToast('error', '订单信息无效');
        setTimeout(() => { wx.navigateBack(); }, 1500);
        return;
      }
      
      // 计算订单价格
      const originalPrice = products.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      const discount = 0; // 可根据实际情况计算优惠
      const totalPrice = originalPrice - discount;
      
      this.setData({
        orderProducts: products,
        orderInfo: {
          originalPrice: originalPrice.toFixed(2),
          discount: discount.toFixed(2),
          totalPrice: totalPrice.toFixed(2)
        }
      });
      
      console.log('订单信息:', this.data.orderInfo);
    } catch (error) {
      console.error('加载订单商品失败:', error);
      this.showToast('error', '加载订单信息失败');
      setTimeout(() => { wx.navigateBack(); }, 1500);
    }
  },

  // 加载用户信息（从云端获取积分）
  loadUserInfo: function() {
    const userInfo = wx.getStorageSync('userInfo');
    if (userInfo && userInfo.userId) {
      pointsApi.getPoints(userInfo.userId).then(res => {
        if (res.success) {
          this.setData({
            'userInfo.availablePoints': res.data.points || 0
          });
          this.calculatePaymentDetail();
          console.log('云端积分:', res.data.points);
        }
      }).catch(err => {
        console.error('获取云端积分失败，使用本地积分:', err);
        const points = pointsUtil.getPoints();
        this.setData({ 'userInfo.availablePoints': points });
        this.calculatePaymentDetail();
      });
    } else {
      // 未登录用本地积分
      const points = pointsUtil.getPoints();
      this.setData({ 'userInfo.availablePoints': points });
      this.calculatePaymentDetail();
    }
  },

  // 选择支付方式
  selectPaymentMethod: function(e) {
    const method = e.currentTarget.dataset.method;
    console.log('选择支付方式:', method);
    this.setData({
      selectedPaymentMethod: method
    });
    this.calculatePaymentDetail();
  },

  // 计算支付明细
  calculatePaymentDetail: function() {
    const method = this.data.selectedPaymentMethod;
    const totalPrice = parseFloat(this.data.orderInfo.totalPrice);
    const availablePoints = this.data.userInfo.availablePoints;
    
    let pointsUsed = 0;
    let pointsDiscount = 0;
    let needToPay = 0;
    let showWarning = false;
    let warningMessage = '';
    
    // 积分兑换比例：100积分 = ¥1
    const POINTS_TO_RMB_RATIO = 100;
    const MAX_POINTS_PERCENT = 0.5; // 最多抵扣50%
    
    switch (method) {
      case 'rmb_only':
        // 只用人民币支付
        needToPay = totalPrice;
        console.log('人民币支付，需支付:', needToPay);
        break;
        
      case 'points_only':
        // 只用积分支付
        const neededPoints = totalPrice * POINTS_TO_RMB_RATIO;
        if (availablePoints >= neededPoints) {
          pointsUsed = neededPoints;
          pointsDiscount = totalPrice;
          needToPay = 0;
          console.log('积分支付，使用积分:', pointsUsed);
        } else {
          showWarning = true;
          warningMessage = `积分不足！需要 ${neededPoints} 积分，当前只有 ${availablePoints} 积分`;
          pointsUsed = 0;
          pointsDiscount = 0;
          needToPay = totalPrice;
          console.log('积分不足，需要:', neededPoints, '拥有:', availablePoints);
        }
        break;
        
      case 'mixed':
        // 积分+人民币混合支付
        const maxPointsDiscount = totalPrice * MAX_POINTS_PERCENT;
        const maxPointsCanUse = maxPointsDiscount * POINTS_TO_RMB_RATIO;
        
        if (availablePoints >= maxPointsCanUse) {
          // 积分足够，使用最大可抵扣
          pointsUsed = maxPointsCanUse;
          pointsDiscount = maxPointsDiscount;
          needToPay = totalPrice - maxPointsDiscount;
          console.log('混合支付，积分足够，使用积分:', pointsUsed, '需支付:', needToPay);
        } else {
          // 积分不足，使用全部积分
          pointsUsed = availablePoints;
          pointsDiscount = availablePoints / POINTS_TO_RMB_RATIO;
          needToPay = totalPrice - pointsDiscount;
          console.log('混合支付，积分不足，使用全部积分:', pointsUsed, '需支付:', needToPay);
        }
        break;
    }
    
    this.setData({
      paymentDetail: {
        pointsUsed: Math.round(pointsUsed),
        pointsDiscount: pointsDiscount.toFixed(2),
        needToPay: needToPay.toFixed(2)
      },
      showInsufficientWarning: showWarning,
      warningMessage: warningMessage
    });
  },

  // 取消支付
  onCancel: function() {
    wx.showModal({
      title: '提示',
      content: '确定要取消支付吗？',
      success: (res) => {
        if (res.confirm) {
          console.log('用户取消支付');
          wx.navigateBack();
        }
      }
    });
  },

  // 提交支付
  onSubmitPayment: function() {
    console.log('提交支付，当前状态:', {
      submitting: this.data.submitting,
      method: this.data.selectedPaymentMethod,
      detail: this.data.paymentDetail,
      warning: this.data.showInsufficientWarning
    });
    
    if (this.data.submitting) {
      console.log('正在提交中，重复点击被忽略');
      this.showToast('error', '正在处理中，请勿重复点击');
      return;
    }
    
    if (this.data.showInsufficientWarning) {
      console.log('余额不足，无法支付');
      this.showToast('error', '余额不足，无法支付');
      return;
    }
    
    const method = this.data.selectedPaymentMethod;
    const { pointsUsed, needToPay } = this.data.paymentDetail;
    
    // 验证
    if (method === 'points_only' && parseFloat(needToPay) > 0) {
      console.log('积分支付验证失败：积分不足');
      this.showToast('error', '积分不足');
      return;
    }
    
    this.setData({
      submitting: true
    });
    
    console.log('开始模拟支付流程，方法:', method);
    
    // 模拟支付：直接保存订单，不调用微信支付
    wx.showLoading({ title: '处理中...' });

    // 积分支付时从云端扣除积分
    const deductAndSave = () => {
      if (method === 'points_only' || method === 'mixed') {
        const userInfo = wx.getStorageSync('userInfo');
        if (userInfo && userInfo.userId) {
          // 云端扣减积分
          pointsApi.deductPoints(userInfo.userId, pointsUsed, '商品购买').then(res => {
            if (res.success) {
              // 同步本地积分
              pointsUtil.setPoints(res.data.points || 0);
              this.doSaveOrder(method, pointsUsed, parseFloat(needToPay));
              wx.hideLoading();
              this.showPaymentSuccess();
            } else {
              wx.hideLoading();
              this.setData({ submitting: false });
              this.showToast('error', res.errMsg || '积分扣除失败');
            }
          }).catch(err => {
            console.error('云端积分扣减异常:', err);
            wx.hideLoading();
            this.setData({ submitting: false });
            this.showToast('error', '积分扣除失败，请重试');
          });
        } else {
          // 未登录用本地积分
          const result = pointsUtil.deductPoints(pointsUsed, '商品购买');
          if (!result.success) {
            wx.hideLoading();
            this.setData({ submitting: false });
            this.showToast('error', result.message || '积分不足');
            return;
          }
          this.doSaveOrder(method, pointsUsed, parseFloat(needToPay));
          wx.hideLoading();
          this.showPaymentSuccess();
        }
      } else {
        // 纯人民币支付，不扣积分，直接保存订单
        this.doSaveOrder(method, pointsUsed, parseFloat(needToPay));
        wx.hideLoading();
        this.showPaymentSuccess();
      }
    };

    deductAndSave();
  },

  // 保存订单（本地 + 云端）
  doSaveOrder: function(paymentMethod, pointsUsed, rmbAmount) {
    const currentUser = wx.getStorageSync('userInfo') || {};
    const items = this.data.orderProducts.map(function(item) {
      return {
        id: item.id,
        name: item.name,
        image: item.image,
        price: parseFloat(item.price),
        originalPrice: parseFloat(item.originalPrice) || parseFloat(item.price),
        specText: item.specText || '',
        quantity: item.quantity
      };
    });
    shopApi.createOrder(currentUser.userId || '', {
      items,
      totalPrice: parseFloat(this.data.orderInfo.totalPrice),
      discountAmount: 0,
      actualPrice: rmbAmount,
      paymentMethod: paymentMethod === 'points_only' ? 'points' : paymentMethod === 'mixed' ? 'mixed' : 'wechat',
      pointsUsed,
      status: 'paid'
    });
    wx.setStorageSync('cart', []);
    return;

    console.log('保存订单，方式:', paymentMethod, '积分:', pointsUsed, '金额:', rmbAmount);
    
    const userInfo = wx.getStorageSync('userInfo');
    
    const orderData = {
      products: this.data.orderProducts.map(item => ({
        id: item.id,
        name: item.name,
        image: item.image,
        price: parseFloat(item.price),
        originalPrice: parseFloat(item.originalPrice) || parseFloat(item.price),
        quantity: item.quantity
      })),
      paymentMethod: paymentMethod,
      pointsUsed: pointsUsed,
      rmbAmount: rmbAmount,
      totalAmount: (pointsUsed / 100 + rmbAmount).toFixed(2),
      timestamp: new Date().getTime(),
      time: this.formatTime(),
      status: 'paid'
    };

    // 本地存储备份
    const orders = wx.getStorageSync('purchaseOrders') || [];
    const localOrder = Object.assign({}, orderData, { id: Date.now() });
    orders.unshift(localOrder);
    wx.setStorageSync('purchaseOrders', orders);

    // 云端存储
    if (userInfo && userInfo.userId) {
      // 清空云端购物车：先获取所有购物车项的ID
      const cartItemIds = [];
      shopApi.getCart(userInfo.userId).then(cartRes => {
        if (cartRes.success && cartRes.data) {
          cartRes.data.forEach(item => { cartItemIds.push(item._id); });
        }
      }).catch(() => {}).finally(() => {
        // 创建订单并清空购物车
        shopApi.createOrder(userInfo.userId, {
          items: orderData.products,
          totalPrice: parseFloat(orderData.totalAmount),
          discountAmount: 0,
          actualPrice: rmbAmount,
          paymentMethod: paymentMethod === 'points_only' ? 'points' : paymentMethod === 'mixed' ? 'mixed' : 'wechat',
          isPointsOrder: paymentMethod !== 'rmb_only',
          pointsUsed: pointsUsed,
          status: 'paid',
          cartItemIds: cartItemIds,
          remark: `积分支付:${pointsUsed} 人民币支付:${rmbAmount}`
        }).then(res => {
          console.log('订单已保存到云端:', res.data ? res.data.orderNo : 'success');
        }).catch(err => {
          console.error('云端订单保存失败（本地已有备份）:', err);
        });

        // 同步清空本地购物车缓存
        wx.setStorageSync('cart', []);
      });
    } else {
      console.log('未登录，订单仅存本地');
      // 未登录也清空本地购物车
      wx.setStorageSync('cart', []);
    }
  },

  // 支付成功处理
  showPaymentSuccess: function() {
    console.log('支付成功，准备跳转');
    this.setData({
      submitting: false
    });
    
    this.showToast('success', '支付成功！');
    
    setTimeout(() => {
      wx.redirectTo({
        url: '/pages/my-orders/my-orders',
        fail: () => {
          wx.navigateBack({ fail: () => { wx.switchTab({ url: '/pages/index/index' }); } });
        }
      });
    }, 2000);
  },

  // 显示提示
  showToast: function(type, message) {
    console.log('显示提示:', type, message);
    this.setData({
      toast: {
        show: true,
        type: type,
        message: message
      }
    });
    
    setTimeout(() => {
      this.setData({
        toast: {
          show: false,
          type: '',
          message: ''
        }
      });
    }, 2000);
  },

  // 格式化时间
  formatTime: function() {
    const d = new Date();
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const h = String(d.getHours()).padStart(2, '0');
    const min = String(d.getMinutes()).padStart(2, '0');
    return `${y}-${m}-${day} ${h}:${min}`;
  }
});
