const userApi = require('../../api/user');

const ROLE_TEXT = {
  user: '普通用户',
  red_base: '红色基地管理员',
  admin: '系统管理员'
};

Page({
  data: {
    userInfo: null,
    nickname: '',
    avatarUrl: '',
    isEditing: false,
    saving: false,
    loading: true,
    userPoints: 0,
    phone: '',
    role: '',
    roleText: '',
    registerTime: ''
  },

  onLoad() {
    this.loadUserInfo();
  },

  onShow() {
    this.loadUserInfo();
  },

  loadUserInfo() {
    const current = wx.getStorageSync('userInfo');
    if (!current || !current.userId) {
      wx.showToast({ title: '请先登录', icon: 'none' });
      setTimeout(() => wx.navigateBack(), 1500);
      return;
    }

    userApi.getUserInfo(current.userId).then(res => {
      if (!res.success) {
        this.setData({ loading: false });
        return;
      }
      const data = res.data;
      this.setData({
        userInfo: current,
        nickname: data.nickname || data.name || '',
        avatarUrl: data.avatarUrl || data.avatar || '',
        phone: data.phone || '未绑定',
        role: data.role || 'user',
        roleText: ROLE_TEXT[data.role] || ROLE_TEXT.user,
        registerTime: data.createTime ? this.formatDate(data.createTime) : '',
        userPoints: data.points || 0,
        loading: false
      });
    }).catch(() => this.setData({ loading: false }));
  },

  startEdit() {
    this.setData({ isEditing: true });
  },

  cancelEdit() {
    const userInfo = wx.getStorageSync('userInfo') || {};
    this.setData({
      isEditing: false,
      nickname: userInfo.nickname || userInfo.name || '',
      avatarUrl: userInfo.avatarUrl || userInfo.avatar || ''
    });
  },

  onNicknameInput(e) {
    this.setData({ nickname: e.detail.value });
  },

  chooseAvatar() {
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        this.setData({ avatarUrl: res.tempFilePaths[0] });
        wx.showToast({ title: '头像已更新', icon: 'success' });
      }
    });
  },

  saveProfile() {
    const { nickname, avatarUrl, userInfo, saving } = this.data;
    if (saving) return;
    if (!nickname.trim()) {
      wx.showToast({ title: '昵称不能为空', icon: 'none' });
      return;
    }
    if (!userInfo || !userInfo.userId) return;

    this.setData({ saving: true });
    userApi.updateProfile(userInfo.userId, {
      nickname: nickname.trim(),
      avatarUrl
    }).then(res => {
      this.setData({ saving: false });
      if (res.success) {
        this.setData({ isEditing: false });
        wx.showToast({ title: '保存成功', icon: 'success' });
      } else {
        wx.showToast({ title: res.errMsg || '保存失败', icon: 'none' });
      }
    }).catch(() => {
      this.setData({ saving: false });
      wx.showToast({ title: '保存失败', icon: 'none' });
    });
  },

  goToMyPosts() {
    wx.navigateTo({ url: '/subpackage_forum/my-posts/my-posts' });
  },

  goToPointsLog() {
    wx.switchTab({ url: '/pages/mine/mine' });
  },

  formatDate(date) {
    if (!date) return '';
    const value = typeof date === 'string' ? new Date(date) : date;
    const y = value.getFullYear();
    const m = String(value.getMonth() + 1).padStart(2, '0');
    const d = String(value.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }
});
