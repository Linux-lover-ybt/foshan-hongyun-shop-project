// pages/product-detail/product-detail.js
const productsUtil = require('../../utils/products.js');
const shopApi = require('../../api/shop');

Page({
  data: {
    id: 0,
    product: null,
    quantity: 1,
    selectedSpecs: {},
    showSpecPopup: false,
    specMode: 'cart',
    tabActive: 'detail',
    cartCount: 0,
    isFavorite: false,
    currentImgIndex: 0
  },

  getUserId: function () {
    const userInfo = wx.getStorageSync('userInfo');
    return userInfo && userInfo.userId ? userInfo.userId : '';
  },

  onLoad: function (options) {
    const id = parseInt(options.id) || 0;
    this.setData({ id });
    this.loadProduct(id);
    this.loadCartCount();
    this.checkFavorite(id);
  },

  loadProduct: function (id) {
    var that = this;
    var product = productsUtil.getProductById(id);
    if (!product) {
      wx.showToast({ title: '商品不存在', icon: 'none' });
      setTimeout(function() { wx.navigateBack(); }, 1500);
      return;
    }
    // 将 cloud:// 转为 HTTPS CDN 链接
    productsUtil.resolveCDNUrls([product]).then(function(cdnProducts) {
      if (cdnProducts && cdnProducts.length > 0) {
        that.initProductData(cdnProducts[0]);
      } else {
        that.initProductData(product);
      }
    }).catch(function(err) {
      console.error('CDN转换失败:', err);
      that.initProductData(product);
    });
  },

  initProductData: function(product) {
    var selectedSpecs = {};
    if (product.specs) {
      product.specs.forEach(function(spec) {
        selectedSpecs[spec.name] = spec.values[0];
      });
    }

    if (product.originalPrice > product.price) {
      product.discountText = (product.price / product.originalPrice * 10).toFixed(1) + '折';
    }
    product.earnPoints = Math.floor(product.price);

    var productImageList = product.images || [product.image];
    var productImageCount = productImageList.length;
    var productReviewCount = product.reviews ? product.reviews.length : 0;

    var specText = Object.values(selectedSpecs).join('/');
    this.setData({ product: product, selectedSpecs: selectedSpecs, specText: specText, productImageList: productImageList, productImageCount: productImageCount, productReviewCount: productReviewCount });
  },

  loadCartCount: function () {
    const userId = this.getUserId();
    if (userId) {
      shopApi.getCart(userId).then(res => {
        if (res.success) {
          this.setData({ cartCount: res.data.length });
        }
      }).catch(() => {
        const cart = wx.getStorageSync('cart') || [];
        this.setData({ cartCount: cart.length });
      });
    } else {
      const cart = wx.getStorageSync('cart') || [];
      this.setData({ cartCount: cart.length });
    }
  },

  checkFavorite: function (id) {
    const favorites = wx.getStorageSync('favorites') || [];
    this.setData({ isFavorite: favorites.includes(id) });
  },

  onSwiperChange: function (e) {
    this.setData({ currentImgIndex: e.detail.current });
  },

  openSpecPopup: function (e) {
    const mode = e.currentTarget.dataset.mode || 'cart';
    this.setData({ showSpecPopup: true, specMode: mode });
  },

  closeSpecPopup: function () {
    this.setData({ showSpecPopup: false });
  },

  selectSpec: function (e) {
    var name = e.currentTarget.dataset.name;
    var value = e.currentTarget.dataset.value;
    var selectedSpecs = Object.assign({}, this.data.selectedSpecs);
    selectedSpecs[name] = value;
    var specText = Object.values(selectedSpecs).join('/');
    this.setData({ selectedSpecs: selectedSpecs, specText: specText });
  },

  decreaseQty: function () {
    if (this.data.quantity > 1) {
      this.setData({ quantity: this.data.quantity - 1 });
    }
  },

  increaseQty: function () {
    const stock = this.data.product ? this.data.product.stock : 99;
    if (this.data.quantity < stock) {
      this.setData({ quantity: this.data.quantity + 1 });
    }
  },

  inputQty: function (e) {
    let val = parseInt(e.detail.value) || 1;
    if (val < 1) val = 1;
    const stock = this.data.product ? this.data.product.stock : 99;
    if (val > stock) val = stock;
    this.setData({ quantity: val });
  },

  // 加入购物车（云端）
  addToCart: function () {
    const { product, quantity, selectedSpecs } = this.data;
    if (!product) return;

    const specKey = Object.entries(selectedSpecs).map(([k, v]) => `${k}:${v}`).join('|');
    const specText = Object.values(selectedSpecs).join('/');
    const userId = this.getUserId();

    if (userId) {
      shopApi.addToCart(userId, {
        id: product.id,
        name: product.name,
        image: product.image,
        price: product.price,
        originalPrice: product.originalPrice,
        specKey,
        specText,
        quantity
      }).then(res => {
        if (res.success) {
          this.setData({ cartCount: this.data.cartCount + 1, showSpecPopup: false });
          wx.showToast({ title: '已加入购物车', icon: 'success' });
        }
      }).catch(() => {
        wx.showToast({ title: '网络错误', icon: 'none' });
      });
    } else {
      // 未登录降级到本地
      const cart = wx.getStorageSync('cart') || [];
      const idx = cart.findIndex(item => item.id === product.id && item.specKey === specKey);
      if (idx > -1) {
        cart[idx].quantity += quantity;
      } else {
        cart.push(Object.assign({}, product, { quantity: quantity, selected: true, specKey: specKey, specText: specText, addTime: Date.now() }));
      }
      wx.setStorageSync('cart', cart);
      this.setData({ cartCount: cart.length, showSpecPopup: false });
      wx.showToast({ title: '已加入购物车', icon: 'success' });
    }
  },

  // 立即购买（云端创建订单）
  buyNow: function () {
    const { product, quantity, selectedSpecs } = this.data;
    if (!product) return;

    const specKey = Object.entries(selectedSpecs).map(([k, v]) => `${k}:${v}`).join('|');
    const specText = Object.values(selectedSpecs).join('/');
    const userId = this.getUserId();

    const orderItem = {
      id: product.id,
      name: product.name,
      image: product.image,
      price: product.price,
      originalPrice: product.originalPrice,
      specKey,
      specText,
      quantity
    };

    if (userId) {
      // 先把商品暂存，跳转到结算页（结算页会调用 createOrder）
      wx.setStorageSync('orderItems', [orderItem]);
      this.setData({ showSpecPopup: false });
      wx.navigateTo({ url: '/subpackage_order/payment/payment?from=buy' });
    } else {
      wx.setStorageSync('orderItems', [orderItem]);
      this.setData({ showSpecPopup: false });
      wx.navigateTo({ url: '/subpackage_order/payment/payment?from=buy' });
    }
  },

  confirmSpec: function () {
    if (this.data.specMode === 'cart') {
      this.addToCart();
    } else {
      this.buyNow();
    }
  },

  toggleFavorite: function () {
    const { id, isFavorite } = this.data;
    let favorites = wx.getStorageSync('favorites') || [];
    if (isFavorite) {
      favorites = favorites.filter(f => f !== id);
    } else {
      favorites.push(id);
    }
    wx.setStorageSync('favorites', favorites);
    this.setData({ isFavorite: !isFavorite });
    wx.showToast({ title: isFavorite ? '已取消收藏' : '已收藏', icon: 'success' });
  },

  goToCart: function () {
    wx.navigateTo({ url: '/pages/cart/cart' });
  },

  switchTab: function (e) {
    this.setData({ tabActive: e.currentTarget.dataset.tab });
  },

  onShareAppMessage: function () {
    const product = this.data.product;
    return {
      title: product ? product.name : '佛山文创好物',
      path: `/pages/product-detail/product-detail?id=${this.data.id}`
    };
  }
});
