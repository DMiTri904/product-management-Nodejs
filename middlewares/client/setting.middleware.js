const SettingGeneral = require('../../models/settings-general.model')

module.exports.settingGeneral = async (req, res, next) => {
  const url = req.originalUrl

  if (
    url.includes('.') ||
    url.includes('favicon.ico') ||
    url.startsWith('/json/')
  ) {
    return next()
  }

  settingGeneral = await SettingGeneral.findOne({})
  res.locals.settingGeneral = settingGeneral

  next()
}
