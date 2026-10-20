Page({
  data: {
    currentIndex: 0,
    selectedValue: 0,
    showResult: false,
    progress: 0,
    questions: [
      // E/I \u5916\u5411\u5185\u5411 1-6
      { text: '\u6211\u559c\u6b22\u4e3b\u52a8\u793e\u4ea4\uff0c\u9760\u4e0e\u4eba\u76f8\u5904\u6062\u590d\u72b6\u6001', dimension: 'EI' },
      { text: '\u6211\u4e50\u4e8e\u4e3b\u52a8\u7ed3\u8bc6\u65b0\u670b\u53cb\uff0c\u4e0d\u5bb3\u6015\u964c\u751f\u573a\u5408', dimension: 'EI' },
      { text: '\u6211\u4e60\u60ef\u4e3b\u52a8\u8868\u8fbe\u60f3\u6cd5\uff0c\u4e0d\u559c\u6b22\u618b\u5728\u5fc3\u91cc', dimension: 'EI' },
      { text: '\u96c6\u4f53\u6d3b\u52a8\u4e2d\uff0c\u6211\u613f\u610f\u4e3b\u52a8\u53d1\u8a00\u3001\u5e26\u52a8\u6c1b\u56f4', dimension: 'EI' },
      { text: '\u6211\u66f4\u559c\u6b22\u70ed\u95f9\u73af\u5883\uff0c\u800c\u975e\u957f\u671f\u72ec\u81ea\u5b89\u9759', dimension: 'EI' },
      { text: '\u9047\u5230\u60f3\u6cd5\u4e0e\u611f\u53d7\uff0c\u6211\u613f\u610f\u5206\u4eab\u7ed9\u4ed6\u4eba', dimension: 'EI' },
      // S/N \u5b9e\u611f\u76f4\u89c9 7-12
      { text: '\u6211\u66f4\u76f8\u4fe1\u73b0\u5b9e\u7ecf\u5386\u4e0e\u5ba2\u89c2\u4e8b\u5b9e', dimension: 'SN' },
      { text: '\u505a\u4e8b\u6ce8\u91cd\u7ec6\u8282\u6b65\u9aa4\uff0c\u504f\u7231\u811a\u8e0f\u5b9e\u5730', dimension: 'SN' },
      { text: '\u6211\u5173\u6ce8\u5f53\u4e0b\u73b0\u72b6\uff0c\u5c11\u5e7b\u60f3\u672a\u6765\u4e0e\u53ef\u80fd\u6027', dimension: 'SN' },
      { text: '\u5b66\u4e60\u66f4\u64c5\u957f\u5b9e\u64cd\u843d\u5730\uff0c\u800c\u975e\u62bd\u8c61\u7406\u8bba', dimension: 'SN' },
      { text: '\u601d\u8003\u95ee\u9898\u559c\u6b22\u5177\u4f53\u63cf\u8ff0\uff0c\u4e0d\u7231\u53d1\u6563\u8054\u60f3', dimension: 'SN' },
      { text: '\u505a\u9009\u62e9\u4f9d\u8d56\u8fc7\u5f80\u7ecf\u9a8c\uff0c\u4e0d\u9760\u7075\u611f\u76f4\u89c9', dimension: 'SN' },
      // T/F \u7406\u6027\u611f\u6027 13-18
      { text: '\u9047\u4e8b\u4f18\u5148\u7406\u6027\u5206\u6790\uff0c\u5206\u6e05\u5bf9\u9519\u5229\u5f0a', dimension: 'TF' },
      { text: '\u505a\u51b3\u5b9a\u66f4\u770b\u91cd\u516c\u5e73\u903b\u8f91\uff0c\u800c\u975e\u4eba\u60c5\u611f\u53d7', dimension: 'TF' },
      { text: '\u53d1\u751f\u77db\u76fe\u65f6\uff0c\u6211\u4f1a\u5c31\u4e8b\u8bba\u4e8b\u3001\u51b7\u9759\u770b\u5f85', dimension: 'TF' },
      { text: '\u8bc4\u4ef7\u4ed6\u4eba\u66f4\u5ba2\u89c2\uff0c\u4e0d\u6613\u88ab\u60c5\u7eea\u5171\u60c5\u5f71\u54cd', dimension: 'TF' },
      { text: '\u9075\u5b88\u89c4\u5219\u8bb2\u7a76\u539f\u5219\uff0c\u4e0d\u4f1a\u8f7b\u6613\u4eba\u60c5\u53d8\u901a', dimension: 'TF' },
      { text: '\u5904\u7406\u95ee\u9898\u8ffd\u6c42\u6548\u7387\uff0c\u4e0d\u523b\u610f\u7167\u987e\u60c5\u7eea', dimension: 'TF' },
      // J/P \u8ba1\u5212\u968f\u6027 19-25
      { text: '\u6211\u4e60\u60ef\u63d0\u524d\u89c4\u5212\uff0c\u751f\u6d3b\u559c\u6b22\u4e95\u7136\u6709\u5e8f', dimension: 'JP' },
      { text: '\u505a\u4e8b\u559c\u6b22\u5b9a\u76ee\u6807\u3001\u6309\u8ba1\u5212\u63a8\u8fdb', dimension: 'JP' },
      { text: '\u6211\u53cd\u611f\u4e34\u65f6\u53d8\u52a8\uff0c\u504f\u7231\u7a33\u5b9a\u786e\u5b9a\u5b89\u6392', dimension: 'JP' },
      { text: '\u4efb\u52a1\u4e60\u60ef\u63d0\u524d\u5b8c\u6210\uff0c\u4e0d\u559c\u6b22\u62d6\u5ef6\u8d76\u622a\u6b62', dimension: 'JP' },
      { text: '\u7269\u54c1\u6536\u7eb3\u6574\u6d01\uff0c\u4e0d\u9002\u5e94\u6742\u4e71\u968f\u6027\u73af\u5883', dimension: 'JP' },
      { text: '\u505a\u4e8b\u8ffd\u6c42\u7ed3\u679c\u843d\u5730\uff0c\u4e0d\u559c\u6b22\u6f2b\u65e0\u76ee\u7684', dimension: 'JP' },
      { text: '\u751f\u6d3b\u4f5c\u606f\u89c4\u5f8b\uff0c\u4e0d\u7231\u4e34\u65f6\u5373\u5174\u5b89\u6392', dimension: 'JP' }
    ],
    options: [
      { value: 1, label: '\u5fae\u5c0f' },
      { value: 2, label: '\u5c0f' },
      { value: 3, label: '\u4e2d\u7b49' },
      { value: 4, label: '\u504f\u5927' },
      { value: 5, label: '\u5927' }
    ],
    currentQuestion: {},
    currentDimension: '',
    answers: [],
    mbtiType: '',
    mbtiName: '',
    dimensions: {},
    matchedFigure: {}
  },

  onLoad: function () {
    this.setData({
      currentQuestion: this.data.questions[0],
      currentDimension: this._getDimensionLabel(this.data.questions[0].dimension),
      progress: (1 / this.data.questions.length) * 100
    });
  },

  _getDimensionLabel: function (dim) {
    var map = {
      'EI': 'E \u5916\u5411 / I \u5185\u5411',
      'SN': 'S \u5b9e\u611f / N \u76f4\u89c9',
      'TF': 'T \u7406\u6027 / F \u611f\u6027',
      'JP': 'J \u8ba1\u5212 / P \u968f\u6027'
    };
    return map[dim] || dim;
  },

  selectOption: function (e) {
    var value = e.currentTarget.dataset.value;
    this.setData({ selectedValue: value });
  },

  nextQuestion: function () {
    if (!this.data.selectedValue) return;

    var answers = this.data.answers.slice();
    answers.push({
      index: this.data.currentIndex,
      dimension: this.data.questions[this.data.currentIndex].dimension,
      value: this.data.selectedValue
    });

    if (this.data.currentIndex < this.data.questions.length - 1) {
      var nextIndex = this.data.currentIndex + 1;
      this.setData({
        currentIndex: nextIndex,
        selectedValue: 0,
        currentQuestion: this.data.questions[nextIndex],
        currentDimension: this._getDimensionLabel(this.data.questions[nextIndex].dimension),
        answers: answers,
        progress: ((nextIndex + 1) / this.data.questions.length) * 100
      });
    } else {
      this.setData({ answers: answers });
      this._calculateResult();
    }
  },

  _calculateResult: function () {
    var answers = this.data.answers;
    var scores = { EI: 0, SN: 0, TF: 0, JP: 0 };
    var totals = { EI: 30, SN: 30, TF: 30, JP: 35 };

    for (var i = 0; i < answers.length; i++) {
      scores[answers[i].dimension] += answers[i].value;
    }

    var type = '';
    type += scores.EI >= 21 ? 'E' : 'I';
    type += scores.SN >= 21 ? 'S' : 'N';
    type += scores.TF >= 21 ? 'T' : 'F';
    type += scores.JP >= 14 ? 'J' : 'P';

    var dimensions = {
      EI: { type: scores.EI >= 21 ? 'E' : 'I', score: scores.EI, percent: Math.round((scores.EI / totals.EI) * 100) },
      SN: { type: scores.SN >= 21 ? 'S' : 'N', score: scores.SN, percent: Math.round((scores.SN / totals.SN) * 100) },
      TF: { type: scores.TF >= 21 ? 'T' : 'F', score: scores.TF, percent: Math.round((scores.TF / totals.TF) * 100) },
      JP: { type: scores.JP >= 14 ? 'J' : 'P', score: scores.JP, percent: Math.round((scores.JP / totals.JP) * 100) }
    };

    var figureData = this._getMatchedFigure(type);
    var nameData = this._getMbtiName(type);

    this.setData({
      showResult: true,
      mbtiType: type,
      mbtiName: nameData,
      dimensions: dimensions,
      matchedFigure: figureData
    });

    // 保存MBTI测试结果到云数据库
    this._saveMbtiResult(type, nameData, figureData, dimensions);
  },

  _saveMbtiResult: function (type, nameData, figureData, dimensions) {
    const userInfo = wx.getStorageSync('userInfo');
    if (!userInfo || !userInfo.userId) return;

    const resultData = {
      userId: userInfo.userId,
      mbtiType: type,
      mbtiName: nameData,
      figureName: figureData.name,
      figureDesc: figureData.desc,
      figureTraits: figureData.traits,
      figureBg: figureData.bg,
      figureIcon: figureData.icon,
      dimensions: dimensions,
      testTime: new Date().toISOString(),
      updateTime: new Date().toISOString()
    };

    const results = wx.getStorageSync('mbtiResults') || {};
    results[userInfo.userId] = resultData;
    wx.setStorageSync('mbtiResults', results);
    console.log('MBTI result saved locally');
    return;

    // 使用 upsert：有则更新，无则新增
    db.collection('user_mbti')
      .where({ userId: userInfo.userId })
      .count()
      .then(countRes => {
        if (countRes.total > 0) {
          // 已存在则更新
          return db.collection('user_mbti')
            .where({ userId: userInfo.userId })
            .update({ data: resultData });
        } else {
          // 不存在则新增
          return db.collection('user_mbti').add({ data: resultData });
        }
      })
      .then(() => console.log('MBTI结果保存成功'))
      .catch(err => console.error('MBTI结果保存失败:', err));
  },

  _getMbtiName: function (type) {
    var names = {
      'INTJ': '\u5efa\u7b51\u5e08', 'INFJ': '\u63d0\u5021\u8005', 'ISTJ': '\u68c0\u67e5\u5458', 'ISFJ': '\u5b88\u62a4\u8005',
      'INTP': '\u903b\u8f91\u5b66\u5bb6', 'ISTP': '\u5de7\u5320', 'ENTJ': '\u6307\u6325\u5b98', 'ENTP': '\u8fa9\u8bba\u5bb6',
      'ENFJ': '\u6559\u80b2\u5bb6', 'ENFP': '\u7ade\u9009\u8005', 'ESFJ': '\u6267\u884c\u5b98', 'ESFP': '\u8868\u6f14\u8005',
      'INFP': '\u8c03\u89e3\u8005', 'ISFP': '\u63a2\u9669\u5bb6', 'ESTJ': '\u7ba1\u7406\u8005', 'ESTP': '\u5192\u9669\u5bb6'
    };
    return names[type] || type;
  },

  _getMatchedFigure: function (type) {
    var icons = {
      kangyouwei: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMjAgMTIwIiB3aWR0aD0iMTIwIiBoZWlnaHQ9IjEyMCI+DQogIDwhLS0g5bq35pyJ5Li6IC0g5Y+Y5rOV5YWI6amx77yM5Lmm5Y235rCUIC0tPg0KICA8ZGVmcz4NCiAgICA8bGluZWFyR3JhZGllbnQgaWQ9ImJnMSIgeDE9IjAlIiB5MT0iMCUiIHgyPSIxMDAlIiB5Mj0iMTAwJSI+DQogICAgICA8c3RvcCBvZmZzZXQ9IjAlIiBzdHlsZT0ic3RvcC1jb2xvcjojOEI0NTEzIi8+DQogICAgICA8c3RvcCBvZmZzZXQ9IjEwMCUiIHN0eWxlPSJzdG9wLWNvbG9yOiNEMjY5MUUiLz4NCiAgICA8L2xpbmVhckdyYWRpZW50Pg0KICA8L2RlZnM+DQogIDxjaXJjbGUgY3g9IjYwIiBjeT0iNjAiIHI9IjU2IiBmaWxsPSJ1cmwoI2JnMSkiLz4NCiAgPCEtLSDlpLTpg6ggLS0+DQogIDxjaXJjbGUgY3g9IjYwIiBjeT0iMzgiIHI9IjE4IiBmaWxsPSIjRkRFQkQwIi8+DQogIDwhLS0g5Y+R6au777yI5riF5Luj5paH5Lq65b2i6LGh77yJIC0tPg0KICA8ZWxsaXBzZSBjeD0iNjAiIGN5PSIyMiIgcng9IjEyIiByeT0iOCIgZmlsbD0iIzMzMyIvPg0KICA8IS0tIOi6q+S9ky/plb/ooo0gLS0+DQogIDxwYXRoIGQ9Ik0zNiA1NiBRMzYgNTIgNDIgNTAgTDU0IDQ2IFE2MCA0NCA2NiA0NiBMNzggNTAgUTg0IDUyIDg0IDU2IEw4MiAxMDAgUTYwIDEwNSAzOCAxMDAgWiIgZmlsbD0iIzJDM0U1MCIvPg0KICA8IS0tIOmihuWPoyAtLT4NCiAgPHBhdGggZD0iTTUyIDUwIEw2MCA2MiBMNjggNTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI0Y1RjVEQyIgc3Ryb2tlLXdpZHRoPSIyIi8+DQogIDwhLS0g5Lmm5Y23IC0tPg0KICA8cmVjdCB4PSI3MiIgeT0iNTgiIHdpZHRoPSIxOCIgaGVpZ2h0PSIyNCIgcng9IjIiIGZpbGw9IiNGNUY1REMiIHN0cm9rZT0iIzhCNDUxMyIgc3Ryb2tlLXdpZHRoPSIxLjUiLz4NCiAgPGxpbmUgeDE9Ijc2IiB5MT0iNjQiIHgyPSI4NiIgeTI9IjY0IiBzdHJva2U9IiM4QjQ1MTMiIHN0cm9rZS13aWR0aD0iMSIvPg0KICA8bGluZSB4MT0iNzYiIHkxPSI2OCIgeDI9Ijg2IiB5Mj0iNjgiIHN0cm9rZT0iIzhCNDUxMyIgc3Ryb2tlLXdpZHRoPSIxIi8+DQogIDxsaW5lIHgxPSI3NiIgeTE9IjcyIiB4Mj0iODYiIHkyPSI3MiIgc3Ryb2tlPSIjOEI0NTEzIiBzdHJva2Utd2lkdGg9IjEiLz4NCiAgPCEtLSDnnLznnZsgLS0+DQogIDxjaXJjbGUgY3g9IjUzIiBjeT0iMzYiIHI9IjIiIGZpbGw9IiMzMzMiLz4NCiAgPGNpcmNsZSBjeD0iNjciIGN5PSIzNiIgcj0iMiIgZmlsbD0iIzMzMyIvPg0KICA8IS0tIOiDoemhuyAtLT4NCiAgPHBhdGggZD0iTTU2IDQ2IFE2MCA1MiA2NCA0NiIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjMzMzIiBzdHJva2Utd2lkdGg9IjEiLz4NCjwvc3ZnPg==',
      yewen: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMjAgMTIwIiB3aWR0aD0iMTIwIiBoZWlnaHQ9IjEyMCI+DQogIDwhLS0g5Y+26ZeuIC0g5ZKP5pil5a6X5biI77yM5q2m5pyv5ae/5oCBIC0tPg0KICA8ZGVmcz4NCiAgICA8bGluZWFyR3JhZGllbnQgaWQ9ImJnMiIgeDE9IjAlIiB5MT0iMCUiIHgyPSIxMDAlIiB5Mj0iMTAwJSI+DQogICAgICA8c3RvcCBvZmZzZXQ9IjAlIiBzdHlsZT0ic3RvcC1jb2xvcjojMWExYTJlIi8+DQogICAgICA8c3RvcCBvZmZzZXQ9IjEwMCUiIHN0eWxlPSJzdG9wLWNvbG9yOiMxNjIxM2UiLz4NCiAgICA8L2xpbmVhckdyYWRpZW50Pg0KICA8L2RlZnM+DQogIDxjaXJjbGUgY3g9IjYwIiBjeT0iNjAiIHI9IjU2IiBmaWxsPSJ1cmwoI2JnMikiLz4NCiAgPCEtLSDlpLTpg6ggLS0+DQogIDxjaXJjbGUgY3g9IjYwIiBjeT0iMzIiIHI9IjE2IiBmaWxsPSIjRkRFQkQwIi8+DQogIDwhLS0g5aS05Y+RIC0tPg0KICA8cGF0aCBkPSJNNDQgMjggUTQ4IDE2IDYwIDE0IFE3MiAxNiA3NiAyOCBRNzQgMjIgNjAgMjAgUTQ2IDIyIDQ0IDI4WiIgZmlsbD0iIzMzMyIvPg0KICA8IS0tIOi6q+S9ky/llJDoo4UgLS0+DQogIDxwYXRoIGQ9Ik00MCA0OCBRNDAgNDQgNDYgNDIgTDU0IDQwIFE2MCAzOCA2NiA0MCBMNzQgNDIgUTgwIDQ0IDgwIDQ4IEw3OCAxMDAgUTYwIDEwNSA0MiAxMDAgWiIgZmlsbD0iI0MwMzkyQiIvPg0KICA8IS0tIOWUkOijheeri+mihiAtLT4NCiAgPHBhdGggZD0iTTUyIDQyIEw1NiA1MiBMNjAgNDggTDY0IDUyIEw2OCA0MiIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjRjVGNURDIiBzdHJva2Utd2lkdGg9IjIiLz4NCiAgPCEtLSDnm5jmiaMgLS0+DQogIDxjaXJjbGUgY3g9IjU4IiBjeT0iNTYiIHI9IjIiIGZpbGw9IiNGNUY1REMiLz4NCiAgPGNpcmNsZSBjeD0iNjIiIGN5PSI2MiIgcj0iMiIgZmlsbD0iI0Y1RjVEQyIvPg0KICA8IS0tIOWSj+aYpeaJi+WKvyAtLT4NCiAgPHBhdGggZD0iTTQwIDYwIEwyNCA1MiBRMjAgNTAgMTggNTIgTDE0IDU2IiBmaWxsPSJub25lIiBzdHJva2U9IiNGREVCRDAiIHN0cm9rZS13aWR0aD0iNCIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIi8+DQogIDwhLS0g55y8552bIC0tPg0KICA8ZWxsaXBzZSBjeD0iNTQiIGN5PSIzMCIgcng9IjIiIHJ5PSIyLjUiIGZpbGw9IiMzMzMiLz4NCiAgPGVsbGlwc2UgY3g9IjY2IiBjeT0iMzAiIHJ4PSIyIiByeT0iMi41IiBmaWxsPSIjMzMzIi8+DQogIDwhLS0g5rCU5Zy657q/5p2hIC0tPg0KICA8cGF0aCBkPSJNMjAgNzAgUTMwIDY2IDQwIDcyIiBmaWxsPSJub25lIiBzdHJva2U9IiNFNzRDM0MiIHN0cm9rZS13aWR0aD0iMS41IiBvcGFjaXR5PSIwLjYiLz4NCiAgPHBhdGggZD0iTTE2IDc4IFEyOCA3NCA0MiA4MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjRTc0QzNDIiBzdHJva2Utd2lkdGg9IjEuNSIgb3BhY2l0eT0iMC40Ii8+DQo8L3N2Zz4=',
      zhantianyou: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMjAgMTIwIiB3aWR0aD0iMTIwIiBoZWlnaHQ9IjEyMCI+DQogIDwhLS0g6Km55aSp5L2RIC0g6ZOB6Lev5LmL54i277yM54Gr6L2mL+mTgei3ryAtLT4NCiAgPGRlZnM+DQogICAgPGxpbmVhckdyYWRpZW50IGlkPSJiZzMiIHgxPSIwJSIgeTE9IjAlIiB4Mj0iMTAwJSIgeTI9IjEwMCUiPg0KICAgICAgPHN0b3Agb2Zmc2V0PSIwJSIgc3R5bGU9InN0b3AtY29sb3I6IzJDM0U1MCIvPg0KICAgICAgPHN0b3Agb2Zmc2V0PSIxMDAlIiBzdHlsZT0ic3RvcC1jb2xvcjojMzQ0OTVFIi8+DQogICAgPC9saW5lYXJHcmFkaWVudD4NCiAgPC9kZWZzPg0KICA8Y2lyY2xlIGN4PSI2MCIgY3k9IjYwIiByPSI1NiIgZmlsbD0idXJsKCNiZzMpIi8+DQogIDwhLS0g6ZOB6L2oIC0tPg0KICA8cGF0aCBkPSJNMTAgODIgTDYwIDYyIEwxMTAgODIiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI0JEQzNDNyIgc3Ryb2tlLXdpZHRoPSIzIi8+DQogIDxwYXRoIGQ9Ik0xMCA4OCBMNjAgNjggTDExMCA4OCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjQkRDM0M3IiBzdHJva2Utd2lkdGg9IjMiLz4NCiAgPCEtLSDmnpXmnKggLS0+DQogIDxsaW5lIHgxPSIyMCIgeTE9IjgzIiB4Mj0iMjAiIHkyPSI4OSIgc3Ryb2tlPSIjQkRDM0M3IiBzdHJva2Utd2lkdGg9IjIiLz4NCiAgPGxpbmUgeDE9IjM1IiB5MT0iNzciIHgyPSIzNSIgeTI9IjgzIiBzdHJva2U9IiNCREMzQzciIHN0cm9rZS13aWR0aD0iMiIvPg0KICA8bGluZSB4MT0iNTAiIHkxPSI3MSIgeDI9IjUwIiB5Mj0iNzciIHN0cm9rZT0iI0JEQzNDNyIgc3Ryb2tlLXdpZHRoPSIyIi8+DQogIDxsaW5lIHgxPSI3MCIgeTE9IjcxIiB4Mj0iNzAiIHkyPSI3NyIgc3Ryb2tlPSIjQkRDM0M3IiBzdHJva2Utd2lkdGg9IjIiLz4NCiAgPGxpbmUgeDE9Ijg1IiB5MT0iNzciIHgyPSI4NSIgeTI9IjgzIiBzdHJva2U9IiNCREMzQzciIHN0cm9rZS13aWR0aD0iMiIvPg0KICA8bGluZSB4MT0iMTAwIiB5MT0iODMiIHgyPSIxMDAiIHkyPSI4OSIgc3Ryb2tlPSIjQkRDM0M3IiBzdHJva2Utd2lkdGg9IjIiLz4NCiAgPCEtLSDkurrlvaIgLS0+DQogIDxjaXJjbGUgY3g9IjYwIiBjeT0iMzAiIHI9IjE0IiBmaWxsPSIjRkRFQkQwIi8+DQogIDwhLS0g5bi95a2Q77yI5bel56iL5biI5bi977yJIC0tPg0KICA8cGF0aCBkPSJNNDQgMjggUTQ0IDE2IDYwIDE0IFE3NiAxNiA3NiAyOCBMNzQgMjggUTc0IDIwIDYwIDE4IFE0NiAyMCA0NiAyOFoiIGZpbGw9IiNGMzlDMTIiLz4NCiAgPHJlY3QgeD0iNDIiIHk9IjI2IiB3aWR0aD0iMzYiIGhlaWdodD0iNCIgcng9IjIiIGZpbGw9IiNFNjdFMjIiLz4NCiAgPCEtLSDouqvkvZMgLS0+DQogIDxwYXRoIGQ9Ik00MiA0NCBRNDIgNDAgNDggMzggTDU0IDM2IFE2MCAzNCA2NiAzNiBMNzIgMzggUTc4IDQwIDc4IDQ0IEw3NiA2MiBRNjAgNjYgNDQgNjIgWiIgZmlsbD0iIzI5ODBCOSIvPg0KICA8IS0tIOaMh+WQkei/nOaWueeahOaJiyAtLT4NCiAgPHBhdGggZD0iTTc4IDQ4IEw5NiA0MCIgc3Ryb2tlPSIjRkRFQkQwIiBzdHJva2Utd2lkdGg9IjQiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIvPg0KICA8IS0tIOecvOedmyAtLT4NCiAgPGNpcmNsZSBjeD0iNTUiIGN5PSIyOCIgcj0iMiIgZmlsbD0iIzMzMyIvPg0KICA8Y2lyY2xlIGN4PSI2NSIgY3k9IjI4IiByPSIyIiBmaWxsPSIjMzMzIi8+DQo8L3N2Zz4=',
      lixiaolong: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMjAgMTIwIiB3aWR0aD0iMTIwIiBoZWlnaHQ9IjEyMCI+DQogIDwhLS0g5p2O5bCP6b6ZIC0g5q2m5pyv5Lyg5aWH77yM5oiq5ouz6YGT5ae/5oCBIC0tPg0KICA8ZGVmcz4NCiAgICA8bGluZWFyR3JhZGllbnQgaWQ9ImJnNCIgeDE9IjAlIiB5MT0iMCUiIHgyPSIxMDAlIiB5Mj0iMTAwJSI+DQogICAgICA8c3RvcCBvZmZzZXQ9IjAlIiBzdHlsZT0ic3RvcC1jb2xvcjojRkZENzAwIi8+DQogICAgICA8c3RvcCBvZmZzZXQ9IjEwMCUiIHN0eWxlPSJzdG9wLWNvbG9yOiNGRjhDMDAiLz4NCiAgICA8L2xpbmVhckdyYWRpZW50Pg0KICA8L2RlZnM+DQogIDxjaXJjbGUgY3g9IjYwIiBjeT0iNjAiIHI9IjU2IiBmaWxsPSJ1cmwoI2JnNCkiLz4NCiAgPCEtLSDouqvkvZMv5Yqf5aSr5LiK6KGjIC0tPg0KICA8cGF0aCBkPSJNNDIgNDggUTQyIDQ0IDQ4IDQyIEw1NCA0MCBRNjAgMzggNjYgNDAgTDcyIDQyIFE3OCA0NCA3OCA0OCBMNzYgOTAgUTYwIDk0IDQ0IDkwIFoiIGZpbGw9IiMxMTEiLz4NCiAgPCEtLSDogozogonnur/mnaEgLS0+DQogIDxwYXRoIGQ9Ik01MiA1MiBMNjAgNjAgTDY4IDUyIiBmaWxsPSJub25lIiBzdHJva2U9IiNGRkQ3MDAiIHN0cm9rZS13aWR0aD0iMS41IiBvcGFjaXR5PSIwLjUiLz4NCiAgPCEtLSDlpLTpg6ggLS0+DQogIDxjaXJjbGUgY3g9IjYwIiBjeT0iMzAiIHI9IjE2IiBmaWxsPSIjRDRBNTc0Ii8+DQogIDwhLS0g57uP5YW45Y+R5Z6LIC0tPg0KICA8cGF0aCBkPSJNNDQgMjYgUTQ0IDEyIDYwIDEwIFE3NiAxMiA3NiAyNiBRNzQgMTggNjAgMTYgUTQ2IDE4IDQ0IDI2WiIgZmlsbD0iIzExMSIvPg0KICA8IS0tIOagh+W/l+aAp+S+p+i4ouWnv+WKvyAtIOiFvyAtLT4NCiAgPHBhdGggZD0iTTQ4IDkwIEw0NCA5NiIgc3Ryb2tlPSIjMTExIiBzdHJva2Utd2lkdGg9IjUiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIvPg0KICA8cGF0aCBkPSJNNzIgNzggTDk2IDU4IiBzdHJva2U9IiMxMTEiIHN0cm9rZS13aWR0aD0iNSIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIi8+DQogIDwhLS0g5oiq5ouz6YGT5omL5Yq/IC0tPg0KICA8cGF0aCBkPSJNNDIgNTYgTDE4IDQ0IiBzdHJva2U9IiNENEE1NzQiIHN0cm9rZS13aWR0aD0iNCIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIi8+DQogIDxwYXRoIGQ9Ik03OCA1MiBMOTIgNDQiIHN0cm9rZT0iI0Q0QTU3NCIgc3Ryb2tlLXdpZHRoPSI0IiBzdHJva2UtbGluZWNhcD0icm91bmQiLz4NCiAgPCEtLSDnnLznnZsgLSDlh4zljonnm67lhYkgLS0+DQogIDxwYXRoIGQ9Ik01MiAyOCBMNTggMjYiIHN0cm9rZT0iIzExMSIgc3Ryb2tlLXdpZHRoPSIyIi8+DQogIDxwYXRoIGQ9Ik02MiAyNiBMNjggMjgiIHN0cm9rZT0iIzExMSIgc3Ryb2tlLXdpZHRoPSIyIi8+DQogIDxjaXJjbGUgY3g9IjU1IiBjeT0iMjgiIHI9IjEuNSIgZmlsbD0iIzExMSIvPg0KICA8Y2lyY2xlIGN4PSI2NSIgY3k9IjI4IiByPSIxLjUiIGZpbGw9IiMxMTEiLz4NCiAgPCEtLSDpvpnnurnoo4XppbAgLS0+DQogIDxwYXRoIGQ9Ik0xNCAxMDAgUTMwIDkwIDQ2IDEwMCBRNjAgMTA4IDc2IDEwMCBROTIgOTIgMTA4IDEwMCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjRkY0NTAwIiBzdHJva2Utd2lkdGg9IjIiIG9wYWNpdHk9IjAuNyIvPg0KPC9zdmc+'
    };

    var figures = {
      'INTJ': { name: '\u53f6\u95ee', icon: icons.yewen, bg: 'linear-gradient(135deg, #FCE4EC, #FFCDD2)', desc: '\u51b7\u9759\u5185\u655b\u3001\u5fc3\u601d\u6df1\u8fdc\u3001\u4e13\u6ce8\u81ea\u5f8b\u3001\u6b66\u5b66\u5b97\u5e08', traits: ['\u51b7\u9759\u5185\u655b', '\u5fc3\u601d\u6df1\u8fdc', '\u4e13\u6ce8\u81ea\u5f8b', '\u6b66\u5b66\u5b97\u5e08', '\u72ec\u7acb\u6c89\u7a33'] },
      'INFJ': { name: '\u6234\u9e3f\u6148', icon: icons.kangyouwei, bg: 'linear-gradient(135deg, #FFF8E1, #FFE0B2)', desc: '\u8fdc\u89c1\u601d\u8fa8\u3001\u5fc3\u601d\u7ec6\u817b\u3001\u601d\u60f3\u6df1\u6c89\u3001\u6e05\u672b\u9769\u65b0\u540d\u81e3', traits: ['\u8fdc\u89c1\u601d\u8fa8', '\u5fc3\u601d\u7ec6\u817b', '\u601d\u60f3\u6df1\u6c89', '\u6e05\u672b\u9769\u65b0\u540d\u81e3'] },
      'ISTJ': { name: '\u8a79\u5929\u4f51', icon: icons.zhantianyou, bg: 'linear-gradient(135deg, #E3F2FD, #BBDEFB)', desc: '\u4e25\u8c28\u8e0f\u5b9e\u3001\u6ce8\u91cd\u7ec6\u8282\u3001\u89c4\u5219\u611f\u5f3a\u3001\u94c1\u8def\u4e4b\u7236', traits: ['\u4e25\u8c28\u8e0f\u5b9e', '\u6ce8\u91cd\u7ec6\u8282', '\u89c4\u5219\u611f\u5f3a', '\u5b9e\u5e72\u62a5\u56fd', '\u94c1\u8def\u4e4b\u7236'] },
      'ISFJ': { name: '\u6881\u8d5e', icon: icons.yewen, bg: 'linear-gradient(135deg, #E8F5E9, #C8E6C9)', desc: '\u6e29\u548c\u4f4e\u8c03\u3001\u575a\u5b88\u4f20\u627f\u3001\u8010\u5fc3\u5305\u5bb9\u3001\u548f\u6625\u9f3b\u7956', traits: ['\u6e29\u548c\u4f4e\u8c03', '\u575a\u5b88\u4f20\u627f', '\u8010\u5fc3\u5305\u5bb9', '\u9ed8\u9ed8\u5949\u732e', '\u548f\u6625\u9f3b\u7956'] },
      'INTP': { name: '\u90b9\u4f2f\u5947', icon: icons.zhantianyou, bg: 'linear-gradient(135deg, #F3E5F5, #E1BEE7)', desc: '\u903b\u8f91\u8d85\u5f3a\u3001\u70ed\u7231\u94bb\u7814\u3001\u7406\u6027\u597d\u5947\u3001\u5cad\u5357\u79d1\u5b66\u5148\u9a71', traits: ['\u903b\u8f91\u8d85\u5f3a', '\u70ed\u7231\u94bb\u7814', '\u7406\u6027\u597d\u5947', '\u535a\u89c8\u7fa4\u4e66', '\u5cad\u5357\u79d1\u5b66\u5148\u9a71'] },
      'ISTP': { name: '\u674e\u5c0f\u9f99', icon: icons.lixiaolong, bg: 'linear-gradient(135deg, #FFFDE7, #FFF9C4)', desc: '\u884c\u52a8\u679c\u65ad\u3001\u7075\u6d3b\u521b\u65b0\u3001\u5b9e\u64cd\u6781\u5f3a\u3001\u529f\u592b\u9769\u65b0\u8005', traits: ['\u884c\u52a8\u679c\u65ad', '\u7075\u6d3b\u521b\u65b0', '\u5b9e\u64cd\u6781\u5f3a', '\u7a81\u7834\u4f20\u7edf', '\u529f\u592b\u9769\u65b0\u8005'] },
      'ENTJ': { name: '\u9648\u542f\u6c85', icon: icons.kangyouwei, bg: 'linear-gradient(135deg, #FFEBEE, #FFCDD2)', desc: '\u9b44\u529b\u5341\u8db3\u3001\u76ee\u6807\u660e\u786e\u3001\u6562\u95ef\u6562\u62fc\u3001\u5b9e\u4e1a\u5f00\u62d3', traits: ['\u9b44\u529b\u5341\u8db3', '\u76ee\u6807\u660e\u786e', '\u6562\u95ef\u6562\u62fc', '\u5b9e\u4e1a\u5f00\u62d3', '\u5546\u754c\u9886\u8896'] },
      'ENTP': { name: '\u4f26\u6587\u53d9', icon: icons.kangyouwei, bg: 'linear-gradient(135deg, #E0F7FA, #B2EBF2)', desc: '\u624d\u601d\u654f\u6377\u3001\u673a\u667a\u5584\u8fa9\u3001\u8111\u6d1e\u7075\u6d3b\u3001\u660e\u4ee3\u72b6\u5143', traits: ['\u624d\u601d\u654f\u6377', '\u673a\u667a\u5584\u8fa9', '\u8111\u6d1e\u7075\u6d3b', '\u806a\u6167\u5e7d\u9ed8', '\u660e\u4ee3\u72b6\u5143'] },
      'ENFJ': { name: '\u5eb7\u6709\u4e3a', icon: icons.kangyouwei, bg: 'linear-gradient(135deg, #FFF8E1, #FFE0B2)', desc: '\u7406\u60f3\u4e3b\u4e49\u3001\u611f\u67d3\u529b\u5f3a\u3001\u5fc3\u6000\u5bb6\u56fd\u3001\u53d8\u6cd5\u9886\u8896', traits: ['\u7406\u60f3\u4e3b\u4e49', '\u611f\u67d3\u529b\u5f3a', '\u5fc3\u6000\u5bb6\u56fd', '\u5584\u4e8e\u53f7\u53ec', '\u53d8\u6cd5\u9886\u8896'] },
      'ENFP': { name: '\u859b\u89c9\u5148', icon: icons.lixiaolong, bg: 'linear-gradient(135deg, #FCE4EC, #F8BBD0)', desc: '\u6d6a\u6f2b\u7075\u52a8\u3001\u521b\u610f\u4e30\u5bcc\u3001\u70ed\u7231\u9769\u65b0\u3001\u7ca4\u5267\u5b97\u5e08', traits: ['\u6d6a\u6f2b\u7075\u52a8', '\u521b\u610f\u4e30\u5bcc', '\u70ed\u7231\u9769\u65b0', '\u611f\u6027\u6587\u827a', '\u7ca4\u5267\u5b97\u5e08'] },
      'ESFJ': { name: '\u9ec4\u98de\u9e3f', icon: icons.lixiaolong, bg: 'linear-gradient(135deg, #FFF3E0, #FFE0B2)', desc: '\u91cd\u60c5\u91cd\u4e49\u3001\u70ed\u5fc3\u4fa0\u4e49\u3001\u5f85\u4eba\u5bbd\u539a\u3001\u6d2a\u62f3\u5927\u5bb6', traits: ['\u91cd\u60c5\u91cd\u4e49', '\u70ed\u5fc3\u4fa0\u4e49', '\u5f85\u4eba\u5bbd\u539a', '\u5e2e\u6276\u5f31\u5c0f', '\u6d2a\u62f3\u5927\u5bb6'] },
      'ESFP': { name: '\u53f6\u51c6', icon: icons.yewen, bg: 'linear-gradient(135deg, #E8F5E9, #C8E6C9)', desc: '\u5f00\u6717\u5916\u5411\u3001\u4e50\u89c2\u968f\u548c\u3001\u70ed\u7231\u751f\u6d3b\u3001\u8868\u73b0\u529b\u5f3a', traits: ['\u5f00\u6717\u5916\u5411', '\u4e50\u89c2\u968f\u548c', '\u70ed\u7231\u751f\u6d3b', '\u8868\u73b0\u529b\u5f3a'] },
      'INFP': { name: '\u9ec4\u5c11\u5f3a', icon: icons.kangyouwei, bg: 'linear-gradient(135deg, #F3E5F5, #E1BEE7)', desc: '\u5171\u60c5\u7ec6\u817b\u3001\u7406\u60f3\u6e29\u67d4\u3001\u6587\u827a\u60b2\u60af\u3001\u5cad\u5357\u56fd\u753b\u540d\u5bb6', traits: ['\u5171\u60c5\u7ec6\u817b', '\u7406\u60f3\u6e29\u67d4', '\u6587\u827a\u60b2\u60af', '\u5cad\u5357\u56fd\u753b\u540d\u5bb6'] },
      'ISFP': { name: '\u6f58\u7389\u4e66', icon: icons.kangyouwei, bg: 'linear-gradient(135deg, #EFEBE9, #D7CCC8)', desc: '\u5ba1\u7f8e\u72ec\u7279\u3001\u624b\u827a\u7cbe\u6e5b\u3001\u5b89\u9759\u4e13\u6ce8\u3001\u77f3\u6e7e\u9676\u827a\u5927\u5e08', traits: ['\u5ba1\u7f8e\u72ec\u7279', '\u624b\u827a\u7cbe\u6e5b', '\u5b89\u9759\u4e13\u6ce8', '\u77f3\u6e7e\u9676\u827a\u5927\u5e08'] },
      'ESTJ': { name: '\u4f0d\u79c9\u9274', icon: icons.zhantianyou, bg: 'linear-gradient(135deg, #E3F2FD, #BBDEFB)', desc: '\u5e72\u7ec3\u5f3a\u52bf\u3001\u6761\u7406\u6e05\u6670\u3001\u638c\u63a7\u529b\u5f3a\u3001\u6e05\u4ee3\u5bcc\u5546\u5de8\u8d3e', traits: ['\u5e72\u7ec3\u5f3a\u52bf', '\u6761\u7406\u6e05\u6670', '\u638c\u63a7\u529b\u5f3a', '\u6e05\u4ee3\u5bcc\u5546\u5de8\u8d3e'] },
      'ESTP': { name: '\u4f55\u51b2', icon: icons.lixiaolong, bg: 'linear-gradient(135deg, #E0F2F1, #B2DFDB)', desc: '\u4e34\u573a\u5e94\u53d8\u3001\u81ea\u4fe1\u679c\u6562\u3001\u6562\u4e8e\u6311\u6218\u3001\u9876\u5c16\u7ade\u6280\u8fd0\u52a8\u5458', traits: ['\u4e34\u573a\u5e94\u53d8', '\u81ea\u4fe1\u679c\u6562', '\u6562\u4e8e\u6311\u6218', '\u9876\u5c16\u7ade\u6280\u8fd0\u52a8\u5458'] }
    };

    return figures[type] || { name: '\u672a\u77e5', icon: '', bg: '#eee', desc: '', traits: [] };
  },

  retest: function () {
    this.setData({
      currentIndex: 0,
      selectedValue: 0,
      showResult: false,
      progress: (1 / this.data.questions.length) * 100,
      answers: [],
      currentQuestion: this.data.questions[0],
      currentDimension: this._getDimensionLabel(this.data.questions[0].dimension)
    });
  },

  goBack: function () {
    wx.navigateBack();
  }
});
