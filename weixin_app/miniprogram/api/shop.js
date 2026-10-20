const productsUtil = require('../utils/products');
const store = require('../utils/local-store');

function readList(key) {
  const value = store.read(key, []);
  return Array.isArray(value) ? value : [];
}

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function ensureCartIds(cart) {
  let changed = false;
  const result = cart.map(function(item) {
    if (!item._id) {
      changed = true;
      return Object.assign({}, item, { _id: store.createId('cart') });
    }
    return item;
  });
  if (changed) store.write('cart', result);
  return result;
}

function getCoupons(userId) {
  const claimed = readList('myCoupons');
  const claimedIds = new Set(claimed.map(function(item) {
    return String(item.id || item.couponId);
  }));
  return Promise.resolve({
    success: true,
    data: productsUtil.getCoupons().map(function(coupon) {
      return Object.assign({}, coupon, {
        claimed: Boolean(userId) && claimedIds.has(String(coupon.id))
      });
    })
  });
}

function claimCoupon(userId, couponId) {
  if (!userId) {
    return Promise.resolve({ success: false, errMsg: '请先登录' });
  }
  const coupons = productsUtil.getCoupons();
  const coupon = coupons.find(function(item) {
    return String(item.id) === String(couponId);
  });
  if (!coupon) {
    return Promise.resolve({ success: false, errMsg: '优惠券不存在' });
  }

  const myCoupons = readList('myCoupons');
  if (myCoupons.some(function(item) { return String(item.id) === String(couponId); })) {
    return Promise.resolve({ success: false, errMsg: '该优惠券已领取' });
  }

  myCoupons.unshift(Object.assign({}, coupon, {
    userId,
    claimed: true,
    used: false,
    claimTime: new Date().toISOString()
  }));
  store.write('myCoupons', myCoupons);
  return Promise.resolve({ success: true, data: myCoupons[0] });
}

function getMyCoupons(userId) {
  const coupons = readList('myCoupons').filter(function(item) {
    return !userId || !item.userId || String(item.userId) === String(userId);
  });
  return Promise.resolve({ success: true, data: coupons });
}

function getCart(userId) {
  return Promise.resolve({ success: true, data: ensureCartIds(readList('cart')) });
}

function addToCart(userId, product) {
  if (!product) {
    return Promise.resolve({ success: false, errMsg: '商品不存在' });
  }

  const cart = ensureCartIds(readList('cart'));
  const productId = product.id || product.productId;
  const specKey = product.specKey || '';
  const index = cart.findIndex(function(item) {
    return String(item.id || item.productId) === String(productId) &&
      (item.specKey || '') === specKey;
  });

  if (index >= 0) {
    cart[index] = Object.assign({}, cart[index], {
      quantity: (Number(cart[index].quantity) || 0) + (Number(product.quantity) || 1)
    });
  } else {
    cart.push(Object.assign({}, product, {
      _id: store.createId('cart'),
      id: productId,
      productId,
      quantity: Number(product.quantity) || 1,
      selected: product.selected !== undefined ? product.selected : true,
      addTime: Date.now()
    }));
  }

  store.write('cart', cart);
  return Promise.resolve({ success: true, data: cart });
}

function updateCartItem(userId, cartItemId, quantity) {
  const cart = ensureCartIds(readList('cart')).map(function(item) {
    if (String(item._id) !== String(cartItemId)) return item;
    return Object.assign({}, item, { quantity: Math.max(1, Number(quantity) || 1) });
  });
  store.write('cart', cart);
  return Promise.resolve({ success: true, data: cart });
}

function removeCartItems(userId, cartItemIds) {
  const ids = new Set((cartItemIds || []).map(String));
  const cart = ensureCartIds(readList('cart')).filter(function(item) {
    return !ids.has(String(item._id));
  });
  store.write('cart', cart);
  return Promise.resolve({ success: true, data: cart });
}

function getOrders(userId, status) {
  const orders = readList('purchaseOrders').filter(function(order) {
    const belongsToUser = !userId || !order.userId || String(order.userId) === String(userId);
    return belongsToUser && (!status || order.status === status);
  });
  orders.sort(function(a, b) {
    return new Date(b.createTime || 0).getTime() - new Date(a.createTime || 0).getTime();
  });
  return Promise.resolve({ success: true, data: orders });
}

function createOrder(userId, orderData) {
  const id = store.createId('order');
  const now = new Date();
  const orderNo = 'FS' + now.getFullYear() +
    String(now.getMonth() + 1).padStart(2, '0') +
    String(now.getDate()).padStart(2, '0') +
    String(Date.now()).slice(-6);
  const order = Object.assign({}, orderData, {
    _id: id,
    id,
    orderNo,
    userId,
    status: orderData.status || 'paid',
    createTime: now.toISOString(),
    items: clone(orderData.items || [])
  });

  const orders = readList('purchaseOrders');
  orders.unshift(order);
  store.write('purchaseOrders', orders);

  if (orderData.cartItemIds && orderData.cartItemIds.length > 0) {
    removeCartItems(userId, orderData.cartItemIds);
  }

  return Promise.resolve({ success: true, data: order });
}

function getOrderDetail(userId, orderId) {
  const order = readList('purchaseOrders').find(function(item) {
    return String(item._id) === String(orderId) || String(item.id) === String(orderId);
  });
  return Promise.resolve(order
    ? { success: true, data: order }
    : { success: false, errMsg: '订单不存在' });
}

function updateOrderStatus(orderId, status) {
  let updated = null;
  const orders = readList('purchaseOrders').map(function(order) {
    if (String(order._id) !== String(orderId) && String(order.id) !== String(orderId)) return order;
    updated = Object.assign({}, order, { status, updateTime: new Date().toISOString() });
    return updated;
  });
  store.write('purchaseOrders', orders);
  return Promise.resolve(updated
    ? { success: true, data: updated }
    : { success: false, errMsg: '订单不存在' });
}

function payOrder(userId, orderId) {
  return updateOrderStatus(orderId, 'paid');
}

function cancelOrder(userId, orderId) {
  return updateOrderStatus(orderId, 'cancelled');
}

function confirmReceive(userId, orderId) {
  return updateOrderStatus(orderId, 'received');
}

function getAddresses() {
  const addresses = readList('addresses');
  return Promise.resolve({ success: true, data: addresses });
}

function saveAddress(userId, address) {
  const addresses = readList('addresses');
  const id = address._id || address.id || store.createId('address');
  const saved = Object.assign({}, address, { _id: id, id, userId });
  const index = addresses.findIndex(function(item) {
    return String(item._id) === String(id);
  });
  if (index >= 0) addresses[index] = saved;
  else addresses.unshift(saved);
  store.write('addresses', addresses);
  return Promise.resolve({ success: true, data: saved });
}

function deleteAddress(userId, addressId) {
  const addresses = readList('addresses').filter(function(item) {
    return String(item._id) !== String(addressId);
  });
  store.write('addresses', addresses);
  return Promise.resolve({ success: true, data: addresses });
}

function getLogistics(userId, orderId) {
  return Promise.resolve({
    success: true,
    data: {
      company: '本地配送',
      trackingNo: String(orderId || ''),
      traces: [
        {
          desc: '订单数据已保存到本机',
          time: new Date().toLocaleString()
        }
      ]
    }
  });
}

module.exports = {
  getCoupons,
  claimCoupon,
  getMyCoupons,
  getCart,
  addToCart,
  updateCartItem,
  removeCartItems,
  createOrder,
  getOrders,
  getOrderDetail,
  payOrder,
  cancelOrder,
  confirmReceive,
  getAddresses,
  saveAddress,
  deleteAddress,
  getLogistics
};
