// tasks.js
const pointsUtil = require('../../utils/points.js');

Page({

  data: {
    tasks: [
      {
        id: 'checkin',
        title: '每日签到',
        description: '每天登录并签到',
        points: 5,
        completed: false,
        icon: '📅',
        daily: true
      },
      {
        id: 'browse',
        title: '浏览内容分享页面',
        description: '浏览内容分享页面10s',
        points: 5,
        completed: false,
        icon: '👁️',
        daily: true
      },
      {
        id: 'post',
        title: '发布一篇帖子',
        description: '在红色基地发布帖子',
        points: 10,
        completed: false,
        icon: '📝',
        daily: true
      }
    ],
    totalPoints: 0,
    todayDate: ''
  },

  onLoad: function (options) {
    this.initTasks();
    this.loadUserPoints();
    this.setTodayDate();
  },

  onShow: function () {
    this.initTasks();
    this.loadUserPoints();
  },

  setTodayDate: function() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    this.setData({
      todayDate: `${year}-${month}-${day}`
    });
  },

  initTasks: function() {
    const today = new Date().toDateString();
    const completedTasks = wx.getStorageSync('completedTasks_' + today) || [];
    
    const updatedTasks = this.data.tasks.map(function(task) {
      return Object.assign({}, task, {
        completed: completedTasks.includes(task.id)
      });
    });
    
    this.setData({
      tasks: updatedTasks
    });
  },

  loadUserPoints: function() {
    const points = pointsUtil.getPoints();
    this.setData({
      totalPoints: points
    });
  },

  completeTask: function(e) {
    const taskId = e.currentTarget.dataset.id;
    const today = new Date().toDateString();
    const completedTasks = wx.getStorageSync('completedTasks_' + today) || [];
    
    if (completedTasks.includes(taskId)) {
      wx.showToast({
        title: '任务已完成',
        icon: 'none'
      });
      return;
    }
    
    // 处理浏览任务，跳转到论坛页面
    if (taskId === 'browse') {
      wx.navigateTo({
        url: '/pages/forum/forum?fromTask=true&taskId=browse'
      });
      return;
    }
    
    // 处理发帖任务，跳转到发帖页面
    if (taskId === 'post') {
      wx.navigateTo({
        url: '/pages/forum-post/forum-post?fromTask=true&taskId=post'
      });
      return;
    }
    
    // 处理签到任务
    if (taskId === 'checkin') {
      this.completeCheckinTask(taskId);
      return;
    }
    
    // 其他任务提示
    wx.showToast({
      title: '请完成相应操作',
      icon: 'none'
    });
  },

  completeCheckinTask: function(taskId) {
    const today = new Date().toDateString();
    const completedTasks = wx.getStorageSync('completedTasks_' + today) || [];
    
    const updatedTasks = this.data.tasks.map(task => {
      if (task.id === taskId) {
        return { ...task, completed: true };
      }
      return task;
    });
    
    const newCompletedTasks = [...completedTasks, taskId];
    wx.setStorageSync('completedTasks_' + today, newCompletedTasks);
    
    this.setData({
      tasks: updatedTasks
    });
    
    const task = this.data.tasks.find(t => t.id === taskId);
    if (task) {
      this.addPoints(task.points, task.title);
    }
  },

  markTaskCompleted: function(taskId, points) {
    const today = new Date().toDateString();
    const completedTasks = wx.getStorageSync('completedTasks_' + today) || [];
    
    if (completedTasks.includes(taskId)) {
      return;
    }
    
    const updatedTasks = this.data.tasks.map(task => {
      if (task.id === taskId) {
        return { ...task, completed: true };
      }
      return task;
    });
    
    const newCompletedTasks = [...completedTasks, taskId];
    wx.setStorageSync('completedTasks_' + today, newCompletedTasks);
    
    this.setData({
      tasks: updatedTasks
    });
    
    const task = this.data.tasks.find(t => t.id === taskId);
    if (task) {
      this.addPoints(points, task.title);
    }
  },

  addPoints: function(points, source) {
    pointsUtil.addPoints(points, source);
    this.loadUserPoints();
    
    wx.showToast({
      title: `获得 ${points} 积分`,
      icon: 'success'
    });
  },

  goBack: function() {
    wx.navigateBack();
  }
});
