// pages/cart/cart.js - 工业级购物车（云端版）
const shopApi = require('../../api/shop');

Page({
  data: {
    cartList: [],
    isAllSelected: false,
    selectedCount: 0,
    totalPrice: '0.00',
    totalOriginalPrice: '0.00',
    savedPrice: '0.00',
    editing: false,
    myCoupons: []
  },

  getUserId: function () {
    const userInfo = wx.getStorageSync('userInfo');
    return userInfo && userInfo.userId ? userInfo.userId : '';
  },

  onLoad: function () {
    this.loadCartData();
  },

  onShow: function () {
    this.loadCartData();
    this.loadCoupons();
  },

  loadCartData: function () {
    const userId = this.getUserId();
    if (userId) {
      // 从云端加载
      shopApi.getCart(userId).then(res => {
        if (res.success) {
          const cartList = res.data.map(item => {
            const origPrice = item.originalPrice || item.price * 1.3;
            const saved = Math.max(0, origPrice - item.price);
            return {
              ...item,
              id: item.productId,
              selected: item.selected !== undefined ? item.selected : true,
              originalPrice: origPrice,
              savedAmount: saved.toFixed(2)
            };
          });
          this.setData({ cartList });
          this.calculateTotal();
        }
      }).catch(() => {
        this.loadLocalCart();
      });
    } else {
      this.loadLocalCart();
    }
  },

  loadLocalCart: function () {
    let cart = wx.getStorageSync('cart') || [];
    cart = cart.map(item => {
      const origPrice = item.originalPrice || item.price * 1.3;
      const saved = Math.max(0, origPrice - item.price);
      return Object.assign({}, item, {
        selected: item.selected !== undefined ? item.selected : true,
        originalPrice: origPrice,
        savedAmount: saved.toFixed(2)
      });
    });
    this.setData({ cartList: cart });
    this.calculateTotal();
  },

  loadCoupons: function () {
    const userId = this.getUserId();
    if (userId) {
      shopApi.getMyCoupons(userId).then(res => {
        if (res.success) {
          this.setData({ myCoupons: res.data });
        }
      }).catch(() => {
        const myCoupons = wx.getStorageSync('myCoupons') || [];
        this.setData({ myCoupons: myCoupons.filter(c => !c.used) });
      });
    } else {
      const myCoupons = wx.getStorageSync('myCoupons') || [];
      this.setData({ myCoupons: myCoupons.filter(c => !c.used) });
    }
  },

  calculateTotal: function () {
    const cartList = this.data.cartList;
    let totalPrice = 0;
    let totalOriginalPrice = 0;
    let selectedCount = 0;

    cartList.forEach(item => {
      if (item.selected) {
        totalPrice += item.price * item.quantity;
        totalOriginalPrice += (item.originalPrice || item.price * 1.3) * item.quantity;
        selectedCount += item.quantity;
      }
    });

    const isAllSelected = cartList.length > 0 && cartList.every(item => item.selected);
    const savedPrice = Math.max(0, totalOriginalPrice - totalPrice);

    this.setData({
      totalPrice: totalPrice.toFixed(2),
      totalOriginalPrice: totalOriginalPrice.toFixed(2),
      savedPrice: savedPrice.toFixed(2),
      selectedCount,
      isAllSelected
    });
  },

  // 切换选择
  toggleSelect: function (e) {
    const index = e.currentTarget.dataset.index;
    const cartList = this.data.cartList;
    cartList[index].selected = !cartList[index].selected;
    this.setData({ cartList });
    this.calculateTotal();
  },

  toggleAllSelect: function () {
    const isAllSelected = !this.data.isAllSelected;
    const cartList = this.data.cartList.map(function(item) { return Object.assign({}, item, { selected: isAllSelected }); });
    this.setData({ cartList, isAllSelected });
    this.calculateTotal();
  },

  // 数量操作
  decreaseQuantity: function (e) {
    const index = e.currentTarget.dataset.index;
    const cartList = this.data.cartList;
    if (cartList[index].quantity > 1) {
      cartList[index].quantity--;
      this.setData({ cartList });
      this.updateCartItemCloud(cartList[index]);
      this.calculateTotal();
    } else {
      wx.showModal({
        title: '提示',
        content: '是否删除该商品？',
        success: (res) => { if (res.confirm) this.deleteItemByIndex(index); }
      });
    }
  },

  increaseQuantity: function (e) {
    const index = e.currentTarget.dataset.index;
    const cartList = this.data.cartList;
    cartList[index].quantity++;
    this.setData({ cartList });
    this.updateCartItemCloud(cartList[index]);
    this.calculateTotal();
  },

  inputQuantity: function (e) {
    const index = e.currentTarget.dataset.index;
    let value = parseInt(e.detail.value) || 1;
    if (value < 1) value = 1;
    if (value > 99) value = 99;
    const cartList = this.data.cartList;
    cartList[index].quantity = value;
    this.setData({ cartList });
    this.updateCartItemCloud(cartList[index]);
    this.calculateTotal();
  },

  // 同步数量到云端
  updateCartItemCloud: function (item) {
    const userId = this.getUserId();
    if (userId && item._id) {
      shopApi.updateCartItem(userId, item._id, item.quantity).catch(err => {
        console.error('更新购物车失败:', err);
      });
    } else {
      // 降级到本地
      wx.setStorageSync('cart', this.data.cartList);
    }
  },

  // 删除
  deleteItem: function (e) {
    const index = e.currentTarget.dataset.index;
    wx.showModal({
      title: '提示',
      content: '确定要删除这个商品吗？',
      success: (res) => { if (res.confirm) this.deleteItemByIndex(index); }
    });
  },

  deleteItemByIndex: function (index) {
    const cartList = this.data.cartList;
    const item = cartList[index];
    cartList.splice(index, 1);
    this.setData({ cartList });
    this.calculateTotal();

    // 从云端删除
    const userId = this.getUserId();
    if (userId && item._id) {
      shopApi.removeCartItems(userId, [item._id]).catch(err => {
        console.error('删除购物车项失败:', err);
      });
    } else {
      wx.setStorageSync('cart', cartList);
    }
    wx.showToast({ title: '已删除', icon: 'success' });
  },

  // 编辑模式
  toggleEdit: function () {
    this.setData({ editing: !this.data.editing });
  },

  // 批量删除
  batchDelete: function () {
    const selected = this.data.cartList.filter(item => item.selected);
    if (selected.length === 0) {
      wx.showToast({ title: '请选择商品', icon: 'none' });
      return;
    }
    wx.showModal({
      title: '提示',
      content: `确定删除${selected.length}件商品？`,
      success: (res) => {
        if (res.confirm) {
          const cartList = this.data.cartList.filter(item => !item.selected);
          const deletedIds = selected.filter(item => item._id).map(item => item._id);

          this.setData({ cartList });
          this.calculateTotal();

          // 从云端删除
          const userId = this.getUserId();
          if (userId && deletedIds.length > 0) {
            shopApi.removeCartItems(userId, deletedIds).catch(err => {
              console.error('批量删除失败:', err);
            });
          } else {
            wx.setStorageSync('cart', cartList);
          }
          wx.showToast({ title: '已删除', icon: 'success' });
        }
      }
    });
  },

  goToDetail: function (e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({ url: `/pages/product-detail/product-detail?id=${id}` });
  },

  goToSettle: function () {
    if (this.data.selectedCount === 0) {
      wx.showToast({ title: '请选择商品', icon: 'none' });
      return;
    }
    const selectedItems = this.data.cartList.filter(item => item.selected);
    wx.setStorageSync('orderItems', selectedItems);

    const userId = this.getUserId();
    if (userId) {
      // 传递选中的购物车项ID，用于下单后清除
      const cartItemIds = selectedItems.filter(item => item._id).map(item => item._id);
      wx.navigateTo({ url: `/subpackage_order/payment/payment?from=cart&cartItemIds=${cartItemIds.join(',')}` });
    } else {
      wx.navigateTo({ url: '/subpackage_order/payment/payment?from=cart' });
    }
  },

  goShopping: function () {
    wx.switchTab({ url: '/pages/culture/culture' });
  }
});
