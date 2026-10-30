const User = require('../../models/user.model')

module.exports.infoUser = async (req, res, next) => {
  const url = req.originalUrl

  if (
    url.includes('.') ||
    url.includes('favicon.ico') ||
    url.startsWith('/json/')
  ) {
    return next()
  }

  if (req.cookies.tokenUser) {
    const user = await User.findOne({
      tokenUser: req.cookies.tokenUser,
      deleted: false
    }).select('-password')
    console.log(user)
    if (user) {
      res.locals.user = user
    }
  }

  next()
}
