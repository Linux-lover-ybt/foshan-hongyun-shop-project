// subpackage_forum/publish-topic/publish-topic.js
const pointsApi = require('../../api/points');
const forumStore = require('../../utils/forum-store');

const DEFAULT_TAGS = ['综合', '红色文化', '革命故事', '红色基地', '文化传承', '读书感悟', '历史探秘', '生活分享'];

Page({
  data: {
    mode: 'topic',       // topic / video
    content: '',
    images: [],
    topicTag: '综合',
    tags: DEFAULT_TAGS,
    showTagPicker: false,
    submitting: false,
    userInfo: null,
    maxImages: 9,
    // 视频模式字段
    videoTitle: '',
    videoTempPath: ''
  },

  onLoad(options) {
    const userInfo = wx.getStorageSync('userInfo');
    if (!userInfo || !userInfo.userId) {
      wx.showToast({ title: '请先登录', icon: 'none' });
      setTimeout(() => wx.navigateBack(), 1500);
      return;
    }
    const mode = options.mode || 'topic';
    const category = options.category || '综合';
    wx.setNavigationBarTitle({ title: mode === 'video' ? '上传视频' : '发布话题' });
    this.setData({ userInfo, mode, topicTag: category });
    this.loadCloudTags();
  },

  loadCloudTags() {
    forumStore.getHotTags().then(res => {
      if (res.success && res.data.length > 0) {
        const cloudTags = res.data.map(t => t.name);
        const merged = [...new Set([...cloudTags, ...DEFAULT_TAGS])];
        this.setData({ tags: merged });
      }
    }).catch(() => {});
  },

  // ========== 内容输入 ==========

  onContentInput(e) {
    this.setData({ content: e.detail.value });
  },

  onVideoTitleInput(e) {
    this.setData({ videoTitle: e.detail.value });
  },

  // ========== 标签选择 ==========

  toggleTagPicker() {
    this.setData({ showTagPicker: !this.data.showTagPicker });
  },

  selectTag(e) {
    const tag = e.currentTarget.dataset.tag;
    this.setData({ topicTag: tag, showTagPicker: false });
  },

  // ========== 话题：图片 ==========

  chooseImage() {
    const remaining = this.data.maxImages - this.data.images.length;
    if (remaining <= 0) {
      wx.showToast({ title: `最多上传${this.data.maxImages}张图片`, icon: 'none' });
      return;
    }
    wx.chooseImage({
      count: remaining,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        this.setData({ images: [...this.data.images, ...res.tempFilePaths] });
      }
    });
  },

  removeImage(e) {
    const index = e.currentTarget.dataset.index;
    const images = this.data.images.slice();
    images.splice(index, 1);
    this.setData({ images });
  },

  previewImage(e) {
    const url = e.currentTarget.dataset.url;
    wx.previewImage({ current: url, urls: this.data.images });
  },

  // ========== 视频：选择 ==========

  chooseVideo() {
    wx.chooseMedia({
      count: 1,
      mediaType: ['video'],
      sourceType: ['album', 'camera'],
      maxDuration: 600,
      success: (res) => {
        this.setData({ videoTempPath: res.tempFiles[0].tempFilePath });
      }
    });
  },

  removeVideo() {
    this.setData({ videoTempPath: '' });
  },

  // ========== 统一提交 ==========

  submitContent() {
    if (this.data.mode === 'video') {
      this.submitVideo();
    } else {
      this.submitTopic();
    }
  },

  // ---- 提交话题 ----

  submitTopic() {
    const { content, images, topicTag, userInfo, submitting } = this.data;
    if (submitting) return;
    if (!content.trim() && images.length === 0) {
      wx.showToast({ title: '请输入内容或上传图片', icon: 'none' });
      return;
    }

    this.setData({ submitting: true });
    wx.showLoading({ title: '发布中...' });

    if (images.length > 0) {
      this.uploadImages(images).then(cloudIds => {
        return this.createTopic(content.trim(), cloudIds, topicTag, userInfo);
      }).then(() => {
        this.onPublishSuccess('发布话题');
      }).catch(err => {
        console.error('发布失败:', err);
        wx.hideLoading();
        wx.showToast({ title: '发布失败，请重试', icon: 'none' });
        this.setData({ submitting: false });
      });
    } else {
      this.createTopic(content.trim(), [], topicTag, userInfo).then(() => {
        this.onPublishSuccess('发布话题');
      }).catch(err => {
        console.error('发布失败:', err);
        wx.hideLoading();
        wx.showToast({ title: '发布失败，请重试', icon: 'none' });
        this.setData({ submitting: false });
      });
    }
  },

  // ---- 提交视频 ----

  submitVideo() {
    const { videoTitle, content, videoTempPath, topicTag, userInfo, submitting } = this.data;
    if (submitting) return;
    if (!videoTitle.trim()) {
      wx.showToast({ title: '请输入视频标题', icon: 'none' });
      return;
    }
    if (!videoTempPath) {
      wx.showToast({ title: '请选择视频', icon: 'none' });
      return;
    }

    console.log('提交视频参数:', { videoTitle, content, topicTag, userId: userInfo.userId });

    this.setData({ submitting: true });
    wx.showLoading({ title: '上传中...' });

    forumStore.createVideo({
      title: videoTitle.trim(),
      description: content.trim(),
      fileID: videoTempPath,
      category: topicTag,
      userId: userInfo.userId,
      nickname: userInfo.nickname || userInfo.name || '匿名用户',
      avatarUrl: userInfo.avatarUrl || userInfo.avatar || ''
    }).then(res => {
      wx.hideLoading();
      if (res.success) {
        this.onPublishSuccess('上传视频');
      } else {
        wx.showToast({ title: res.errMsg || '上传失败', icon: 'none' });
        this.setData({ submitting: false });
      }
    }).catch(err => {
      wx.hideLoading();
      console.error('save video failed:', err);
      wx.showToast({ title: '上传失败', icon: 'none' });
      this.setData({ submitting: false });
    });
    return;

    const extMatch = videoTempPath.match(/\.\w+$/);
    const ext = extMatch ? extMatch[0] : '.mp4';
    const cloudPath = `topic_videos/${Date.now()}_${Math.random().toString(36).substring(2, 8)}${ext}`;

    console.log('视频云存储路径:', cloudPath);

    Promise.resolve({
      cloudPath,
      filePath: videoTempPath,
      success: (uploadRes) => {
        console.log('视频上传成功:', uploadRes.fileID);
        Promise.resolve({
          name: 'forum',
          data: {
            action: 'createVideo',
            title: videoTitle.trim(),
            description: content.trim(),
            fileID: uploadRes.fileID,
            category: topicTag,
            userId: userInfo.userId,
            nickname: userInfo.nickname || userInfo.name || '匿名用户',
            avatarUrl: userInfo.avatarUrl || userInfo.avatar || ''
          }
        }).then(res => {
          console.log('创建视频记录返回:', res);
          wx.hideLoading();
          if (res.result && res.result.success) {
            this.onPublishSuccess('上传视频');
          } else {
            wx.showToast({ title: (res.result && res.result.errMsg) ? res.result.errMsg : '上传失败', icon: 'none' });
            this.setData({ submitting: false });
          }
        }).catch(err => {
          wx.hideLoading();
          console.error('创建视频记录失败:', err);
          wx.showToast({ title: '上传失败: ' + (err.errMsg || '未知错误'), icon: 'none' });
          this.setData({ submitting: false });
        });
      },
      fail: (err) => {
        wx.hideLoading();
        console.error('视频上传失败:', err);
        wx.showToast({ title: '视频上传失败，请重试', icon: 'none' });
        this.setData({ submitting: false });
      }
    });
  },

  // ========== 上传图片 ==========

  uploadImages(images) {
    return Promise.resolve(images.slice());
    return new Promise((resolve, reject) => {
      const cloudIds = [];
      let currentIndex = 0;
      const uploadNext = () => {
        if (currentIndex >= images.length) { resolve(cloudIds); return; }
        const filePath = images[currentIndex];
        const ext = filePath.match(/\.\w+$/)[0] || '.jpg';
        const cloudPath = `topic_images/${Date.now()}_${currentIndex}_${Math.random().toString(36).substring(2, 8)}${ext}`;
        Promise.resolve({
          cloudPath, filePath,
          success: (res) => { cloudIds.push(res.fileID); currentIndex++; uploadNext(); },
          fail: (err) => { console.error('图片上传失败:', err); reject(err); }
        });
      };
      uploadNext();
    });
  },

  createTopic(content, cloudImageIds, topicTag, userInfo) {
    return forumStore.createTopic({
      content,
      images: cloudImageIds,
      topicTag,
      userId: userInfo.userId,
      nickname: userInfo.nickname || userInfo.name || '匿名用户',
      avatarUrl: userInfo.avatarUrl || userInfo.avatar || ''
    });
    console.log('创建话题参数:', { content, images: cloudImageIds, topicTag, userId: userInfo.userId });
    
    return Promise.resolve({
      name: 'forum',
      data: {
        action: 'createTopic',
        content, images: cloudImageIds, topicTag,
        userId: userInfo.userId,
        nickname: userInfo.nickname || userInfo.name || '匿名用户',
        avatarUrl: userInfo.avatarUrl || userInfo.avatar || ''
      }
    }).then(res => {
      console.log('创建话题云函数返回:', res);
      if (res.result && res.result.success) return res.result;
      else throw new Error(res.result ? res.result.errMsg : '云函数返回异常');
    }).catch(err => {
      console.error('创建话题云函数调用失败:', err);
      throw err;
    });
  },

  onPublishSuccess(actionName) {
    wx.hideLoading();
    const userInfo = this.data.userInfo;
    if (userInfo && userInfo.userId) {
      pointsApi.addPoints(userInfo.userId, 10, actionName).catch(() => {});
    }
    const today = new Date().toDateString();
    const completedTasks = wx.getStorageSync('completedTasks_' + today) || [];
    if (!completedTasks.includes('post')) {
      completedTasks.push('post');
      wx.setStorageSync('completedTasks_' + today, completedTasks);
    }
    wx.showToast({ title: `${actionName}成功 +10积分`, icon: 'success' });
    setTimeout(() => wx.navigateBack(), 1500);
  }
});
