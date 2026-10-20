// culture.js - 工业级电商文创页
const productsUtil = require('../../utils/products.js');
const shopApi = require('../../api/shop');
const pointsApi = require('../../api/points');

const IMG_HEIGHTS = [280, 320, 360, 400, 340, 300, 260, 380];

Page({
  data: {
    // 搜索
    searchKey: '',
    searchHistory: [],
    showSearchHistory: false,

    // 轮播
    banners: [
      { title: '佛山红韵文创', desc: '精品自研 匠心之作', bg: 'linear-gradient(135deg, #c41e3a 0%, #e54545 50%, #ff8a80 100%)' },
      { title: '新品首发', desc: '限时特惠 满99减20', bg: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a24 50%, #c41e3a 100%)' },
      { title: '积分兑换专区', desc: '好物兑换 包邮到家', bg: 'linear-gradient(135deg, #e54545 0%, #c41e3a 50%, #8e0000 100%)' }
    ],

    // 优惠券
    coupons: [],
    showCouponPopup: false,
    myCoupons: [],

    // 分类
    categoryIcons: [
      { name: '全部', icon: '/images/icons/home.svg', bg: '#fff5f5' },
      { name: '陶瓷陶艺', icon: '/images/icons/pottery.svg', bg: '#fff0e6' },
      { name: '手工艺品', icon: '/images/icons/craft.svg', bg: '#fffbe6' },
      { name: '文创画册', icon: '/images/icons/image.svg', bg: '#e6f7ff' },
      { name: '纪念品', icon: '/images/icons/medal.svg', bg: '#f0f5ff' },
      { name: '文具', icon: '/images/icons/note.svg', bg: '#f6ffed' },
      { name: '生活用品', icon: '/images/icons/coffee.svg', bg: '#fff9e6' }
    ],

    // 秒杀
    countdown: { h: '02', m: '30', s: '00' },
    flashProducts: [],

    // 新品推荐
    newProducts: [],

    // 热门排行
    hotProducts: [],

    // 商品列表
    products: [],
    filteredProducts: [],
    leftProducts: [],
    rightProducts: [],
    activeTab: 'all',
    priceOrder: 'desc',
    currentCategory: '全部',
    loading: false,
    noMore: true,
    showBackTop: false,

    // 购物车
    cartCount: 0,

    // 积分
    userPoints: 0
  },

  countdownTimer: null,

  getUserId: function () {
    const userInfo = wx.getStorageSync('userInfo');
    return userInfo && userInfo.userId ? userInfo.userId : '';
  },

  onLoad: function () {
    this.initData();
    this.startCountdown();
    this.loadCartCount();
    this.loadSearchHistory();
    this.loadUserPoints();
  },

  onShow: function () {
    this.loadCartCount();
    this.loadCloudCoupons();
    this.loadUserPoints();
  },

  onUnload: function () {
    if (this.countdownTimer) {
      clearInterval(this.countdownTimer);
    }
  },

  onPageScroll: function (e) {
    this.setData({ showBackTop: e.scrollTop > 600 });
  },

  // ========== 初始化 ==========
  initData: function () {
    var that = this;
    var allProducts = productsUtil.getAllProducts();

    // 先将所有 cloud:// 链接转为 HTTPS CDN 链接，再拆分列表
    productsUtil.resolveCDNUrls(allProducts).then(function(cdnProducts) {
      console.log('[CDN] 转换成功，示例图片URL:', cdnProducts[0] && cdnProducts[0].image);
      var enhanced = cdnProducts.map(function(p, i) {
        return Object.assign({}, p, {
          isHot: p.sales > 1000,
          comments: Math.floor(Math.random() * 500) + 50,
          imgHeight: IMG_HEIGHTS[i % IMG_HEIGHTS.length]
        });
      });

      // 从 CDN 转换后的数据中提取各列表
      var flashProducts = enhanced.filter(function(p) { return p.section === 'flash'; }).slice(0, 4).map(function(p) {
        return Object.assign({}, p, {
          flashPrice: (p.price * 0.7).toFixed(2),
          progress: Math.min(95, Math.floor(Math.random() * 40) + 55)
        });
      });

      var hotList = productsUtil.getHotProducts(6);
      // 用 CDN 转换后的数据覆盖 hotList 的图片
      var cdnHotList = hotList.map(function(h) {
        var cdnP = cdnProducts.find(function(c) { return c.id === h.id; });
        return cdnP ? Object.assign({}, h, { image: cdnP.image, images: cdnP.images }) : h;
      });

      var newList = productsUtil.getNewProducts(4);
      var cdnNewList = newList.map(function(n) {
        var cdnP = cdnProducts.find(function(c) { return c.id === n.id; });
        return cdnP ? Object.assign({}, n, { image: cdnP.image, images: cdnP.images }) : n;
      });

      that.setData({
        products: enhanced,
        flashProducts: flashProducts,
        hotProducts: cdnHotList,
        newProducts: cdnNewList
      });

      that.filterAndSplit();
      that.loadCloudCoupons();
    }).catch(function(err) {
      console.error('[CDN] 转换失败，错误:', err);
      console.log('[CDN] 使用原始cloud://链接，示例:', allProducts[0] && allProducts[0].image);
      var enhanced = allProducts.map(function(p, i) {
        return Object.assign({}, p, {
          isHot: p.sales > 1000,
          comments: Math.floor(Math.random() * 500) + 50,
          imgHeight: IMG_HEIGHTS[i % IMG_HEIGHTS.length]
        });
      });
      var flashProducts = enhanced.filter(function(p) { return p.section === 'flash'; }).slice(0, 4).map(function(p) {
        return Object.assign({}, p, {
          flashPrice: (p.price * 0.7).toFixed(2),
          progress: Math.min(95, Math.floor(Math.random() * 40) + 55)
        });
      });
      that.setData({
        products: enhanced,
        flashProducts: flashProducts,
        hotProducts: productsUtil.getHotProducts(6),
        newProducts: productsUtil.getNewProducts(4)
      });
      that.filterAndSplit();
      that.loadCloudCoupons();
    });
  },

  // ========== 云端优惠券 ==========
  loadCloudCoupons: function () {
    const userId = this.getUserId();
    shopApi.getCoupons(userId).then(res => {
      if (res.success) {
        const coupons = res.data;
        const claimedCount = coupons.filter(c => c.claimed).length;
        this.setData({
          coupons,
          couponSaveAmount: claimedCount > 0 ? claimedCount * 20 : 60
        });
      }
    }).catch(err => {
      console.error('获取优惠券失败:', err);
      // 降级：使用本地数据
      const coupons = productsUtil.getCoupons();
      this.setData({ coupons });
    });
  },

  startCountdown: function () {
    let totalSeconds = 2 * 3600 + 30 * 60;
    this.countdownTimer = setInterval(() => {
      totalSeconds--;
      if (totalSeconds <= 0) totalSeconds = 7200;
      const h = String(Math.floor(totalSeconds / 3600)).padStart(2, '0');
      const m = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, '0');
      const s = String(totalSeconds % 60).padStart(2, '0');
      this.setData({ countdown: { h, m, s } });
    }, 1000);
  },

  // ========== 搜索 ==========
  loadSearchHistory: function () {
    const history = wx.getStorageSync('searchHistory') || [];
    this.setData({ searchHistory: history.slice(0, 8) });
  },

  onSearchInput: function (e) {
    const val = e.detail.value;
    this.setData({ searchKey: val, showSearchHistory: val.length === 0 && this.data.searchHistory.length > 0 });
  },

  onFocusSearch: function () {
    if (this.data.searchHistory.length > 0) {
      this.setData({ showSearchHistory: true });
    }
  },

  onBlurSearch: function () {
    setTimeout(() => {
      this.setData({ showSearchHistory: false });
    }, 200);
  },

  doSearch: function () {
    const key = this.data.searchKey.trim();
    if (!key) return;

    let history = wx.getStorageSync('searchHistory') || [];
    history = [key].concat(history.filter(function(h) { return h !== key; })).slice(0, 8);
    wx.setStorageSync('searchHistory', history);
    this.setData({ searchHistory: history, showSearchHistory: false });

    this.filterAndSplit();
  },

  onSearch: function () {
    this.doSearch();
  },

  clearSearch: function () {
    this.setData({ searchKey: '', showSearchHistory: false });
    this.filterAndSplit();
  },

  tapHistoryItem: function (e) {
    const key = e.currentTarget.dataset.key;
    this.setData({ searchKey: key, showSearchHistory: false });
    this.filterAndSplit();
  },

  clearHistory: function () {
    wx.removeStorageSync('searchHistory');
    this.setData({ searchHistory: [], showSearchHistory: false });
  },

  // ========== 优惠券（云端） ==========
  openCouponPopup: function () {
    this.setData({ showCouponPopup: true });
  },

  closeCouponPopup: function () {
    this.setData({ showCouponPopup: false });
  },

  claimCoupon: function (e) {
    const couponId = e.currentTarget.dataset.id;
    const userId = this.getUserId();

    if (!userId) {
      wx.showToast({ title: '请先登录', icon: 'none' });
      return;
    }

    shopApi.claimCoupon(userId, couponId).then(res => {
      if (res.success) {
        // 更新本地优惠券列表状态
        const coupons = this.data.coupons.map(function(c) { return c.id === couponId ? Object.assign({}, c, { claimed: true }) : c; });
        const claimedCount = coupons.filter(c => c.claimed).length;
        this.setData({ coupons, couponSaveAmount: claimedCount * 20 });
        wx.showToast({ title: '领取成功', icon: 'success' });
      } else {
        wx.showToast({ title: res.errMsg || '领取失败', icon: 'none' });
      }
    }).catch(err => {
      console.error('领取优惠券失败:', err);
      wx.showToast({ title: '网络错误', icon: 'none' });
    });
  },

  // ========== 分类切换 ==========
  switchCategory: function (e) {
    const category = e.currentTarget.dataset.category;
    this.setData({
      currentCategory: category,
      activeTab: 'all',
      searchKey: ''
    });
    this.filterAndSplit();
  },

  // ========== 标签切换 ==========
  switchTab: function (e) {
    const tab = e.currentTarget.dataset.tab;
    let priceOrder = this.data.priceOrder;
    if (tab === 'price') {
      priceOrder = priceOrder === 'desc' ? 'asc' : 'desc';
    }
    this.setData({ activeTab: tab, priceOrder });
    this.filterAndSplit();
  },

  // ========== 筛选排序瀑布流 ==========
  filterAndSplit: function () {
    var list = this.data.products.slice();

    if (this.data.currentCategory === '热门') {
      list = list.filter(function(p) { return p.sales > 1000; });
    } else if (this.data.currentCategory === '新品') {
      list = list.slice().sort(function(a, b) { return b.id - a.id; }).slice(0, 6);
    } else if (this.data.currentCategory !== '全部') {
      list = list.filter(p => p.category === this.data.currentCategory);
    }

    if (this.data.searchKey.trim()) {
      const key = this.data.searchKey.trim().toLowerCase();
      list = list.filter(p =>
        p.name.toLowerCase().includes(key) ||
        p.category.toLowerCase().includes(key) ||
        p.description.toLowerCase().includes(key) ||
        (p.tags && p.tags.some(t => t.includes(key)))
      );
    }

    const tab = this.data.activeTab;
    if (tab === 'sales') {
      list.sort((a, b) => b.sales - a.sales);
    } else if (tab === 'new') {
      list.sort((a, b) => b.id - a.id);
    } else if (tab === 'price') {
      list.sort((a, b) => this.data.priceOrder === 'asc' ? a.price - b.price : b.price - a.price);
    }

    this.setData({ filteredProducts: list, noMore: true });
    this.splitWaterfall(list);
  },

  splitWaterfall: function (list) {
    const left = [];
    const right = [];
    list.forEach((item, i) => {
      if (i % 2 === 0) left.push(item);
      else right.push(item);
    });
    this.setData({ leftProducts: left, rightProducts: right });
  },

  // ========== 图片加载 ==========
  onImgLoad: function (e) {
    const id = e.currentTarget.dataset.id;
    const width = 345;
    const ratio = e.detail.height / e.detail.width;
    const height = Math.round(width * ratio);

    var update = function(list) { return list.map(function(p) { return p.id === id ? Object.assign({}, p, { imgHeight: height }) : p; }); };
    this.setData({
      leftProducts: update(this.data.leftProducts),
      rightProducts: update(this.data.rightProducts)
    });
  },

  // ========== 积分（从云端读取） ==========
  loadUserPoints: function () {
    const userId = this.getUserId();
    if (userId) {
      pointsApi.getPoints(userId).then(res => {
        if (res.success) {
          this.setData({ userPoints: res.data.points || 0 });
        }
      }).catch(err => {
        console.error('获取积分失败:', err);
      });
    }
  },

  // ========== 购物车（云端） ==========
  loadCartCount: function () {
    const userId = this.getUserId();
    if (userId) {
      shopApi.getCart(userId).then(res => {
        if (res.success) {
          this.setData({ cartCount: res.data.length });
        }
      }).catch(() => {
        // 降级到本地
        const cart = wx.getStorageSync('cart') || [];
        this.setData({ cartCount: cart.length });
      });
    } else {
      const cart = wx.getStorageSync('cart') || [];
      this.setData({ cartCount: cart.length });
    }
  },

  addToCart: function (e) {
    const productId = e.currentTarget.dataset.id;
    const product = productsUtil.getProductById(productId);
    if (!product) return;

    const userId = this.getUserId();
    if (userId) {
      shopApi.addToCart(userId, {
        id: product.id,
        name: product.name,
        image: product.image,
        price: product.price,
        originalPrice: product.originalPrice,
        specKey: '',
        specText: '',
        quantity: 1
      }).then(res => {
        if (res.success) {
          this.loadCartCount();
          wx.showToast({ title: '已加入购物车', icon: 'success', duration: 1500 });
        }
      }).catch(() => {
        wx.showToast({ title: '网络错误', icon: 'none' });
      });
    } else {
      // 未登录降级到本地
      const cart = wx.getStorageSync('cart') || [];
      const idx = cart.findIndex(item => item.id === productId);
      if (idx > -1) {
        cart[idx].quantity += 1;
      } else {
        cart.push(Object.assign({}, product, { quantity: 1, selected: true, addTime: Date.now() }));
      }
      wx.setStorageSync('cart', cart);
      this.setData({ cartCount: cart.length });
      wx.showToast({ title: '已加入购物车', icon: 'success', duration: 1500 });
    }
  },

  goToCart: function () {
    wx.navigateTo({ url: '/pages/cart/cart' });
  },

  // ========== 跳转 ==========
  goToDetail: function (e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({ url: `/pages/product-detail/product-detail?id=${id}` });
  },

  viewMore: function () {
    wx.showToast({ title: '更多秒杀即将开放', icon: 'none' });
  },

  viewAllHot: function () {
    this.setData({ currentCategory: '热门', activeTab: 'sales' });
    this.filterAndSplit();
    wx.pageScrollTo({ scrollTop: 0, duration: 300 });
  },

  viewAllNew: function () {
    this.setData({ currentCategory: '新品', activeTab: 'new' });
    this.filterAndSplit();
    wx.pageScrollTo({ scrollTop: 0, duration: 300 });
  },

  goTop: function () {
    wx.pageScrollTo({ scrollTop: 0, duration: 300 });
  },

  // ========== 秒杀购买 ==========
  flashBuy: function (e) {
    const id = e.currentTarget.dataset.id;
    const product = productsUtil.getProductById(id);
    if (!product) return;

    const userId = this.getUserId();
    if (userId) {
      shopApi.addToCart(userId, {
        id: product.id,
        name: product.name,
        image: product.image,
        price: product.price,
        originalPrice: product.originalPrice,
        specKey: '',
        specText: '',
        quantity: 1,
        isFlash: true
      }).then(res => {
        if (res.success) {
          this.loadCartCount();
          wx.showToast({ title: '秒杀商品已加入购物车', icon: 'success' });
        }
      });
    } else {
      const cart = wx.getStorageSync('cart') || [];
      cart.push(Object.assign({}, product, { quantity: 1, selected: true, addTime: Date.now(), isFlash: true }));
      wx.setStorageSync('cart', cart);
      this.setData({ cartCount: cart.length });
      wx.showToast({ title: '秒杀商品已加入购物车', icon: 'success' });
    }
  }
});
