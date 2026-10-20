const store = require('./local-store');

function readList(key) {
  const value = store.read(key, []);
  return Array.isArray(value) ? value : [];
}

function writeList(key, list) {
  return store.write(key, Array.isArray(list) ? list : []);
}

function isAllTag(tag) {
  return !tag || tag === '全部' || tag === '综合';
}

function paginate(list, page, pageSize) {
  const currentPage = Math.max(1, Number(page) || 1);
  const size = Math.max(1, Number(pageSize) || 10);
  const start = (currentPage - 1) * size;
  return {
    list: list.slice(start, start + size),
    hasMore: start + size < list.length,
    page: currentPage
  };
}

function getTopics(options) {
  const opts = options || {};
  let topics = readList('forumTopics');
  if (!isAllTag(opts.tag)) {
    topics = topics.filter(function(topic) {
      return topic.topicTag === opts.tag || topic.tag === opts.tag;
    });
  }
  topics.sort(function(a, b) {
    if (opts.sort === 'hot') {
      return (b.likes || 0) - (a.likes || 0);
    }
    return new Date(b.createTime || 0).getTime() - new Date(a.createTime || 0).getTime();
  });
  return Promise.resolve({
    success: true,
    data: paginate(topics, opts.page, opts.pageSize)
  });
}

function createTopic(payload) {
  const topic = Object.assign({}, payload, {
    _id: store.createId('topic'),
    likes: 0,
    views: 0,
    likedUsers: [],
    commentsCount: 0,
    createTime: new Date().toISOString()
  });
  const topics = readList('forumTopics');
  topics.unshift(topic);
  writeList('forumTopics', topics);
  return Promise.resolve({ success: true, data: topic });
}

function getTopicDetail(topicId) {
  const topic = readList('forumTopics').find(function(item) {
    return String(item._id) === String(topicId);
  });
  return Promise.resolve(topic
    ? { success: true, data: topic }
    : { success: false, errMsg: '话题不存在' });
}

function likeTopic(topicId, userId) {
  let updated = null;
  const topics = readList('forumTopics').map(function(topic) {
    if (String(topic._id) !== String(topicId)) return topic;
    const likedUsers = Array.isArray(topic.likedUsers) ? topic.likedUsers.slice() : [];
    const index = likedUsers.indexOf(userId);
    if (index >= 0) likedUsers.splice(index, 1);
    else likedUsers.push(userId);
    updated = Object.assign({}, topic, {
      likedUsers,
      likes: likedUsers.length
    });
    return updated;
  });
  writeList('forumTopics', topics);
  return Promise.resolve(updated
    ? { success: true, data: updated }
    : { success: false, errMsg: '话题不存在' });
}

function deleteTopic(topicId, userId) {
  const topic = readList('forumTopics').find(function(item) {
    return String(item._id) === String(topicId);
  });
  if (!topic) return Promise.resolve({ success: false, errMsg: '话题不存在' });
  if (userId && topic.userId && String(topic.userId) !== String(userId)) {
    return Promise.resolve({ success: false, errMsg: '无权删除该话题' });
  }
  writeList('forumTopics', readList('forumTopics').filter(function(item) {
    return String(item._id) !== String(topicId);
  }));
  writeList('forumComments', readList('forumComments').filter(function(item) {
    return String(item.topicId) !== String(topicId);
  }));
  return Promise.resolve({ success: true });
}

function getComments(topicId, page, pageSize) {
  const comments = readList('forumComments')
    .filter(function(item) { return String(item.topicId) === String(topicId); })
    .sort(function(a, b) {
      return new Date(a.createTime || 0).getTime() - new Date(b.createTime || 0).getTime();
    });
  return Promise.resolve({
    success: true,
    data: paginate(comments, page, pageSize)
  });
}

function createComment(payload) {
  const comment = Object.assign({}, payload, {
    _id: store.createId('comment'),
    createTime: new Date().toISOString()
  });
  const comments = readList('forumComments');
  comments.push(comment);
  writeList('forumComments', comments);

  const topics = readList('forumTopics').map(function(topic) {
    if (String(topic._id) !== String(payload.topicId)) return topic;
    return Object.assign({}, topic, {
      commentsCount: (topic.commentsCount || 0) + 1
    });
  });
  writeList('forumTopics', topics);
  return Promise.resolve({ success: true, data: comment });
}

function deleteComment(commentId, userId) {
  const comment = readList('forumComments').find(function(item) {
    return String(item._id) === String(commentId);
  });
  if (!comment) return Promise.resolve({ success: false, errMsg: '评论不存在' });
  if (userId && comment.userId && String(comment.userId) !== String(userId)) {
    return Promise.resolve({ success: false, errMsg: '无权删除该评论' });
  }
  writeList('forumComments', readList('forumComments').filter(function(item) {
    return String(item._id) !== String(commentId);
  }));
  const topics = readList('forumTopics').map(function(topic) {
    if (String(topic._id) !== String(comment.topicId)) return topic;
    return Object.assign({}, topic, {
      commentsCount: Math.max(0, (topic.commentsCount || 1) - 1)
    });
  });
  writeList('forumTopics', topics);
  return Promise.resolve({ success: true });
}

function getVideos(options) {
  const opts = options || {};
  let videos = readList('forumVideos');
  if (!isAllTag(opts.tag)) {
    videos = videos.filter(function(video) {
      return video.category === opts.tag || video.topicTag === opts.tag;
    });
  }
  videos.sort(function(a, b) {
    if (opts.sort === 'hot') return (b.views || 0) - (a.views || 0);
    return new Date(b.createTime || 0).getTime() - new Date(a.createTime || 0).getTime();
  });
  return Promise.resolve({
    success: true,
    data: paginate(videos, opts.page, opts.pageSize)
  });
}

function createVideo(payload) {
  const video = Object.assign({}, payload, {
    _id: store.createId('video'),
    views: 0,
    createTime: new Date().toISOString()
  });
  const videos = readList('forumVideos');
  videos.unshift(video);
  writeList('forumVideos', videos);
  return Promise.resolve({ success: true, data: video });
}

function deleteVideo(videoId, userId) {
  const video = readList('forumVideos').find(function(item) {
    return String(item._id) === String(videoId);
  });
  if (!video) return Promise.resolve({ success: false, errMsg: '视频不存在' });
  if (userId && video.userId && String(video.userId) !== String(userId)) {
    return Promise.resolve({ success: false, errMsg: '无权删除该视频' });
  }
  writeList('forumVideos', readList('forumVideos').filter(function(item) {
    return String(item._id) !== String(videoId);
  }));
  return Promise.resolve({ success: true });
}

function getHotTags() {
  const counts = {};
  readList('forumTopics').forEach(function(topic) {
    const tag = topic.topicTag || topic.tag;
    if (tag) counts[tag] = (counts[tag] || 0) + 1;
  });
  return Promise.resolve({
    success: true,
    data: Object.keys(counts)
      .map(function(name) { return { name, count: counts[name] }; })
      .sort(function(a, b) { return b.count - a.count; })
  });
}

function getUserTopics(userId) {
  const topics = readList('forumTopics')
    .filter(function(item) { return String(item.userId) === String(userId); })
    .sort(function(a, b) {
      return new Date(b.createTime || 0).getTime() - new Date(a.createTime || 0).getTime();
    });
  return Promise.resolve({ success: true, data: topics });
}

function getUserVideos(userId) {
  const videos = readList('forumVideos')
    .filter(function(item) { return String(item.userId) === String(userId); })
    .sort(function(a, b) {
      return new Date(b.createTime || 0).getTime() - new Date(a.createTime || 0).getTime();
    });
  return Promise.resolve({ success: true, data: videos });
}

module.exports = {
  getTopics,
  createTopic,
  getTopicDetail,
  likeTopic,
  deleteTopic,
  getComments,
  createComment,
  deleteComment,
  getVideos,
  createVideo,
  deleteVideo,
  getHotTags,
  getUserTopics,
  getUserVideos
};
