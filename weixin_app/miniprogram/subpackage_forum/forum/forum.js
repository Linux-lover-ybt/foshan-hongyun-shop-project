// forum.js
const pointsApi = require('../../api/points');
const forumStore = require('../../utils/forum-store');

Page({
  data: {
    adminVideos: [], // 从数据库动态加载
    userVideos: [],
    showModal: false,
    uploadTitle: '',
    uploadDesc: '',
    // ... (原有其他data不变)
    // 新增：用于红色视频上传
    redVideoTitle: '',
    redVideoDesc: '',
    tempVideoPath: '',
  },

  onLoad: function (options) {
    this.loadUserInfo();
    this.loadUserVideos();
    this.loadRedVideos(); // 页面加载时，从数据库获取红色视频
    // ... (原有其他onLoad逻辑不变)
  },

  // 新增：加载红色视频列表
  loadRedVideos: function() {
    var that = this;
    const watchedIds = wx.getStorageSync('watchedVideoIds') || [];
    forumStore.getVideos({ page: 1, pageSize: 50 }).then(function(res) {
      const videos = res.success ? res.data.list.map(function(video) {
        return Object.assign({}, video, {
          watched: watchedIds.indexOf(video._id) >= 0
        });
      }) : [];
      that.setData({ adminVideos: videos });
    });
    return;

    wx.showLoading({ title: '加载中...' });
    Promise.resolve({
      name: 'getRedVideos'
    }).then(function(res) {
      wx.hideLoading();
      if (res.result && res.result.success) {
        var videos = res.result.data;
        // 检查每个视频的观看状态
        var userInfo = wx.getStorageSync('userInfo');
        if (userInfo && userInfo.userId) {
          // 串行检查每个视频的观看状态
          var checkChain = Promise.resolve();
          videos.forEach(function(video) {
            checkChain = checkChain.then(function() {
              return Promise.resolve({
                name: 'checkVideoWatchStatus',
                data: { videoId: video._id }
              }).then(function(watchStatus) {
                video.watched = watchStatus.result.watched;
              });
            });
          });
          return checkChain.then(function() {
            that.setData({ adminVideos: videos });
          });
        } else {
          that.setData({ adminVideos: videos });
        }
      } else {
        wx.showToast({ title: '加载视频失败', icon: 'none' });
      }
    }).catch(function(err) {
      wx.hideLoading();
      console.error('[云函数] [getRedVideos] 调用失败', err);
      wx.showToast({ title: '网络错误', icon: 'none' });
    });
  },

  // 新增：处理上传表单输入
  onUploadTitleInput: function(e) {
    this.setData({ redVideoTitle: e.detail.value });
  },

  onUploadDescInput: function(e) {
    this.setData({ redVideoDesc: e.detail.value });
  },

  removeChosenVideo: function() {
    this.setData({ tempVideoPath: '' });
  },

  // 新增：核心功能 - 选择并上传视频
  chooseAndUploadVideo: function() {
    const that = this;
    const { redVideoTitle, redVideoDesc } = this.data;

    if (!redVideoTitle || !redVideoDesc) {
      wx.showToast({ title: '请填写标题和描述', icon: 'none' });
      return;
    }

    wx.chooseMedia({
      count: 1,
      mediaType: ['video'],
      sourceType: ['album', 'camera'],
      maxDuration: 600, // 可根据需要调整
      success(res) {
        const tempFilePath = res.tempFiles[0].tempFilePath;
        that.setData({ tempVideoPath: tempFilePath });
        forumStore.createVideo({
          title: redVideoTitle,
          description: redVideoDesc,
          fileID: tempFilePath,
          category: '红色文化',
          userId: (wx.getStorageSync('userInfo') || {}).userId || '',
          nickname: (wx.getStorageSync('userInfo') || {}).name || '管理员'
        }).then(function(result) {
          wx.hideLoading();
          if (result.success) {
            wx.showToast({ title: '上传成功', icon: 'success' });
            that.setData({ redVideoTitle: '', redVideoDesc: '', tempVideoPath: '' });
            that.loadRedVideos();
          } else {
            wx.showToast({ title: result.errMsg || '保存失败', icon: 'none' });
          }
        });
        return;

        wx.showLoading({ title: '上传中...' });

        // 1. 上传到云存储
        const cloudPath = `red_videos/${Date.now()}-${Math.floor(Math.random() * 10000)}${tempFilePath.match(/\.\w+$/)[0]}`;
        Promise.resolve({
          cloudPath,
          filePath: tempFilePath,
          success: res => {
            // 2. 将信息存入数据库
            Promise.resolve({
              name: 'addRedVideo',
              data: {
                title: redVideoTitle,
                description: redVideoDesc,
                fileID: res.fileID
              },
              success: addRes => {
                wx.hideLoading();
                if (addRes.result && addRes.result.success) {
                  wx.showToast({ title: '上传成功', icon: 'success' });
                  that.setData({ redVideoTitle: '', redVideoDesc: '', tempVideoPath: '' });
                  that.loadRedVideos(); // 刷新列表
                } else {
                  wx.showToast({ title: addRes.result.errMsg || '存入数据库失败', icon: 'none' });
                }
              },
              fail: err => {
                wx.hideLoading();
                console.error('[云函数] [addRedVideo] 调用失败', err);
                wx.showToast({ title: '网络错误', icon: 'none' });
              }
            });
          },
          fail: e => {
            wx.hideLoading();
            console.error('[上传文件] 失败：', e);
            wx.showToast({ title: '上传失败', icon: 'none' });
          },
        });
      }
    });
  },

  onReady: function () {
    
  },

  onShow: function () {
    this.loadUserInfo();
    
    // 如果是任务模式且计时器被清除，重新开始计时
    if (this.data.fromTask && !this.data.taskCompleted && !this.data.browseTimer) {
      this.startBrowseTimer();
    }
  },

  onHide: function () {
    // 页面隐藏时暂停计时
    this.pauseBrowseTimer();
  },

  onUnload: function () {
    // 页面卸载时清除计时器
    this.clearBrowseTimer();
  },

  onPullDownRefresh: function () {
    
  },

  onReachBottom: function () {
    
  },

  onShareAppMessage: function () {
    
  },

  loadUserInfo: function() {
    const userInfo = wx.getStorageSync('userInfo');
    console.log('当前用户信息:', userInfo);
    const isLoggedIn = wx.getStorageSync('isLoggedIn') || false;
    
    if (userInfo && isLoggedIn) {
      this.setData({
        userInfo: userInfo,
        isLoggedIn: isLoggedIn
      });
    }
  },

  loadUserVideos: function() {
    const userVideos = wx.getStorageSync('userVideos') || [];
    this.setData({
      userVideos: userVideos
    });
  },

  watchVideo: function(e) {
    const index = e.currentTarget.dataset.index;
    const adminVideos = this.data.adminVideos;
    
    // 如果已观看过，直接播放，不扣分
    if (adminVideos[index].watched) {
      wx.navigateTo({
        url: `../forum-video/forum-video?fileID=${adminVideos[index].fileID}`
      });
      return;
    }
    
    // 直接从本地存储检查用户信息
    const userInfo = wx.getStorageSync('userInfo');
    if (!userInfo || !userInfo.userId) {
      wx.showToast({
        title: '请先登录',
        icon: 'none'
      });
      setTimeout(() => {
        wx.switchTab({ url: '/pages/mine/mine' });
      }, 1500);
      return;
    }
    
    wx.showLoading({ title: '处理中...' });

    // 如果是红色基地用户，则直接观看，不扣积分
    if (userInfo.role === 'red_base') {
      adminVideos[index].watched = true;
      adminVideos[index].views++;
      this.setData({ adminVideos: adminVideos });

      wx.hideLoading();
      // 跳转到视频播放页面，并传递 fileID
      wx.navigateTo({
        url: `../forum-video/forum-video?fileID=${adminVideos[index].fileID}`
      });
      return; // 处理完后直接返回，不执行下面的扣分逻辑
    }

    const requiredPoints = 30; // 把这行加回来
    // 从云端扣除积分
    pointsApi.deductPoints(userInfo.userId, requiredPoints, `观看视频: ${adminVideos[index].title}`, adminVideos[index]._id)
      .then(res => {
        wx.hideLoading();
        
        if (!res.success) {
          wx.showToast({
            title: res.errMsg || '积分不足',
            icon: 'none',
            duration: 2000
          });
          return;
        }
        
        adminVideos[index].watched = true;
        adminVideos[index].views++;
        adminVideos[index].pointsEarned = true;
        
        this.setData({ adminVideos: adminVideos });
        
        wx.hideLoading();
        // 跳转到视频播放页面，并传递 fileID
        wx.navigateTo({
          url: `../forum-video/forum-video?fileID=${adminVideos[index].fileID}`
        });
      })
      .catch(err => {
        wx.hideLoading();
        console.error('扣除积分失败:', err);
        wx.showToast({
          title: '网络异常，请重试',
          icon: 'none',
          duration: 2000
        });
      });
  },

  watchUserVideo: function(e) {
    const index = e.currentTarget.dataset.index;
    const userVideos = this.data.userVideos;
    
    if (userVideos[index].watched) {
      wx.showToast({
        title: '已观看过此视频',
        icon: 'none',
        duration: 2000
      });
      return;
    }
    
    // 直接从本地存储检查用户信息
    const userInfo = wx.getStorageSync('userInfo');
    if (!userInfo || !userInfo.userId) {
      wx.showToast({
        title: '请先登录',
        icon: 'none'
      });
      setTimeout(() => {
        wx.switchTab({ url: '/pages/mine/mine' });
      }, 1500);
      return;
    }
    
    const requiredPoints = 30;
    
    wx.showLoading({ title: '处理中...' });
    
    // 从云端扣除积分
    pointsApi.deductPoints(userInfo.userId, requiredPoints, '观看用户视频: ' + userVideos[index].title)
      .then(res => {
        wx.hideLoading();
        
        if (!res.success) {
          wx.showToast({
            title: res.errMsg || '积分不足',
            icon: 'none',
            duration: 2000
          });
          return;
        }
        
        userVideos[index].watched = true;
        userVideos[index].pointsEarned = true;
        
        this.setData({ userVideos: userVideos });
        
        wx.showToast({
          title: `扣除${requiredPoints}积分，观看成功`,
          icon: 'success',
          duration: 2000
        });
      })
      .catch(err => {
        wx.hideLoading();
        console.error('扣除积分失败:', err);
        wx.showToast({
          title: '网络异常，请重试',
          icon: 'none',
          duration: 2000
        });
      });
  },

  addPoints: function(points, reason) {
    // 增加积分到云端
    const userInfo = wx.getStorageSync('userInfo');
    if (userInfo && userInfo.userId) {
      pointsApi.addPoints(userInfo.userId, points, reason || '观看视频').catch(err => {
        console.error('增加积分失败:', err);
      });
    }
  },

  showUploadModal: function() {
    const userInfo = wx.getStorageSync('userInfo');
    if (!userInfo || !userInfo.userId) {
      wx.showToast({
        title: '请先登录',
        icon: 'none',
        duration: 2000
      });
      setTimeout(() => {
        wx.switchTab({
          url: '/pages/mine/mine'
        });
      }, 2000);
      return;
    }
    
    this.setData({
      showModal: true
    });
  },

  goToVideoPage: function() {
    const userInfo = wx.getStorageSync('userInfo');
    if (!userInfo || !userInfo.userId) {
      wx.showToast({
        title: '请先登录',
        icon: 'none',
        duration: 2000
      });
      setTimeout(() => {
        wx.switchTab({ url: '/pages/mine/mine' });
      }, 1500);
      return;
    }

    wx.navigateTo({
      url: '/pages/forum-video/forum-video'
    });
  },

  goToPostPage: function() {
    const userInfo = wx.getStorageSync('userInfo');
    if (!userInfo || !userInfo.userId) {
      wx.showToast({
        title: '请先登录',
        icon: 'none',
        duration: 2000
      });
      setTimeout(() => {
        wx.switchTab({ url: '/pages/mine/mine' });
      }, 1500);
      return;
    }

    wx.navigateTo({
      url: '/pages/forum-post/forum-post'
    });
  },

  goToAddFriend: function() {
    const userInfo = wx.getStorageSync('userInfo');
    if (!userInfo || !userInfo.userId) {
      wx.showToast({
        title: '请先登录',
        icon: 'none',
        duration: 2000
      });
      setTimeout(() => {
        wx.switchTab({ url: '/pages/mine/mine' });
      }, 1500);
      return;
    }

    wx.navigateTo({
      url: '/subpackage_chat/add-friend/add-friend'
    });
  },

  hideUploadModal: function() {
    this.setData({
      showModal: false,
      uploadTitle: '',
      uploadDesc: '',
      uploadVideo: ''
    });
  },

  onTitleInput: function(e) {
    this.setData({
      uploadTitle: e.detail.value
    });
  },

  onDescInput: function(e) {
    this.setData({
      uploadDesc: e.detail.value
    });
  },

  chooseVideo: function() {
    const that = this;
    wx.chooseVideo({
      sourceType: ['album', 'camera'],
      maxDuration: 300,
      camera: 'back',
      success: function(res) {
        that.setData({
          uploadVideo: res.tempFilePath
        });
      }
    });
  },

  removeVideo: function() {
    this.setData({
      uploadVideo: ''
    });
  },

  submitVideo: function() {
    const uploadTitle = this.data.uploadTitle;
    const uploadDesc = this.data.uploadDesc;
    const uploadVideo = this.data.uploadVideo;
    
    if (!uploadTitle || !uploadDesc || !uploadVideo) {
      wx.showToast({
        title: '请填写完整信息',
        icon: 'none',
        duration: 2000
      });
      return;
    }
    
    const newVideo = {
      id: this.data.userVideos.length + 100,
      title: uploadTitle,
      description: uploadDesc,
      video: uploadVideo,
      username: this.data.userInfo.name,
      avatar: this.data.userInfo.avatar,
      time: this.getCurrentTime(),
      status: 'pending',
      statusText: '审核中',
      watched: false,
      pointsEarned: false
    };
    
    const userVideos = this.data.userVideos;
    userVideos.unshift(newVideo);
    
    this.setData({
      userVideos: userVideos,
      showModal: false,
      uploadTitle: '',
      uploadDesc: '',
      uploadVideo: ''
    });
    
    this.saveUserVideos(userVideos);
    
    wx.showToast({
      title: '提交成功，等待审核',
      icon: 'success',
      duration: 2000
    });
    
    setTimeout(() => {
      this.approveVideo(0);
    }, 3000);
  },

  approveVideo: function(index) {
    const userVideos = this.data.userVideos;
    
    if (userVideos[index].status !== 'pending') {
      return;
    }
    
    userVideos[index].status = 'approved';
    userVideos[index].statusText = '已通过';
    
    this.setData({
      userVideos: userVideos
    });
    
    this.saveUserVideos(userVideos);
    
    this.addPoints(30);
    
    wx.showToast({
      title: '审核通过，获得30积分',
      icon: 'success',
      duration: 2000
    });
  },

  approveAllVideos: function() {
    const userVideos = this.data.userVideos;
    let approvedCount = 0;
    
    userVideos.forEach((video, index) => {
      if (video.status === 'pending') {
        video.status = 'approved';
        video.statusText = '已通过';
        approvedCount++;
      }
    });
    
    this.setData({
      userVideos: userVideos
    });
    
    this.saveUserVideos(userVideos);
    
    if (approvedCount > 0) {
      this.addPoints(approvedCount * 30);
      
      wx.showToast({
        title: `审核通过${approvedCount}个视频，获得${approvedCount * 30}积分`,
        icon: 'success',
        duration: 2000
      });
    } else {
      wx.showToast({
        title: '没有待审核的视频',
        icon: 'none',
        duration: 2000
      });
    }
  },

  saveUserVideos: function(videos) {
    wx.setStorageSync('userVideos', videos);
  },

  getCurrentTime: function() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  },

  // 浏览任务相关方法
  startBrowseTimer: function() {
    if (this.data.browseTimer) {
      return;
    }
    
    wx.showToast({
      title: '开始计时，请浏览10秒',
      icon: 'none',
      duration: 2000
    });
    
    const timer = setInterval(() => {
      const newSeconds = this.data.browseSeconds + 1;
      this.setData({
        browseSeconds: newSeconds
      });
      
      // 达到10秒，完成任务
      if (newSeconds >= 10) {
        this.completeBrowseTask();
      }
    }, 1000);
    
    this.setData({
      browseTimer: timer
    });
  },

  pauseBrowseTimer: function() {
    if (this.data.browseTimer) {
      clearInterval(this.data.browseTimer);
      this.setData({
        browseTimer: null
      });
    }
  },

  clearBrowseTimer: function() {
    if (this.data.browseTimer) {
      clearInterval(this.data.browseTimer);
      this.setData({
        browseTimer: null,
        browseSeconds: 0
      });
    }
  },

  completeBrowseTask: function() {
    this.clearBrowseTimer();
    
    const today = new Date().toDateString();
    const completedTasks = wx.getStorageSync('completedTasks_' + today) || [];
    
    if (!completedTasks.includes(this.data.taskId)) {
      completedTasks.push(this.data.taskId);
      wx.setStorageSync('completedTasks_' + today, completedTasks);
      
      // 添加积分到云端
      const userInfo = wx.getStorageSync('userInfo');
      if (userInfo && userInfo.userId) {
        pointsApi.addPoints(userInfo.userId, 5, '浏览内容分享页面').then(res => {
          if (res.success) {
            wx.showToast({
              title: '任务完成，获得5积分',
              icon: 'success',
              duration: 2000
            });
          }
        }).catch(err => {
          console.error('增加积分失败:', err);
        });
      }
      
      this.setData({
        taskCompleted: true
      });
      
      // 2秒后返回任务页面
      setTimeout(() => {
        wx.navigateBack();
      }, 2000);
    }
  }
})
