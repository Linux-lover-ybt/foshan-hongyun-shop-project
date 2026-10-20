// pages/register/register.js
const userApi = require('../../api/user');

Page({
  data: {
    phone: '',
    password: '',
    confirmPassword: '',
    nickname: '',
    passwordStrength: 0,
    strengthColor: '#e0e0e0',
    isAgreed: false,
    loading: false,
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
      color = '#e93b3d';
    }
    if (password.length >= 6 && (/(?=.*[a-z])(?=.*[A-Z])/.test(password) || /\d/.test(password) && /[a-zA-Z]/.test(password))) {
      strength = 2;
      color = '#f5a623';
    }
    if (password.length >= 8 && /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
      strength = 3;
      color = '#07c160';
    }
    if (password.length === 0) {
      strength = 0;
      color = '#e0e0e0';
    }

    this.setData({ passwordStrength: strength, strengthColor: color });
  },

  toggleAgree() {
    this.setData({ isAgreed: !this.data.isAgreed });
  },

  handleRegister() {
    const phone = this.data.phone;
    const password = this.data.password;
    const confirmPassword = this.data.confirmPassword;
    const nickname = this.data.nickname;
    const isAgreed = this.data.isAgreed;

    // 校验
    if (!phone || !/^1[3-9]\d{9}$/.test(phone)) {
      wx.showToast({ title: '请输入正确的手机号', icon: 'none' });
      return;
    }
    if (!password || password.length < 6) {
      wx.showToast({ title: '密码长度至少6位', icon: 'none' });
      return;
    }
    if (password !== confirmPassword) {
      wx.showToast({ title: '两次密码不一致', icon: 'none' });
      return;
    }
    if (!isAgreed) {
      wx.showToast({ title: '请先同意用户协议', icon: 'none' });
      return;
    }

    this.setData({ loading: true });
    userApi.register({
      phone: phone,
      password: password,
      nickname: nickname || undefined,
    }).then(function(res) {
      if (res.success) {
        this.setData({ loading: false });
        wx.showToast({ title: '注册成功', icon: 'success' });
        setTimeout(function() {
          wx.redirectTo({ url: '/pages/login/login?phone=' + phone });
        }, 800);
      } else {
        this.setData({ loading: false });
        wx.showToast({ title: res.errMsg || '注册失败', icon: 'none' });
      }
    }.bind(this)).catch(function(err) {
      console.error('注册异常:', err);
      this.setData({ loading: false });
      wx.showToast({ title: '网络异常，请稍后重试', icon: 'none' });
    }.bind(this));
  },

  goToLogin() {
    wx.redirectTo({ url: '/pages/login/login' });
  },
});
