const systemConfig = require('../../config/system')

module.exports.registerPost = (req, res, next) => {
  if (!req.body.fullName) {
    req.flash('error', `Họ tên không được để trống!`)
    res.redirect(req.get('Referer'))
    return
  }
  if (!req.body.email) {
    req.flash('error', `Vui lòng nhập email!`)
    res.redirect(req.get('Referer'))
    return
  }
  if (!req.body.password) {
    req.flash('error', `Vui lòng nhập password!`)
    res.redirect(req.get('Referer'))
    return
  }
  next()
}
module.exports.loginPost = (req, res, next) => {
  if (!req.body.email) {
    req.flash('error', `Vui lòng nhập email!`)
    res.redirect(req.get('Referer'))
    return
  }
  if (!req.body.password) {
    req.flash('error', `Vui lòng nhập password!`)
    res.redirect(req.get('Referer'))
    return
  }
  next()
}
module.exports.forgotPasswordPost = (req, res, next) => {
  if (!req.body.email) {
    req.flash('error', `Vui lòng nhập email!`)
    res.redirect(req.get('Referer'))
    return
  }

  next()
}
