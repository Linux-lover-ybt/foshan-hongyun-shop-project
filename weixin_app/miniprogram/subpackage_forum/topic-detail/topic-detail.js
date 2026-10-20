// subpackage_forum/topic-detail/topic-detail.js
const pointsApi = require('../../api/points');
const forumStore = require('../../utils/forum-store');

Page({
  data: {
    topicId: '',
    topic: null,
    comments: [],
    commentText: '',
    isLiked: false,
    loading: true,
    isLoggedIn: false,
    userInfo: null,
    showActionSheet: false,
    isAuthor: false
  },

  onLoad(options) {
    if (options.topicId) {
      this.setData({ topicId: options.topicId });
      this.loadTopicDetail();
      this.loadComments();
    }
    this.loadUserInfo();
  },

  onShow() {
    this.loadUserInfo();
  },

  onShareAppMessage() {
    const t = this.data.topic;
    if (!t) return { title: '查看话题' };
    return {
      title: (t.content || '').substring(0, 30),
      path: `/subpackage_forum/topic-detail/topic-detail?topicId=${t._id}`
    };
  },

  // ========== 数据加载 ==========

  loadUserInfo() {
    const userInfo = wx.getStorageSync('userInfo');
    const isLoggedIn = wx.getStorageSync('isLoggedIn') || false;
    this.setData({ userInfo: userInfo || null, isLoggedIn: !!userInfo && isLoggedIn });
    // 刷新点赞状态
    if (this.data.topic && userInfo) {
      const liked = this.data.topic.likedUsers && this.data.topic.likedUsers.includes(userInfo.userId);
      const isAuthor = this.data.topic.userId === userInfo.userId;
      this.setData({ isLiked: liked, isAuthor });
    }
  },

  loadTopicDetail() {
    this.setData({ loading: true });
    forumStore.getTopicDetail(this.data.topicId).then(res => {
      if (res.success) {
        const topic = res.data;
        const userInfo = this.data.userInfo;
        const isLiked = userInfo && topic.likedUsers && topic.likedUsers.includes(userInfo.userId);
        const isAuthor = userInfo && topic.userId === userInfo.userId;
        this.setData({
          topic: {
            ...topic,
            createTimeStr: this.formatTime(topic.createTime)
          },
          isLiked,
          isAuthor
        });
      }
    }).catch(err => {
      console.error('加载话题失败:', err);
      wx.showToast({ title: '加载失败', icon: 'none' });
    }).finally(() => {
      this.setData({ loading: false });
    });
  },

  loadComments() {
    forumStore.getComments(this.data.topicId, 1, 50).then(res => {
      if (res.success) {
        const comments = res.data.list.map(c => ({
          ...c,
          createTimeStr: this.formatTime(c.createTime)
        }));
        this.setData({ comments });
      }
    }).catch(err => {
      console.error('加载评论失败:', err);
    });
  },

  // ========== 交互 ==========

  onCommentInput(e) {
    this.setData({ commentText: e.detail.value });
  },

  submitComment() {
    const { commentText, topicId, userInfo } = this.data;
    if (!commentText.trim()) {
      wx.showToast({ title: '请输入评论内容', icon: 'none' });
      return;
    }
    if (!userInfo || !userInfo.userId) {
      wx.showToast({ title: '请先登录', icon: 'none' });
      return;
    }

    wx.showLoading({ title: '发送中...' });
    forumStore.createComment({
      topicId,
      content: commentText.trim(),
      userId: userInfo.userId,
        nickname: userInfo.nickname || userInfo.name || '匿名用户',
        avatarUrl: userInfo.avatarUrl || userInfo.avatar || ''
    }).then(res => {
      wx.hideLoading();
      if (res.success) {
        wx.showToast({ title: '评论成功', icon: 'success' });
        this.setData({ commentText: '' });
        // 刷新评论列表和话题评论数
        this.loadComments();
        // 更新本地话题评论数
        const topic = this.data.topic;
        this.setData({ 'topic.commentsCount': (topic.commentsCount || 0) + 1 });
      } else {
        wx.showToast({ title: res.errMsg || '评论失败', icon: 'none' });
      }
    }).catch(err => {
      wx.hideLoading();
      console.error('评论失败:', err);
      wx.showToast({ title: '评论失败', icon: 'none' });
    });
  },

  likeTopic() {
    if (!this.data.isLoggedIn) {
      wx.showToast({ title: '请先登录', icon: 'none' });
      return;
    }

    const { topicId, userInfo, isLiked, topic } = this.data;
    const newLiked = !isLiked;

    // 乐观更新
    this.setData({
      isLiked: newLiked,
      'topic.likes': newLiked ? topic.likes + 1 : Math.max(0, topic.likes - 1)
    });

    forumStore.likeTopic(topicId, userInfo.userId).catch(err => {
      console.error('点赞失败:', err);
      this.setData({
        isLiked: !newLiked,
        'topic.likes': newLiked ? topic.likes : topic.likes + 1
      });
    });
  },

  previewImage(e) {
    const { url, urls } = e.currentTarget.dataset;
    wx.previewImage({ current: url, urls: urls });
  },

  showMenu() {
    if (!this.data.isAuthor) return;
    wx.showActionSheet({
      itemList: ['删除话题'],
      success: (res) => {
        if (res.tapIndex === 0) this.deleteTopic();
      }
    });
  },

  deleteTopic() {
    wx.showModal({
      title: '确认删除',
      content: '删除后无法恢复，确定要删除吗？',
      success: (res) => {
        if (res.confirm) {
          forumStore.deleteTopic(this.data.topicId, this.data.userInfo.userId).then(res => {
            if (res.success) {
              wx.showToast({ title: '已删除', icon: 'success' });
              setTimeout(() => wx.navigateBack(), 1500);
            } else {
              wx.showToast({ title: res.errMsg || '删除失败', icon: 'none' });
            }
          });
        }
      }
    });
  },

  deleteComment(e) {
    const commentId = e.currentTarget.dataset.id;
    wx.showModal({
      title: '删除评论',
      content: '确定要删除这条评论吗？',
      success: (res) => {
        if (res.confirm) {
          forumStore.deleteComment(commentId, this.data.userInfo.userId).then(res => {
            if (res.success) {
              wx.showToast({ title: '已删除', icon: 'success' });
              this.loadComments();
              const topic = this.data.topic;
              this.setData({ 'topic.commentsCount': Math.max(0, (topic.commentsCount || 1) - 1) });
            }
          });
        }
      }
    });
  },

  // ========== 工具 ==========

  formatTime(date) {
    if (!date) return '';
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
    const h = String(date.getHours()).padStart(2, '0');
    const min = String(date.getMinutes()).padStart(2, '0');
    return `${y}-${m}-${d} ${h}:${min}`;
  }
});
