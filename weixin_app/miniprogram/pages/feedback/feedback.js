// pages/feedback/feedback.js

Page({
  data: {
    // 反馈类型
    activeType: 'bug',
    typeText: {
      bug: '功能异常',
      suggest: '建议反馈',
      complaint: '投诉举报',
      other: '其他问题'
    },
    // 表单
    content: '',
    contact: '',
    images: [],
    maxImages: 4,
    submitting: false,
    // 历史数量
    historyCount: 0
  },

  onLoad() {
    this.loadHistoryCount();
  },

  onShow() {
    this.loadHistoryCount();
  },

  // 选择反馈类型
  selectType(e) {
    const type = e.currentTarget.dataset.type;
    this.setData({ activeType: type });
  },

  // 输入内容
  onContentInput(e) {
    this.setData({ content: e.detail.value });
  },

  onContactInput(e) {
    this.setData({ contact: e.detail.value });
  },

  // 选择图片
  chooseImage() {
    const { images, maxImages } = this.data;
    if (images.length >= maxImages) {
      wx.showToast({ title: `最多上传${maxImages}张`, icon: 'none' });
      return;
    }

    wx.chooseImage({
      count: maxImages - images.length,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        this.setData({
          images: images.concat(res.tempFilePaths)
        });
      }
    });
  },

  // 预览图片
  previewImage(e) {
    const { src } = e.currentTarget.dataset;
    wx.previewImage({
      current: src,
      urls: this.data.images
    });
  },

  // 删除图片
  removeImage(e) {
    const { index } = e.currentTarget.dataset;
    const images = this.data.images.filter((_, i) => i !== index);
    this.setData({ images });
  },

  // 提交反馈
  submitFeedback() {
    var content = this.data.content;
    var contact = this.data.contact;
    var images = this.data.images;
    var submitting = this.data.submitting;
    var activeType = this.data.activeType;
    var typeText = this.data.typeText;
    if (submitting) return;

    if (!content.trim()) {
      wx.showToast({ title: '请输入问题描述', icon: 'none' });
      return;
    }

    this.setData({ submitting: true });
    wx.showLoading({ title: '提交中...', mask: true });

    var that = this;
    // 上传图片（限制数量，压缩）
    var uploadPromise;
    if (images.length > 0) {
      uploadPromise = that.uploadImages(images);
    } else {
      uploadPromise = Promise.resolve([]);
    }

    uploadPromise.then(function(uploadedUrls) {
      var userInfo = wx.getStorageSync('userInfo') || {};
      var feedbackList = wx.getStorageSync('feedbackList') || [];
      feedbackList.unshift({
        _id: 'feedback_' + Date.now(),
        userId: userInfo.userId || '',
        nickname: userInfo.nickname || userInfo.name || '匿名用户',
        type: activeType,
        typeText: typeText[activeType],
        content: content.trim(),
        contact: contact.trim(),
        images: uploadedUrls,
        status: 'pending',
        createTime: new Date().toISOString()
      });
      wx.setStorageSync('feedbackList', feedbackList);
      return { result: { success: true } };

      // 通过云函数提交，设置超时
      return Promise.race([
        Promise.resolve({
          name: 'user_auth',
          data: {
            action: 'submitFeedback',
            userId: userInfo.userId || '',
            nickname: userInfo.nickname || userInfo.name || '匿名用户',
            type: activeType,
            typeText: typeText[activeType],
            content: content.trim(),
            contact: contact.trim(),
            images: uploadedUrls
          }
        }),
        new Promise(function(resolve, reject) {
          setTimeout(function() { reject(new Error('网络超时，请检查网络后重试')); }, 15000);
        })
      ]);
    }).then(function(res) {
      wx.hideLoading();

      if (res.result && res.result.success) {
        wx.showModal({
          title: '提交成功',
          content: '感谢您的反馈，我们会尽快处理！',
          showCancel: false,
          success: function() {
            that.setData({
              content: '',
              contact: '',
              images: [],
              submitting: false
            });
            that.loadHistoryCount();
          }
        });
      } else {
        var errMsg = (res.result && res.result.errMsg) ? res.result.errMsg : '提交失败';
        wx.showToast({ title: errMsg, icon: 'none' });
        that.setData({ submitting: false });
      }
    }).catch(function(err) {
      wx.hideLoading();
      console.error('提交反馈失败:', err);
      var errMsg = err.message || '提交失败，请重试';
      wx.showToast({ title: errMsg, icon: 'none', duration: 2000 });
      that.setData({ submitting: false });
    });
  },

  // 上传图片
  uploadImages(localPaths) {
    return Promise.resolve(localPaths.slice());
    return Promise.all(
      localPaths.map(function(path, index) {
        var extMatch = path.match(/\.\w+$/);
        var ext = extMatch ? extMatch[0] : '.jpg';
        var cloudPath = 'feedback/' + Date.now() + '_' + index + ext;
        return Promise.resolve({
          cloudPath: cloudPath,
          filePath: path
        }).then(function(res) { return res.fileID; }).catch(function(err) {
          console.error('图片上传失败:', err);
          return null; // 上传失败返回 null，不影响其他图片
        });
      })
    ).then(function(urls) { return urls.filter(function(url) { return url !== null; }); }); // 过滤掉上传失败的
  },

  // 加载历史数量
  loadHistoryCount() {
    const userInfo = wx.getStorageSync('userInfo');
    if (!userInfo || !userInfo.userId) {
      this.setData({ historyCount: 0 });
      return;
    }

    const feedbackList = wx.getStorageSync('feedbackList') || [];
    const ownList = feedbackList.filter(function(item) {
      return !item.userId || String(item.userId) === String(userInfo.userId);
    });
    this.setData({ historyCount: ownList.length });
    return;

    Promise.resolve({
      name: 'user_auth',
      data: { action: 'getFeedbackList', userId: userInfo.userId }
    }).then(res => {
      if (res.result && res.result.success) {
        this.setData({ historyCount: res.result.data.list.length });
      }
    }).catch(() => {});
  },

  // 跳转历史记录
  goToHistory() {
    wx.navigateTo({ url: '/pages/feedback-history/feedback-history' });
  }
});
