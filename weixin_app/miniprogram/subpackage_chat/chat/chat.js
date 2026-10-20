const chatApi = require('../../api/chat');
const userApi = require('../../api/user');

Page({
  data: {
    friendId: '',
    friendName: '',
    friendAvatar: '',
    myAvatar: '',
    myId: '',
    messages: [],
    inputText: '',
    showVoice: false,
    showEmoji: false,
    focusInput: false,
    loadingMore: false,
    scrollToMsg: '',
    emojiList: ['😀','😃','😄','😁','😆','😅','🤣','😂','🙂','🙃','😉','😊','😇','🥰','😍','🤩','😘','😗','😚','😙','🥲','😋','😛','😜','🤪','😝','🤑','🤗','🤭','🤫','🤔','🫡','🤐','🤨','😐','😑','😶','🫥','😏','😒','🙄','😬','😮‍💨','🤥','😌','😔','😪','🤤','😴','😷','🤒','🤕','🤢','🤮','🥵','🥶','🥴','😵','🤯','🤠','🥳','🥸','😎','🤓','🧐','👋','🤚','🖐️','✋','🖖','👌','🤌','🤏','✌️','🤞','🤟','🤘','🤙','👈','👉','👆','🖕','👇','☝️','👍','👎','✊','👊','🤛','🤜','👏','🙌','👐','🤲','🤝','🙏','💪','❤️','🧡','💛','💚','💙','💜','🖤','🤍','🤎','💔','❣️','💕','💞','💓','💗','💖','💘','💝']
  },

  _pollTimer: null,
  _latestMsgId: '',

  onLoad: function(options) {
    const userInfo = wx.getStorageSync('userInfo') || {};
    const myId = userInfo.userId || '';
    this.setData({
      friendId: options.friendId || '',
      friendName: decodeURIComponent(options.name || ''),
      friendAvatar: decodeURIComponent(options.avatar || ''),
      myAvatar: userInfo.avatar || userInfo.avatarUrl || '/images/default_avatar.png',
      myId: myId
    });
    wx.setNavigationBarTitle({ title: this.data.friendName });

    // 如果没有头像，从数据库获取
    if (!this.data.friendAvatar && this.data.friendId) {
      this.loadFriendAvatar();
    }

    if (myId) {
      this.loadMessages();
      this.startPolling();
    }
  },

  onUnload: function() {
    this.stopPolling();
  },

  onHide: function() {
    this.stopPolling();
  },

  onShow: function() {
    if (this.data.myId && !this._pollTimer) {
      this.loadMessages();
      this.startPolling();
    }
  },

  // ========== 从数据库获取对方头像 ==========
  loadFriendAvatar: function() {
    const friendId = this.data.friendId;
    if (!friendId) return;

    userApi.getUserInfo(friendId).then(res => {
      if (res.success) {
        const avatar = res.data.avatar || res.data.avatarUrl || '';
        if (avatar) this.setData({ friendAvatar: avatar });
      }
    }).catch(() => {});
    return;
    
    const db = null;
    db.collection('users').doc(friendId).get().then(res => {
      if (res.data) {
        const avatar = res.data.avatar || res.data.avatarUrl || '';
        if (avatar) {
          this.setData({ friendAvatar: avatar });
        }
      }
    }).catch(err => {
      console.warn('获取对方头像失败:', err);
    });
  },

  // ========== 轮询 ==========
  startPolling: function() {
    this.stopPolling();
    this._pollTimer = setInterval(() => {
      this.pollNewMessages();
    }, 3000);
  },

  stopPolling: function() {
    if (this._pollTimer) {
      clearInterval(this._pollTimer);
      this._pollTimer = null;
    }
  },

  pollNewMessages: function() {
    const myId = this.data.myId;
    const friendId = this.data.friendId;
    if (!myId || !friendId) return;

    chatApi.pollLatest(myId, friendId).then(res => {
      if (res.success && res.data) {
        if (res.data._id !== this._latestMsgId) {
          this.loadMessages();
        }
      }
    }).catch(() => {});
  },

  // ========== 加载消息（通过云函数） ==========
  loadMessages: function() {
    const myId = this.data.myId;
    const friendId = this.data.friendId;
    if (!myId || !friendId) {
      console.warn('loadMessages: myId或friendId为空', { myId, friendId });
      return;
    }

    console.log('loadMessages请求: myId=', myId, 'friendId=', friendId);

    chatApi.getMessages(myId, friendId).then(res => {
      console.log('loadMessages返回:', JSON.stringify(res));
      if (!res.success) {
        console.warn('loadMessages失败:', res.errMsg);
        return;
      }
      const myIdStr = String(myId);
      const friendIdStr = String(friendId);
      const messages = (res.data || []).map(msg => ({
        _id: msg._id,
        type: msg.type || 'text',
        content: msg.content,
        fromUserId: msg.fromUserId,
        toUserId: msg.toUserId,
        isRead: msg.isRead,
        createTime: msg.createTime,
        fromMe: String(msg.fromUserId) === myIdStr
      }));

      // 从消息中提取对方的头像和昵称（如果当前没有的话）
      const updateData = { messages: messages };
      if (!this.data.friendAvatar || this.data.friendAvatar === '/images/default_avatar.png') {
        for (let i = res.data.length - 1; i >= 0; i--) {
          const msg = res.data[i];
          if (String(msg.fromUserId) === friendIdStr && msg.fromUserAvatar) {
            updateData.friendAvatar = msg.fromUserAvatar;
            break;
          }
          if (String(msg.toUserId) === friendIdStr && msg.toUserAvatar) {
            updateData.friendAvatar = msg.toUserAvatar;
            break;
          }
        }
      }

      // 记录最新消息ID
      if (messages.length > 0) {
        this._latestMsgId = messages[messages.length - 1]._id;
      }

      this.setData(updateData);
      this.scrollToBottom();
      // 标记已读
      chatApi.markAsRead(myId, friendId).catch(() => {});
    }).catch(err => {
      console.error('加载消息失败:', err);
    });
  },

  // ========== 发送文字消息 ==========
  sendMessage: function() {
    const text = this.data.inputText.trim();
    if (!text) return;

    this.setData({ inputText: '' });
    this.doSend('text', text);
  },

  // ========== 统一发送逻辑（通过云函数） ==========
  doSend: function(type, content) {
    const myId = this.data.myId;
    const friendId = this.data.friendId;
    if (!myId) {
      wx.showToast({ title: '请先登录', icon: 'none' });
      return;
    }

    const userInfo = wx.getStorageSync('userInfo') || {};

    // 乐观更新：先本地显示
    const tempId = 'temp_' + Date.now();
    const localMsg = {
      _id: tempId,
      type: type,
      content: content,
      fromUserId: myId,
      toUserId: friendId,
      isRead: false,
      createTime: new Date(),
      fromMe: true,
      sending: true
    };
    this.setData({
      messages: [...this.data.messages, localMsg]
    });
    this.scrollToBottom();

    // 通过云函数发送
    console.log('sendMessage请求:', { fromUserId: myId, toUserId: friendId, content });
    chatApi.sendMessage({
      fromUserId: myId,
      fromUserName: userInfo.nickName || userInfo.name || '我',
      fromUserAvatar: userInfo.avatar || userInfo.avatarUrl || '',
      toUserId: friendId,
      toUserName: this.data.friendName,
      toUserAvatar: this.data.friendAvatar || '',
      type: type,
      content: content
    }).then(res => {
      if (res.success) {
        // 发送成功，替换临时消息
        const msgs = this.data.messages.map(m => {
          if (m._id === tempId) {
            return { ...m, _id: res.data._id, sending: false };
          }
          return m;
        });
        this._latestMsgId = res.data._id;
        this.setData({ messages: msgs });
      } else {
        throw new Error(res.errMsg);
      }
    }).catch(err => {
      console.error('发送失败:', err);
      const msgs = this.data.messages.map(m => {
        if (m._id === tempId) {
          return { ...m, sending: false, failed: true };
        }
        return m;
      });
      this.setData({ messages: msgs });
      wx.showToast({ title: '发送失败', icon: 'none' });
    });
  },

  // ========== 选择图片发送 ==========
  chooseImage: function() {
    const that = this;
    wx.chooseMedia({
      count: 1,
      mediaType: ['image'],
      sourceType: ['album', 'camera'],
      success: function(res) {
        console.log('chooseMedia成功:', res);
        const tempFile = res.tempFiles[0].tempFilePath;
        
        if (!tempFile) {
          wx.showToast({ title: '获取图片路径失败', icon: 'none' });
          return;
        }
        
        console.log('选择的图片路径:', tempFile);
        wx.showLoading({ title: '发送中...' });
        
        // 根据文件扩展名确定cloudPath后缀
        const extMatch = tempFile.match(/\.(\w+)$/);
        const ext = extMatch ? extMatch[1].toLowerCase() : 'jpg';
        const validExts = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp'];
        const finalExt = validExts.indexOf(ext) !== -1 ? ext : 'jpg';
        
        const cloudPath = 'chat_images/' + Date.now() + '_' + Math.random().toString(36).substr(2, 8) + '.' + finalExt;
        console.log('图片云存储路径:', cloudPath);
        
        (function(options) {
          options.success({ fileID: tempFile });
        })({
          cloudPath: cloudPath,
          filePath: tempFile,
          success: function(uploadRes) {
            console.log('图片上传成功:', uploadRes.fileID);
            wx.hideLoading();
            if (uploadRes.fileID) {
              that.doSend('image', uploadRes.fileID);
            } else {
              wx.showToast({ title: '上传失败：未获取fileID', icon: 'none' });
            }
          },
          fail: function(err) {
            wx.hideLoading();
            console.error('图片上传到云存储失败:', err);
            wx.showModal({
              title: '上传失败',
              content: err.errMsg || '请检查网络后重试',
              showCancel: false
            });
          }
        });
      },
      fail: function(err) {
        console.log('选择图片取消或失败:', err);
        // 用户取消不提示
      }
    });
  },

  // ========== 预览图片 ==========
  previewImage: function(e) {
    const src = e.currentTarget.dataset.src;
    wx.previewImage({ urls: [src], current: src });
  },

  // ========== 头像加载失败处理 ==========
  onAvatarError: function(e) {
    const fromMe = e.currentTarget.dataset.fromMe;
    if (fromMe) {
      this.setData({ myAvatar: '/images/default_avatar.png' });
    } else {
      this.setData({ friendAvatar: '/images/default_avatar.png' });
    }
  },

  onInput: function(e) {
    this.setData({ inputText: e.detail.value });
  },

  switchToVoice: function() {
    this.setData({ showVoice: !this.data.showVoice, showEmoji: false });
  },

  toggleEmoji: function() {
    this.setData({ showEmoji: !this.data.showEmoji, showVoice: false });
  },

  selectEmoji: function(e) {
    const emoji = e.currentTarget.dataset.emoji;
    this.setData({
      inputText: this.data.inputText + emoji
    });
  },

  startRecord: function() {
    wx.showToast({ title: '语音功能开发中', icon: 'none' });
  },

  stopRecord: function() {},

  loadMoreMessages: function() {},

  scrollToBottom: function() {
    setTimeout(() => {
      const len = this.data.messages.length;
      if (len > 0) {
        this.setData({ scrollToMsg: 'msg-' + (len - 1) });
      }
    }, 150);
  }
});
