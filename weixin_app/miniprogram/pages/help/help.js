// pages/help/help.js
Page({
  data: {
    // FAQ 分类
    categories: [
      { id: 'account', name: '账号问题' },
      { id: 'points', name: '积分相关' },
      { id: 'video', name: '视频学习' },
      { id: 'forum', name: '话题论坛' },
      { id: 'other', name: '其他问题' }
    ],
    activeCategory: 'account',
    
    // FAQ 数据
    faqData: {
      account: [
        { q: '如何注册账号？', a: '在"我的"页面点击"立即登录/注册"，输入手机号获取验证码即可快速注册。新用户注册可获得300积分奖励。' },
        { q: '忘记密码怎么办？', a: '您可以使用手机号+验证码的方式登录，无需密码。如需重置密码，请联系客服处理。' },
        { q: '如何修改昵称和头像？', a: '进入"我的" → "用户管理" → 点击"修改资料"，即可修改昵称和头像。' },
        { q: '如何退出登录？', a: '在"我的"页面点击"退出登录"按钮即可。' }
      ],
      points: [
        { q: '积分有什么用？', a: '积分可用于解锁红色基地的付费视频、兑换优惠券、购买文创商品等。' },
        { q: '如何获取积分？', a: '注册赠送300积分、每日签到、完成每日任务、发布话题、发表评论等都可以获得积分奖励。' },
        { q: '为什么积分变少了？', a: '观看付费视频会消耗积分，您可以在"我的"页面查看积分记录了解详细扣减情况。' },
        { q: '积分可以转赠吗？', a: '目前积分暂不支持转赠功能，后续版本会考虑开放。' }
      ],
      video: [
        { q: '视频无法播放怎么办？', a: '请检查网络连接是否正常，尝试切换WiFi或移动网络。如仍有问题，请在"问题反馈"中提交反馈。' },
        { q: '为什么有些视频需要积分？', a: '部分优质学习资源需要积分解锁观看，这是为了激励用户积极参与平台互动。' },
        { q: '视频可以下载吗？', a: '受版权保护，视频暂不支持下载，请在线观看学习。' },
        { q: '如何上传视频？', a: '在话题广场点击右上角"+"按钮，切换到"视频"标签即可上传您的视频作品。' }
      ],
      forum: [
        { q: '如何发布话题？', a: '进入"话题广场"，点击右上角"+"按钮，填写标题和内容即可发布话题帖子。' },
        { q: '发布内容有什么要求？', a: '请遵守社区规范，禁止发布违法违规、低俗暴力、广告推广等内容，违者将封禁账号。' },
        { q: '如何删除自己发布的内容？', a: '在"我的" → "发表记录"中找到对应内容，点击删除按钮即可。' },
        { q: '为什么我的话题被删除了？', a: '可能违反了社区规范，被管理员删除。如有疑问，请通过"问题反馈"联系客服。' }
      ],
      other: [
        { q: '如何联系客服？', a: '您可以通过"问题反馈"提交您的问题，我们会在1-3个工作日内回复。' },
        { q: '小程序闪退怎么办？', a: '请尝试清理微信缓存、更新微信版本或重新安装小程序。如仍有问题请提交反馈。' },
        { q: '如何投诉举报？', a: '发现违规内容请通过"问题反馈"提交举报，并提供相关截图，我们会及时处理。' },
        { q: '有意见建议怎么提？', a: '非常欢迎！请通过"问题反馈"提交您的宝贵建议，我们会认真倾听并持续改进。' }
      ]
    },

    // 当前展开的问题
    expandedIndex: -1,

    // 联系方式
    contactInfo: {
      email: '741631309@qq.com',
      phone: '13798716085'
    }
  },

  // 切换分类
  switchCategory(e) {
    const id = e.currentTarget.dataset.id;
    this.setData({
      activeCategory: id,
      expandedIndex: -1
    });
  },

  // 展开/收起问题
  toggleFaq(e) {
    const index = e.currentTarget.dataset.index;
    const { expandedIndex } = this.data;
    this.setData({
      expandedIndex: expandedIndex === index ? -1 : index
    });
  },

  // 复制文本
  copyText(e) {
    const text = e.currentTarget.dataset.text;
    wx.setClipboardData({
      data: text,
      success: () => {
        wx.showToast({ title: '已复制', icon: 'success' });
      }
    });
  },

  // 拨打电话
  callPhone() {
    wx.makePhoneCall({
      phoneNumber: this.data.contactInfo.phone,
      fail: () => {
        wx.showToast({ title: '拨打失败', icon: 'none' });
      }
    });
  },

  // 跳转反馈
  goToFeedback() {
    wx.navigateTo({ url: '/pages/feedback/feedback' });
  }
});
