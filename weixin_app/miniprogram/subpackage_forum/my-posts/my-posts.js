// subpackage_forum/my-posts/my-posts.js
const forumStore = require('../../utils/forum-store');

Page({
  data: {
    activeTab: 'topic',
    topics: [],
    videos: [],
    loading: false,
    userInfo: null,
    // 统计
    topicCount: 0,
    videoCount: 0,
    totalLikes: 0
  },

  onLoad() {
    this.loadUserInfo();
    this.loadStats();
    this.loadData(true);
  },

  onShow() {
    this.loadUserInfo();
  },

  onPullDownRefresh() {
    this.loadData(true).then(() => wx.stopPullDownRefresh());
  },

  // ========== 数据 ==========

  loadUserInfo() {
    this.setData({ userInfo: wx.getStorageSync('userInfo') || null });
  },

  loadStats() {
    const userInfo = wx.getStorageSync('userInfo');
    if (!userInfo || !userInfo.userId) return;

    Promise.all([
      forumStore.getUserTopics(userInfo.userId),
      forumStore.getUserVideos(userInfo.userId)
    ]).then(([topicRes, videoRes]) => {
      this.setData({
        topicCount: topicRes.data.length,
        videoCount: videoRes.data.length
      });
    }).catch(() => {});
  },

  loadData(refresh) {
    if (this.data.activeTab === 'topic') {
      this.loadTopics(refresh);
    } else {
      this.loadVideos(refresh);
    }
  },

  loadTopics() {
    const userInfo = this.data.userInfo;
    if (!userInfo || !userInfo.userId) return;
    this.setData({ loading: true });

    forumStore.getUserTopics(userInfo.userId)
      .then(res => {
        const topics = res.data.map(item => ({
          ...item,
          createTimeStr: this.formatTime(item.createTime),
          isLiked: false
        }));
        let totalLikes = 0;
        topics.forEach(t => { totalLikes += t.likes || 0; });
        this.setData({ topics, totalLikes });
      })
      .catch(err => console.error('加载话题失败:', err))
      .finally(() => this.setData({ loading: false }));
  },

  loadVideos() {
    const userInfo = this.data.userInfo;
    if (!userInfo || !userInfo.userId) return;
    this.setData({ loading: true });

    forumStore.getUserVideos(userInfo.userId)
      .then(res => {
        const videos = res.data.map(item => ({
          ...item,
          createTimeStr: this.formatTime(item.createTime)
        }));
        this.setData({ videos });
      })
      .catch(err => console.error('加载视频失败:', err))
      .finally(() => this.setData({ loading: false }));
  },

  // ========== Tab ==========

  switchTab(e) {
    const tab = e.currentTarget.dataset.tab;
    if (tab === this.data.activeTab) return;
    this.setData({ activeTab: tab });
    this.loadData(true);
  },

  // ========== 操作 ==========

  goToDetail(e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({ url: `/subpackage_forum/topic-detail/topic-detail?topicId=${id}` });
  },

  deleteTopic(e) {
    const { id, index } = e.currentTarget.dataset;
    wx.showModal({
      title: '删除话题',
      content: '确定删除？删除后无法恢复',
      success: (res) => {
        if (!res.confirm) return;
        wx.showLoading({ title: '删除中...' });
        forumStore.deleteTopic(id, this.data.userInfo.userId).then(res => {
          wx.hideLoading();
          if (res.success) {
            const topics = [...this.data.topics];
            topics.splice(index, 1);
            this.setData({ topics, topicCount: this.data.topicCount - 1 });
            wx.showToast({ title: '已删除', icon: 'success' });
          } else {
            wx.showToast({ title: '删除失败', icon: 'none' });
          }
        }).catch(() => {
          wx.hideLoading();
          wx.showToast({ title: '删除失败', icon: 'none' });
        });
      }
    });
  },

  deleteVideo(e) {
    const { id, index } = e.currentTarget.dataset;
    wx.showModal({
      title: '删除视频',
      content: '确定删除？删除后无法恢复',
      success: (res) => {
        if (!res.confirm) return;
        wx.showLoading({ title: '删除中...' });
        forumStore.deleteVideo(id, this.data.userInfo.userId).then(res => {
          wx.hideLoading();
          if (res.success) {
            const videos = [...this.data.videos];
            videos.splice(index, 1);
            this.setData({ videos, videoCount: this.data.videoCount - 1 });
            wx.showToast({ title: '已删除', icon: 'success' });
          } else {
            wx.showToast({ title: '删除失败', icon: 'none' });
          }
        }).catch(() => {
          wx.hideLoading();
          wx.showToast({ title: '删除失败', icon: 'none' });
        });
      }
    });
  },

  // ========== 工具 ==========

  formatTime(date) {
    if (!date) return '';
    if (typeof date === 'string') date = new Date(date);
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    const h = String(date.getHours()).padStart(2, '0');
    const min = String(date.getMinutes()).padStart(2, '0');
    return `${y}-${m}-${d} ${h}:${min}`;
  }
});
