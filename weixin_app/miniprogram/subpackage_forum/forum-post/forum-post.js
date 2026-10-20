const pointsUtil = require('../../utils/points.js');

Page({
  data: {
    title: '',
    content: '',
    images: [],
    // 任务相关
    fromTask: false,
    taskId: ''
  },

  onLoad: function(options) {
    // 检查是否从任务页面跳转过来
    if (options.fromTask === 'true' && options.taskId) {
      const today = new Date().toDateString();
      const completedTasks = wx.getStorageSync('completedTasks_' + today) || [];
      
      // 检查任务是否已完成
      if (!completedTasks.includes(options.taskId)) {
        this.setData({
          fromTask: true,
          taskId: options.taskId
        });
        
        wx.showToast({
          title: '发布帖子完成任务',
          icon: 'none',
          duration: 2000
        });
      } else {
        wx.showToast({
          title: '今日任务已完成',
          icon: 'none'
        });
      }
    }
  },

  onTitleInput: function(e) {
    this.setData({ title: e.detail.value });
  },

  onContentInput: function(e) {
    this.setData({ content: e.detail.value });
  },

  chooseImage: function() {
    const that = this;
    wx.chooseImage({
      count: 6 - this.data.images.length,
      sizeType: ['compressed', 'original'],
      sourceType: ['album', 'camera'],
      success(res) {
        const imgs = that.data.images.concat(res.tempFilePaths);
        that.setData({ images: imgs });
      }
    });
  },

  submit: function() {
    const title = this.data.title.trim();
    const content = this.data.content.trim();

    if (!title || !content) {
      wx.showToast({ title: '请填写标题和内容', icon: 'none' });
      return;
    }

    const posts = wx.getStorageSync('forumPosts') || [];
    const newPost = {
      id: Date.now(),
      title: title,
      content: content,
      images: this.data.images,
      username: (wx.getStorageSync('userInfo') && wx.getStorageSync('userInfo').name) || '匿名',
      time: this._nowDate(),
      likes: 0,
      comments: []
    };

    posts.unshift(newPost);
    wx.setStorageSync('forumPosts', posts);

    // 如果是从任务页面来的，完成任务
    if (this.data.fromTask && this.data.taskId) {
      this.completePostTask();
    } else {
      // 正常发帖奖励5积分
      pointsUtil.addPoints(5, '发布帖子');
      wx.showToast({ title: '发布成功 +5积分', icon: 'success' });
      setTimeout(() => wx.navigateBack(), 800);
    }
  },

  completePostTask: function() {
    const today = new Date().toDateString();
    const completedTasks = wx.getStorageSync('completedTasks_' + today) || [];
    
    if (!completedTasks.includes(this.data.taskId)) {
      completedTasks.push(this.data.taskId);
      wx.setStorageSync('completedTasks_' + today, completedTasks);
      
      // 添加任务积分（10积分）
      pointsUtil.addPoints(10, '发布一篇帖子');
      
      wx.showToast({
        title: '任务完成，获得10积分',
        icon: 'success',
        duration: 2000
      });
      
      // 2秒后返回任务页面
      setTimeout(() => {
        wx.navigateBack();
      }, 2000);
    } else {
      wx.showToast({ title: '发布成功', icon: 'success' });
      setTimeout(() => wx.navigateBack(), 800);
    }
  },

  cancel: function() {
    wx.navigateBack();
  },

  _nowDate: function() {
    const d = new Date();
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  }
});
