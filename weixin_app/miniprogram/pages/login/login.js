// pages/login/login.js
const userApi = require('../../api/user');

Page({
  data: {
    loginType: 'code', // 'code' or 'password'
    phone: '',
    code: '',
    username: '',
    password: '',
    passwordStrength: 0, // 0: -, 1: weak, 2: medium, 3: strong
    strengthColor: '#e0e0e0',
    isAgreed: false,
    counting: false,
    count: 60,
    loading: false,
  },

  onLoad(options) {
    // 如果已登录，直接跳转首页
    const userInfo = wx.getStorageSync('userInfo');
    if (userInfo && userInfo.token) {
      wx.reLaunch({ url: '/pages/index/index' });
      return;
    }

    // 从注册页跳转过来，自动填充手机号
    if (options.phone) {
      this.setData({ phone: options.phone });
    }
  },

  switchLoginType(e) {
    this.setData({
      loginType: e.currentTarget.dataset.type,
    });
  },

  handleInput(e) {
    const field = e.currentTarget.dataset.field;
    var data = {};
    data[field] = e.detail.value;
    this.setData(data);
  },

  handlePasswordInput(e) {
    const password = e.detail.value;
    this.setData({ password });
    this.checkPasswordStrength(password);
  },

  checkPasswordStrength(password) {
    let strength = 0;
    let color = '#e0e0e0';

    if (password.length >= 6) {
      strength = 1;
      color = '#e93b3d'; // 弱
    }
    if (password.length >= 6 && (/(?=.*[a-z])(?=.*[A-Z])/.test(password) || /\d/.test(password) && /[a-zA-Z]/.test(password))) {
      strength = 2;
      color = '#f5a623'; // 中
    }
    if (password.length >= 8 && /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
      strength = 3;
      color = '#07c160'; // 强
    }
    if (password.length === 0) {
        strength = 0;
        color = '#e0e0e0';
    }

    this.setData({
      passwordStrength: strength,
      strengthColor: color,
    });
  },

  toggleAgree() {
    this.setData({
      isAgreed: !this.data.isAgreed,
    });
  },

  // 验证码登录：发送验证码（开发阶段跳过，直接走验证码登录流程）
  getVerifyCode() {
    if (!this.data.phone || !/^1[3-9]\d{9}$/.test(this.data.phone)) {
      wx.showToast({ title: '请输入正确的手机号', icon: 'none' });
      return;
    }

    // TODO: 生产环境需接入短信服务发送验证码
    // 当前为开发阶段，验证码校验已在云函数中跳过
    wx.showToast({ title: '验证码已发送（开发模式）', icon: 'none' });

    this.setData({ counting: true });
    this._timer = setInterval(() => {
      this.setData({ count: this.data.count - 1 });
      if (this.data.count === 0) {
        clearInterval(this._timer);
        this.setData({ counting: false, count: 60 });
      }
    }, 1000);
  },

  handleLogin() {
    if (!this.data.isAgreed) {
      wx.showToast({ title: '请先同意用户协议', icon: 'none' });
      return;
    }

    if (this.data.loginType === 'code') {
      this._loginByCode();
    } else {
      this._loginByPassword();
    }
  },

  // 手机号+验证码登录
  _loginByCodeLegacy() {
    const phone = this.data.phone;
    const code = this.data.code;
    if (!phone || !/^1[3-9]\d{9}$/.test(phone)) {
      wx.showToast({ title: '请输入正确的手机号', icon: 'none' });
      return;
    }
    if (!code) {
      wx.showToast({ title: '请输入验证码', icon: 'none' });
      return;
    }

    // 测试阶段，验证码登录不可用
    wx.showToast({ title: '当前处于测试阶段', icon: 'none' });
  },

  // 用户名/手机号+密码登录
  _loginByCode() {
    const phone = this.data.phone;
    const code = this.data.code;
    if (!phone || !/^1[3-9]\d{9}$/.test(phone)) {
      wx.showToast({ title: '请输入正确的手机号', icon: 'none' });
      return;
    }
    if (!code) {
      wx.showToast({ title: '请输入验证码', icon: 'none' });
      return;
    }

    this.setData({ loading: true });
    userApi.loginByCode({ phone, code }).then(res => {
      this.setData({ loading: false });
      if (res.success) {
        this._onLoginSuccess(res);
      } else {
        wx.showToast({ title: res.errMsg || '登录失败', icon: 'none' });
      }
    }).catch(() => {
      this.setData({ loading: false });
      wx.showToast({ title: '登录失败', icon: 'none' });
    });
  },

  _loginByPassword() {
    const username = this.data.username;
    const password = this.data.password;
    if (!username) {
      wx.showToast({ title: '请输入手机号/用户名', icon: 'none' });
      return;
    }
    if (!password) {
      wx.showToast({ title: '请输入密码', icon: 'none' });
      return;
    }
    if (password.length < 6) {
      wx.showToast({ title: '密码长度至少6位', icon: 'none' });
      return;
    }

    this.setData({ loading: true });
    userApi.loginByPassword({ username: username, password: password }).then(function(res) {
      if (res.success) {
        this.setData({ loading: false });
        this._onLoginSuccess(res);
        return;
      } else {
        wx.showToast({ title: res.errMsg || '登录失败', icon: 'none' });
      }
      this.setData({ loading: false });
    }.bind(this)).catch(function(err) {
      console.error('密码登录异常:', err);
      wx.showToast({ title: '网络异常，请稍后重试', icon: 'none' });
      this.setData({ loading: false });
    }.bind(this));
  },

  // 登录成功统一处理：存储 token 和用户信息，跳转首页
  _onLoginSuccess(res) {
    const { token, userId, uid, nickname, avatarUrl, role } = res.data;
    // 同时存储两组字段，保证兼容性
    const userInfo = {
      token,
      userId,
      uid: uid || '',
      nickname,
      name: nickname,           // 兼容 mine 页面
      nickName: nickname,       // 兼容好友系统
      avatarUrl: avatarUrl || '',
      avatar: avatarUrl || '',  // 兼容 mine 页面
      role
    };

    wx.setStorageSync('token', token);
    wx.setStorageSync('userInfo', userInfo);
    wx.setStorageSync('isLoggedIn', true);

    const app = getApp();
    if (app) {
      app.globalData.userInfo = userInfo;
    }

    // 先关闭所有 loading 和 toast，再显示成功提示
    wx.hideLoading();
    wx.hideToast();
    
    // 直接跳转，不显示 toast 避免动画冲突
    wx.reLaunch({ url: '/pages/index/index' });
  },

  handleSkip() {
    wx.switchTab({
      url: '/pages/index/index'
    });
  },

  onUnload() {
    if (this._timer) {
      clearInterval(this._timer);
    }
  }
});
