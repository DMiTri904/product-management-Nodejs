const Role = require('../../models/role.model')
const systemConfig = require('../../config/system')

// [GET] /admin/role
module.exports.index = async (req, res) => {
  let find = {
    deleted: false
  }

  const records = await Role.find(find)
  res.render('admin/pages/roles/index', {
    pageTitle: 'Nhóm quyền',
    records: records
  })
}

// [GET] /admin/role/create
module.exports.create = async (req, res) => {
  res.render('admin/pages/roles/create', {
    pageTitle: 'Nhóm quyền'
  })
}

// [POST] /admin/role/create
module.exports.createPost = async (req, res) => {
  console.log(req.body)
  const record = new Role(req.body)
  await record.save()
  return res.redirect(`${systemConfig.prefixAdmin}/roles`)
}
