// pages/red-base/red-base.js
const pointsApi = require('../../api/points');
const forumStore = require('../../utils/forum-store');

Page({
  data: {
    // 顶部切换
    activeTab: 'topic',   // topic / video
    loadMoreVisible: false,
    // 栏目分类（话题和视频共享同一套分类标签）
    categories: ['全部', '红色文化', '革命故事', '红色基地', '文化传承', '读书感悟', '历史探秘', '生活分享'],
    activeCategory: '全部',
    // 话题相关
    topics: [],
    topicSortType: 'latest',
    topicPage: 1,
    topicHasMore: true,
    // 视频相关
    videos: [],
    videoSortType: 'latest',
    videoPage: 1,
    videoHasMore: true,
    // 公共
    loading: false,
    isLoggedIn: false,
    userInfo: null,
    userPoints: 0
  },

  onLoad() {
    this.loadUserInfo();
    this.loadUserPoints();
    this.loadContent(true);
  },

  onShow() {
    this.loadUserInfo();
  },

  onPullDownRefresh() {
    this.resetAndLoad(true).then(() => wx.stopPullDownRefresh());
  },

  onReachBottom() {
    if (this.data.activeTab === 'topic') {
      if (this.data.topicHasMore && !this.data.loading) this.loadTopics(false);
    } else {
      if (this.data.videoHasMore && !this.data.loading) this.loadVideos(false);
    }
  },

  onShareAppMessage() {
    return { title: '佛山红韵 - 热门话题', path: '/pages/red-base/red-base' };
  },

  // ========== Tab 切换 ==========

  switchTab(e) {
    const tab = e.currentTarget.dataset.tab;
    if (tab === this.data.activeTab) return;
    this.setData({ activeTab: tab, loadMoreVisible: tab === 'topic' ? this.data.topics.length > 0 : this.data.videos.length > 0 });
    this.resetAndLoad(true);
  },

  // ========== 栏目切换 ==========

  switchCategory(e) {
    const cat = e.currentTarget.dataset.cat;
    if (cat === this.data.activeCategory) return;
    this.setData({ activeCategory: cat });
    this.resetAndLoad(true);
  },

  // ========== 排序切换 ==========

  switchSort(e) {
    const { tab, sort } = e.currentTarget.dataset;
    if (tab === 'topic' && sort === this.data.topicSortType) return;
    if (tab === 'video' && sort === this.data.videoSortType) return;

    if (tab === 'topic') {
      this.setData({ topicSortType: sort });
    } else {
      this.setData({ videoSortType: sort });
    }
    this.resetAndLoad(true);
  },

  // ========== 数据加载 ==========

  resetAndLoad(refresh) {
    this.setData({
      topicPage: 1, topicHasMore: true, topics: [],
      videoPage: 1, videoHasMore: true, videos: []
    });
    return this.loadContent(refresh);
  },

  loadContent(refresh) {
    if (this.data.activeTab === 'topic') {
      return this.loadTopics(refresh);
    } else {
      return this.loadVideos(refresh);
    }
  },

  loadUserInfo() {
    const userInfo = wx.getStorageSync('userInfo');
    const isLoggedIn = wx.getStorageSync('isLoggedIn') || false;
    this.setData({ userInfo: userInfo || null, isLoggedIn: !!userInfo && isLoggedIn });
  },

  loadUserPoints() {
    const userInfo = wx.getStorageSync('userInfo');
    if (userInfo && userInfo.userId) {
      pointsApi.getPoints(userInfo.userId).then(res => {
        if (res.success) this.setData({ userPoints: res.data.points });
      }).catch(() => {});
    }
  },

  // ---- 话题 ----

  loadTopics(refresh = false) {
    if (this.data.loading) return Promise.resolve();
    this.setData({ loading: true });

    const page = refresh ? 1 : this.data.topicPage;
    return forumStore.getTopics({
      tag: this.data.activeCategory,
      sort: this.data.topicSortType,
      page,
      pageSize: 10
    }).then(res => {
      if (res.success) {
        const { list, hasMore } = res.data;
        const userId = this.data.userInfo ? this.data.userInfo.userId : '';
        const processedList = list.map(item => Object.assign({}, item, {
          isLiked: userId && item.likedUsers && item.likedUsers.includes(userId),
          createTimeStr: item.createTime ? this.formatTime(item.createTime) : ''
        }));
        const topics = refresh ? processedList : this.data.topics.concat(processedList);
        this.setData({ topics, topicHasMore: hasMore, topicPage: page + 1, loadMoreVisible: this.data.activeTab === 'topic' ? topics.length > 0 : this.data.videos.length > 0 });
      }
    }).catch(err => {
      console.error('加载话题失败:', err);
    }).finally(() => {
      this.setData({ loading: false });
    });
  },

  // ---- 视频 ----

  loadVideos(refresh = false) {
    if (this.data.loading) return Promise.resolve();
    this.setData({ loading: true });

    const page = refresh ? 1 : this.data.videoPage;
    return forumStore.getVideos({
      tag: this.data.activeCategory,
      sort: this.data.videoSortType,
      page,
      pageSize: 10
    }).then(res => {
      if (res.success) {
        const { list, hasMore } = res.data;
        const processedList = list.map(item => Object.assign({}, item, {
          createTimeStr: item.createTime ? this.formatTime(item.createTime) : (item.time || '')
        }));
        const videos = refresh ? processedList : this.data.videos.concat(processedList);
        this.setData({ videos, videoHasMore: hasMore, videoPage: page + 1, loadMoreVisible: this.data.activeTab === 'video' ? videos.length > 0 : this.data.topics.length > 0 });
      }
    }).catch(err => {
      console.error('加载视频失败:', err);
    }).finally(() => {
      this.setData({ loading: false });
    });
  },

  // ========== 话题交互 ==========

  goToDetail(e) {
    const topicId = e.currentTarget.dataset.id;
    wx.navigateTo({ url: `/subpackage_forum/topic-detail/topic-detail?topicId=${topicId}` });
  },

  likeTopic(e) {
    const { index, id } = e.currentTarget.dataset;
    if (!this.data.isLoggedIn) {
      wx.showToast({ title: '请先登录', icon: 'none' });
      return;
    }

    const userId = this.data.userInfo.userId;
    const topic = this.data.topics[index];
    const isLiked = !topic.isLiked;

    const key = 'topics[' + index + ']';
    var updateData = {};
    updateData[key + '.isLiked'] = isLiked;
    updateData[key + '.likes'] = isLiked ? topic.likes + 1 : Math.max(0, topic.likes - 1);
    this.setData(updateData);

    forumStore.likeTopic(id, userId).catch(err => {
      console.error('点赞失败:', err);
      var revertData = {};
      revertData[key + '.isLiked'] = !isLiked;
      revertData[key + '.likes'] = isLiked ? topic.likes : topic.likes + 1;
      this.setData(revertData);
    });
  },

  previewImage(e) {
    const { url, urls } = e.currentTarget.dataset;
    wx.previewImage({ current: url, urls: urls || [url] });
  },

  // ========== 视频交互 ==========

  watchVideo(e) {
    const index = e.currentTarget.dataset.index;
    const video = this.data.videos[index];

    const userInfo = wx.getStorageSync('userInfo');
    if (!userInfo || !userInfo.userId) {
      wx.showToast({ title: '请先登录', icon: 'none' });
      setTimeout(() => wx.switchTab({ url: '/pages/mine/mine' }), 1500);
      return;
    }

    // 红色基地用户免费观看
    if (userInfo.role === 'red_base' || userInfo.role === 'admin') {
      var viewData = {};
      viewData['videos[' + index + '].views'] = (video.views || 0) + 1;
      this.setData(viewData);
      wx.navigateTo({ url: `/subpackage_forum/forum-video/forum-video?fileID=${video.fileID}` });
      return;
    }

    // 普通用户扣积分
    wx.showLoading({ title: '处理中...' });
    pointsApi.deductPoints(userInfo.userId, 30, `观看视频: ${video.title}`, video._id)
      .then(res => {
        wx.hideLoading();
        if (!res.success) {
          wx.showToast({ title: res.errMsg || '积分不足', icon: 'none' });
          return;
        }
        var viewData2 = {};
        viewData2['videos[' + index + '].views'] = (video.views || 0) + 1;
        this.setData(viewData2);
        wx.navigateTo({ url: `/subpackage_forum/forum-video/forum-video?fileID=${video.fileID}` });
      })
      .catch(err => {
        wx.hideLoading();
        console.error('扣除积分失败:', err);
        wx.showToast({ title: '网络异常，请重试', icon: 'none' });
      });
  },

  // ========== 发布 ==========

  goToPublish() {
    if (!this.data.isLoggedIn) {
      wx.showToast({ title: '请先登录', icon: 'none' });
      setTimeout(() => wx.switchTab({ url: '/pages/mine/mine' }), 1500);
      return;
    }

    if (this.data.activeTab === 'topic') {
      wx.navigateTo({ url: '/subpackage_forum/publish-topic/publish-topic' });
    } else {
      wx.navigateTo({ url: `/subpackage_forum/publish-topic/publish-topic?mode=video&category=${this.data.activeCategory}` });
    }
  },

  // ========== 工具 ==========

  formatTime(date) {
    if (typeof date === 'string') date = new Date(date);
    const now = new Date();
    const diff = now - date;
    if (diff < 60000) return '刚刚';
    if (diff < 3600000) return Math.floor(diff / 60000) + '分钟前';
    if (diff < 86400000) return Math.floor(diff / 3600000) + '小时前';
    if (diff < 604800000) return Math.floor(diff / 86400000) + '天前';
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }
});
