// spots.js
const ICONS = require('../../utils/icons');

Page({
  data: {
    icons: ICONS,
    mapCenter: { lat: 23.02, lng: 113.12 },
    mapScale: 11,
    markers: [],
    selectedSpot: null,
    searchKey: '',
    activeFilter: 'all',
    filterTabs: [
      { key: 'all', label: '全部', icon: '🏠' },
      { key: 'wushu', label: '武术', icon: '🥋' },
      { key: 'lishi', label: '历史', icon: '📜' },
      { key: 'wenhua', label: '文化', icon: '🎨' },
      { key: 'tiyu', label: '体育', icon: '🏅' }
    ],
    spots: [
      { mbti: 'INTJ', name: '叶问', tag: '咏春宗师', iconKey: 'intj', category: 'wushu',
        spotName: '叶问纪念馆', address: '佛山市南海区狮山镇罗村联星乐安西街',
        lat: 23.0290, lng: 113.1130,
        highlights: ['桑园大宅', '木人桩', '咏春文史'],
        recommend: '咏春圣地，沉浸式感受宗师风骨',
        desc: '叶问纪念馆位于叶问宗师的故乡佛山南海，馆内陈列了大量咏春拳历史文物、叶问宗师生平事迹及珍贵照片。桑园大宅原貌复建，木人桩阵列威严，是武术爱好者朝圣的必访之地。',
        openTime: '09:00-17:00（周一闭馆）',
        ticket: '免费参观',
        tips: ['建议游览1-2小时', '可体验木人桩实操', '周边有叶问故居遗址'],
        bg: 'linear-gradient(135deg, #FCE4EC, #FFCDD2)', color: '#C0392B' },
      { mbti: 'INFJ', name: '戴鸿慈', tag: '清末革新名臣', iconKey: 'infj', category: 'lishi',
        spotName: '戴鸿慈故居', address: '佛山市南海区西樵镇大同村',
        lat: 23.0180, lng: 112.9360,
        highlights: ['清代官宅', '近代外交史料'],
        recommend: '探秘晚清革新名臣故里，读懂近代历史',
        desc: '戴鸿慈故居保存了清代官宅的建筑格局，馆内展示了其出洋考察宪政的珍贵史料与日记手稿，是了解清末改革和近代外交的重要窗口。',
        openTime: '09:00-17:00',
        ticket: '免费参观',
        tips: ['可与西樵山联动游览', '村内保留岭南古建筑群', '建议请导游讲解'],
        bg: 'linear-gradient(135deg, #FFF8E1, #FFE0B2)', color: '#8B4513' },
      { mbti: 'ISTJ', name: '詹天佑', tag: '铁路之父', iconKey: 'istj', category: 'lishi',
        spotName: '詹天佑纪念馆', address: '佛山市南海区九江镇下西村',
        lat: 22.9860, lng: 113.0150,
        highlights: ['铁路工程展', '故居原貌'],
        recommend: '中国铁路先驱故里，工科研学必去',
        desc: '詹天佑纪念馆全面展示了中国铁路之父的生平事迹和工程成就，馆内复原了京张铁路人字形线路模型，是工科研学的绝佳目的地。',
        openTime: '09:00-17:00（周一闭馆）',
        ticket: '免费参观',
        tips: ['适合亲子研学', '铁路模型互动体验', '馆外有纪念公园'],
        bg: 'linear-gradient(135deg, #E3F2FD, #BBDEFB)', color: '#2980B9' },
      { mbti: 'ISFJ', name: '梁赞', tag: '咏春鼻祖', iconKey: 'isfj', category: 'wushu',
        spotName: '梁赞咏春堂', address: '佛山市禅城区快子路历史街区',
        lat: 23.0180, lng: 113.1160,
        highlights: ['咏春溯源', '古巷民居'],
        recommend: '叶问师爷故居，武术文化源头打卡',
        desc: '梁赞咏春堂位于佛山禅城历史街区内，是咏春拳宗师梁赞授拳之地。古巷深处，青砖灰瓦，感受最原汁原味的咏春发源文化。',
        openTime: '全天开放（外观）',
        ticket: '免费参观',
        tips: ['结合快子路历史街区游览', '可参观周边武术馆', '拍照打卡圣地'],
        bg: 'linear-gradient(135deg, #E8F5E9, #C8E6C9)', color: '#27AE60' },
      { mbti: 'INTP', name: '邹伯奇', tag: '岭南科学先驱', iconKey: 'intp', category: 'wenhua',
        spotName: '邹伯奇纪念馆', address: '佛山市南海区大沥镇黄岐伯奇公园',
        lat: 23.1160, lng: 113.1870,
        highlights: ['中国首台照相机', '天文科普'],
        recommend: '近代科学奇才故里，边玩边学涨知识',
        desc: '邹伯奇纪念馆坐落于伯奇公园内，展示了中国照相机之父的发明创造成果，包括自制的照相机复制品、天文仪器和数学手稿，是科普教育的宝藏景点。',
        openTime: '09:00-17:30',
        ticket: '免费参观',
        tips: ['公园环境优美适合休闲', '天文科普互动展', '适合学生研学'],
        bg: 'linear-gradient(135deg, #F3E5F5, #E1BEE7)', color: '#8E44AD' },
      { mbti: 'ISTP', name: '李小龙', tag: '功夫革新者', iconKey: 'istp', category: 'wushu',
        spotName: '李小龙祖居', address: '佛山市顺德区均安镇上村',
        lat: 22.7220, lng: 113.1310,
        highlights: ['岭南青砖厝', '功夫史料'],
        recommend: '龙迷朝圣地，探访功夫传奇起点',
        desc: '李小龙祖居是一座典型的岭南青砖民居，馆内陈列了李小龙的生平事迹、电影海报及功夫哲学文献。每年吸引大量国际龙迷前来朝圣。',
        openTime: '09:00-17:30',
        ticket: '免费参观',
        tips: ['建议游览1小时', '周边有李小龙乐园', '可品尝均安蒸猪'],
        bg: 'linear-gradient(135deg, #FFFDE7, #FFF9C4)', color: '#FF8C00' },
      { mbti: 'ENTJ', name: '陈启沅', tag: '实业开拓者', iconKey: 'entj', category: 'lishi',
        spotName: '陈启沅纪念馆', address: '佛山市南海区西樵镇简村',
        lat: 22.9690, lng: 112.9280,
        highlights: ['继昌隆缫丝厂', '近代实业展'],
        recommend: '中国民族工业先驱，研学必游',
        desc: '陈启沅纪念馆展示了中国近代民族工业先驱的创业历程，馆内复原了继昌隆缫丝厂的场景，是了解中国近代工业化进程的重要场所。',
        openTime: '09:00-17:00',
        ticket: '免费参观',
        tips: ['可与西樵山联游', '缫丝工艺体验', '村内岭南古建筑群'],
        bg: 'linear-gradient(135deg, #FFEBEE, #FFCDD2)', color: '#C0392B' },
      { mbti: 'ENTP', name: '伦文叙', tag: '明代状元', iconKey: 'entp', category: 'wenhua',
        spotName: '伦文叙故居', address: '佛山市禅城区澜石黎涌村',
        lat: 23.0050, lng: 113.1020,
        highlights: ['状元文化', '岭南古村'],
        recommend: '佛山状元故里，感受书香文脉',
        desc: '伦文叙故居位于黎涌古村内，保留了明代岭南民居的建筑风貌。作为佛山状元文化的象征，每年吸引众多学子前来祈福。',
        openTime: '全天开放（外观）',
        ticket: '免费参观',
        tips: ['状元井可投币祈福', '古村风貌保存完好', '适合文化摄影'],
        bg: 'linear-gradient(135deg, #E0F7FA, #B2EBF2)', color: '#16A085' },
      { mbti: 'ENFJ', name: '康有为', tag: '变法领袖', iconKey: 'enfj', category: 'lishi',
        spotName: '康有为故居（延香老屋）', address: '佛山市南海区丹灶镇苏村',
        lat: 23.0210, lng: 112.9050,
        highlights: ['国保单位', '镬耳屋', '康园'],
        recommend: '戊戌变法领袖故居，历史深度游',
        desc: '康有为故居是全国重点文物保护单位，典型岭南镬耳屋建筑，馆内设有康园展览区，全面展示维新运动的历史脉络。',
        openTime: '09:00-17:00（周一闭馆）',
        ticket: '免费参观',
        tips: ['国保单位值得细看', '康园景区较大需2-3小时', '适合历史爱好者'],
        bg: 'linear-gradient(135deg, #FFF8E1, #FFE0B2)', color: '#D2691E' },
      { mbti: 'ENFP', name: '薛觉先', tag: '粤剧宗师', iconKey: 'enfp', category: 'wenhua',
        spotName: '薛觉先纪念亭', address: '佛山市顺德区龙江镇',
        lat: 22.8500, lng: 113.1100,
        highlights: ['粤剧文史', '岭南曲艺展'],
        recommend: '粤剧泰斗故里，感受岭南曲艺魅力',
        desc: '薛觉先纪念亭为纪念粤剧一代宗师而建，亭内展有薛派艺术的珍贵资料与戏服道具，是感受岭南曲艺文化的清雅之所。',
        openTime: '全天开放',
        ticket: '免费参观',
        tips: ['周边有粤剧文化广场', '偶尔有粤剧演出', '龙江煎堆值得品尝'],
        bg: 'linear-gradient(135deg, #FCE4EC, #F8BBD0)', color: '#E91E63' },
      { mbti: 'ESFJ', name: '黄飞鸿', tag: '洪拳大家', iconKey: 'esfj', category: 'wushu',
        spotName: '黄飞鸿纪念馆', address: '佛山市禅城区祖庙路祖庙内',
        lat: 23.0300, lng: 113.1139,
        highlights: ['宝芝林', '醒狮表演', '武术文物'],
        recommend: '佛山必打卡，祖庙内的武侠地标',
        desc: '黄飞鸿纪念馆位于佛山祖庙景区内，馆内复原了宝芝林药铺场景，陈列武术文物与医书典籍。每天定时上演精彩的醒狮和武术表演。',
        openTime: '08:30-18:00',
        ticket: '祖庙门票20元',
        tips: ['醒狮表演每天3场', '含在祖庙门票内', '建议预留半天游览祖庙'],
        bg: 'linear-gradient(135deg, #FFF3E0, #FFE0B2)', color: '#E67E22' },
      { mbti: 'ESFP', name: '叶准', tag: '咏春传人', iconKey: 'esfp', category: 'wushu',
        spotName: '叶问堂（祖庙）', address: '佛山市禅城区祖庙路祖庙景区',
        lat: 23.0300, lng: 113.1140,
        highlights: ['咏春传承展', '宗师遗物'],
        recommend: '近距离感受咏春传承，拍照出片',
        desc: '叶问堂位于祖庙景区内，是专门纪念咏春宗师叶问的展览馆，展示了叶问及叶准的咏春传承历程，是武术迷的打卡地标。',
        openTime: '08:30-18:00',
        ticket: '祖庙门票20元',
        tips: ['与黄飞鸿纪念馆相邻', '可一次性游览', '馆内拍照出片'],
        bg: 'linear-gradient(135deg, #E8F5E9, #C8E6C9)', color: '#2ECC71' },
      { mbti: 'INFP', name: '黄少强', tag: '岭南国画名家', iconKey: 'infp', category: 'wenhua',
        spotName: '黄少强纪念馆', address: '佛山市南海区西樵镇',
        lat: 23.0190, lng: 112.9370,
        highlights: ['岭南画派真迹', '民生主题画作'],
        recommend: '文艺青年必逛，感受家国艺术情怀',
        desc: '黄少强纪念馆收藏了这位岭南画派名家的真迹作品，以民生疾苦为题材的画作令人动容，是文艺爱好者感受家国情怀的艺术圣地。',
        openTime: '09:00-17:00',
        ticket: '免费参观',
        tips: ['可与西樵山联游', '画展定期更新', '适合静心欣赏'],
        bg: 'linear-gradient(135deg, #F3E5F5, #E1BEE7)', color: '#9B59B6' },
      { mbti: 'ISFP', name: '潘玉书', tag: '石湾陶艺大师', iconKey: 'isfp', category: 'wenhua',
        spotName: '石湾陶瓷博物馆', address: '佛山市禅城区石湾镇高庙路',
        lat: 23.0080, lng: 113.1080,
        highlights: ['石湾公仔', '陶艺大师作品展'],
        recommend: '陶艺圣地，看岭南非遗匠心之作',
        desc: '石湾陶瓷博物馆是中国首家以陶瓷文化为主题的专业博物馆，馆藏丰富的石湾公仔和历代陶艺精品，还可亲身体验陶艺制作。',
        openTime: '09:00-17:00（周一闭馆）',
        ticket: '免费参观',
        tips: ['可体验陶艺DIY', '南风古灶就在旁边', '石湾公仔可购买留念'],
        bg: 'linear-gradient(135deg, #EFEBE9, #D7CCC8)', color: '#795548' },
      { mbti: 'ESTJ', name: '伍秉鉴', tag: '清代富商巨贾', iconKey: 'estj', category: 'lishi',
        spotName: '伍秉鉴故居遗址', address: '佛山市南海区盐步直街',
        lat: 23.0800, lng: 113.1900,
        highlights: ['清代商帮文化', '岭南富商故居'],
        recommend: '探秘世界首富故里，读懂清代商业史',
        desc: '伍秉鉴故居遗址见证了清代广州十三行商帮的辉煌历史，虽仅存遗址，但周边街区仍保留了清代商贸文化的痕迹，是商业史爱好者的寻宝之地。',
        openTime: '全天开放（外观）',
        ticket: '免费参观',
        tips: ['盐步直街值得漫步', '周边有传统美食', '建议结合商业史了解'],
        bg: 'linear-gradient(135deg, #E3F2FD, #BBDEFB)', color: '#34495E' },
      { mbti: 'ESTP', name: '何冲', tag: '顶尖竞技运动员', iconKey: 'estp', category: 'tiyu',
        spotName: '顺德体育中心', address: '佛山市顺德区大良街道',
        lat: 22.8000, lng: 113.2700,
        highlights: ['跳水冠军故里', '顺德体育名片'],
        recommend: '奥运冠军家乡，感受顺德体育精神',
        desc: '顺德体育中心是奥运跳水冠军何冲的家乡体育地标，设有标准游泳跳水场馆，是感受顺德体育精神和冠军文化的运动打卡地。',
        openTime: '06:00-22:00',
        ticket: '部分场馆收费',
        tips: ['可体验游泳跳水', '周边顺德美食云集', '体育文化氛围浓厚'],
        bg: 'linear-gradient(135deg, #E0F2F1, #B2DFDB)', color: '#00BCD4' }
    ],
    filteredSpots: [],
    showDetail: false,
    currentSpot: null
  },

  onLoad: function () {
    this.setData({ filteredSpots: this.data.spots });
    this._buildMarkers();
  },

  _buildMarkers: function () {
    var spots = this.data.filteredSpots;
    var icons = this.data.icons;
    var markers = [];
    for (var i = 0; i < spots.length; i++) {
      var s = spots[i];
      markers.push({
        id: i,
        latitude: s.lat,
        longitude: s.lng,
        title: s.name + ' · ' + s.spotName,
        iconPath: icons[s.iconKey] || '/images/icons/map-pin.png',
        width: 28,
        height: 28,
        callout: {
          content: s.name + '\n' + s.spotName,
          color: '#333',
          fontSize: 12,
          borderRadius: 8,
          bgColor: '#fff',
          padding: 8,
          display: 'BYCLICK'
        }
      });
    }
    this.setData({ markers: markers });
  },

  // 搜索
  onSearchInput: function (e) {
    this.setData({ searchKey: e.detail.value });
    this._filterSpots();
  },

  clearSearch: function () {
    this.setData({ searchKey: '' });
    this._filterSpots();
  },

  // 分类筛选
  switchFilter: function (e) {
    var key = e.currentTarget.dataset.key;
    this.setData({ activeFilter: key });
    this._filterSpots();
  },

  _filterSpots: function () {
    var list = this.data.spots;
    var key = this.data.activeFilter;
    var search = this.data.searchKey.trim().toLowerCase();

    if (key !== 'all') {
      list = list.filter(function (s) { return s.category === key; });
    }
    if (search) {
      list = list.filter(function (s) {
        return s.name.toLowerCase().indexOf(search) > -1 ||
               s.spotName.toLowerCase().indexOf(search) > -1 ||
               s.address.toLowerCase().indexOf(search) > -1 ||
               s.tag.toLowerCase().indexOf(search) > -1 ||
               s.mbti.toLowerCase().indexOf(search) > -1;
      });
    }
    this.setData({ filteredSpots: list });
    this._buildMarkers();
  },

  // 地图标记点击
  onMarkerTap: function (e) {
    var id = e.markerId;
    var spot = this.data.filteredSpots[id];
    if (spot) {
      this.setData({
        selectedSpot: spot,
        mapCenter: { lat: spot.lat, lng: spot.lng },
        mapScale: 14
      });
    }
  },

  // 列表景点点击 -> 打开详情弹窗
  goToSpot: function (e) {
    var index = e.currentTarget.dataset.index;
    var spot = this.data.filteredSpots[index];
    if (spot) {
      this.setData({
        showDetail: true,
        currentSpot: spot,
        mapCenter: { lat: spot.lat, lng: spot.lng },
        mapScale: 14
      });
    }
  },

  // 关闭详情弹窗
  onCloseDetail: function () {
    this.setData({ showDetail: false, currentSpot: null });
  },

  // 导航到景点
  navigateToSpot: function () {
    var spot = this.data.currentSpot;
    if (!spot) return;
    wx.openLocation({
      latitude: spot.lat,
      longitude: spot.lng,
      name: spot.spotName,
      address: spot.address,
      scale: 16
    });
  },

  // 跳转到名人堂查看该人物
  goToFigure: function () {
    var spot = this.data.currentSpot;
    if (!spot) return;
    wx.switchTab({ url: '/pages/famous-hall/famous-hall' });
  },

  // 选中景点卡片的定位
  locateSpot: function (e) {
    var index = e.currentTarget.dataset.index;
    var spot = this.data.filteredSpots[index];
    if (spot) {
      this.setData({
        selectedSpot: spot,
        mapCenter: { lat: spot.lat, lng: spot.lng },
        mapScale: 14
      });
      wx.pageScrollTo({ scrollTop: 0, duration: 300 });
    }
  }
});
