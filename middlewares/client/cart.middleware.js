const Cart = require('../../models/cart.model')
module.exports.cartId = async (req, res, next) => {
  const url = req.originalUrl

  // Bỏ qua các request file tĩnh, favicon VÀ các request ngầm /json/ của DevTools
  if (
    url.includes('.') ||
    url.includes('favicon.ico') ||
    url.startsWith('/json/')
  ) {
    return next()
  }

  if (!req.cookies.cartId) {
    // Khi chưa có giỏ hàng
    const cart = new Cart()
    await cart.save()
    const expiresTime = 1000 * 60 * 60 * 24 * 365
    res.cookie('cartId', cart.id, {
      expires: new Date(Date.now() + expiresTime)
    })
  } else {
    // Khi có giỏ hàng
    console.log('co r')
  }
  next()
}
