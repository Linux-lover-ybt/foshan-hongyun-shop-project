// pages/feedback-history/feedback-history.js

Page({
  data: {
    historyList: [],
    loading: true
  },

  onLoad() {
    this.loadHistory();
  },

  onShow() {
    this.loadHistory();
  },

  loadHistory() {
    const userInfo = wx.getStorageSync('userInfo');
    if (!userInfo || !userInfo.userId) {
      this.setData({ historyList: [], loading: false });
      return;
    }

    this.setData({ loading: true });

    const feedbackList = wx.getStorageSync('feedbackList') || [];
    const list = feedbackList
      .filter(function(item) {
        return !item.userId || String(item.userId) === String(userInfo.userId);
      })
      .map(item => Object.assign({}, item, {
        timeStr: this.formatTime(item.createTime),
        statusText: this.getStatusText(item.status)
      }));
    this.setData({ historyList: list, loading: false });
    return;

    Promise.resolve({
      name: 'user_auth',
      data: { action: 'getFeedbackList', userId: userInfo.userId }
    }).then(res => {
      if (res.result && res.result.success) {
        const list = res.result.data.list.map(item => Object.assign({}, item, {
          timeStr: this.formatTime(item.createTime),
          statusText: this.getStatusText(item.status)
        }));
        this.setData({ historyList: list, loading: false });
      } else {
        this.setData({ loading: false });
      }
    }).catch(err => {
      console.error('加载历史反馈失败:', err);
      this.setData({ loading: false });
    });
  },

  formatTime(date) {
    if (!date) return '';
    if (typeof date === 'string') date = new Date(date);
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    const h = String(date.getHours()).padStart(2, '0');
    const min = String(date.getMinutes()).padStart(2, '0');
    return `${y}-${m}-${d} ${h}:${min}`;
  },

  getStatusText(status) {
    const map = {
      pending: '待处理',
      processing: '处理中',
      resolved: '已解决'
    };
    return map[status] || '待处理';
  },

  // 预览图片
  previewImage(e) {
    const { urls, current } = e.currentTarget.dataset;
    wx.previewImage({
      current,
      urls
    });
  },

  // 复制回复
  copyReply(e) {
    const { text } = e.currentTarget.dataset;
    wx.setClipboardData({
      data: text,
      success: () => {
        wx.showToast({ title: '已复制', icon: 'success' });
      }
    });
  },

  // 提交新反馈
  goToFeedback() {
    wx.navigateBack();
  }
});
