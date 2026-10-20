const pointsUtil = require('../utils/points');

function getPoints() {
  return Promise.resolve({
    success: true,
    data: { points: pointsUtil.getPoints() }
  });
}

function deductPoints(userId, points, reason) {
  const amount = Math.max(0, Number(points) || 0);
  const result = pointsUtil.deductPoints(amount, reason || '积分消费');
  if (!result.success) {
    return Promise.resolve({
      success: false,
      errMsg: result.message || '积分不足'
    });
  }
  return Promise.resolve({
    success: true,
    data: { points: result.newPoints }
  });
}

function addPoints(userId, points, reason) {
  const amount = Math.max(0, Number(points) || 0);
  const result = pointsUtil.addPoints(amount, reason || '积分奖励');
  return Promise.resolve({
    success: true,
    data: { points: result.newPoints }
  });
}

function getPointsLog() {
  const logs = pointsUtil.getPointsLog().slice().reverse();
  return Promise.resolve({
    success: true,
    data: logs.map(function(item) {
      return {
        points: item.points,
        reason: item.source,
        createTime: item.time
      };
    })
  });
}

module.exports = {
  getPoints,
  deductPoints,
  addPoints,
  getPointsLog
};
