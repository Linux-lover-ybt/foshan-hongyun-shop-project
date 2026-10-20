/**
 * 积分系统工具模块
 */

const STORAGE_KEY = 'userPoints';
const POINTS_LOG_KEY = 'pointsLog';

// 获取用户当前积分
function getPoints() {
  return wx.getStorageSync(STORAGE_KEY) || 0;
}

// 设置用户积分
function setPoints(points) {
  wx.setStorageSync(STORAGE_KEY, Math.max(0, points));
}

// 增加积分并记录日志
function addPoints(points, source = '其他') {
  const currentPoints = getPoints();
  const newPoints = currentPoints + points;
  setPoints(newPoints);
  
  // 记录积分日志
  logPoints(points, source);
  
  return {
    currentPoints: currentPoints,
    newPoints: newPoints,
    pointsAdded: points
  };
}

// 消费积分
function deductPoints(points, reason = '消费') {
  const currentPoints = getPoints();
  if (currentPoints < points) {
    return {
      success: false,
      message: '积分不足'
    };
  }
  
  const newPoints = currentPoints - points;
  setPoints(newPoints);
  logPoints(-points, reason);
  
  return {
    success: true,
    currentPoints: currentPoints,
    newPoints: newPoints,
    pointsDeducted: points
  };
}

// 记录积分日志
function logPoints(points, source) {
  const logs = wx.getStorageSync(POINTS_LOG_KEY) || [];
  const timestamp = new Date();
  
  logs.push({
    points: points,
    source: source,
    time: `${timestamp.getFullYear()}-${String(timestamp.getMonth() + 1).padStart(2, '0')}-${String(timestamp.getDate()).padStart(2, '0')} ${String(timestamp.getHours()).padStart(2, '0')}:${String(timestamp.getMinutes()).padStart(2, '0')}`,
    balance: getPoints()
  });
  
  wx.setStorageSync(POINTS_LOG_KEY, logs);
}

// 获取积分日志
function getPointsLog() {
  return wx.getStorageSync(POINTS_LOG_KEY) || [];
}

// 清空积分日志
function clearPointsLog() {
  wx.removeStorageSync(POINTS_LOG_KEY);
}

module.exports = {
  getPoints,
  setPoints,
  addPoints,
  deductPoints,
  logPoints,
  getPointsLog,
  clearPointsLog
};
