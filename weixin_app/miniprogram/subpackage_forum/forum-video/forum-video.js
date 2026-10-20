Page({
  data: {
    videoUrl: ''
  },

  onLoad(options) {
    const fileID = options.fileID ? decodeURIComponent(options.fileID) : '';
    const videoPath = options.videoPath ? decodeURIComponent(options.videoPath) : '';
    const source = videoPath || fileID;

    if (!source || source.indexOf('cloud://') === 0) {
      wx.showToast({ title: '本地视频不存在', icon: 'none' });
      return;
    }
    this.setData({ videoUrl: source });
  }
});
