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

// [PATCH] /admin/role/edit/:id
module.exports.edit = async (req, res) => {
  try {
    const id = req.params.id
    const find = {
      deleted: false,
      _id: req.params.id
    }

    const data = await Role.findOne(find)

    res.render('admin/pages/roles/edit', {
      pageTitle: 'Sửa nhóm quyền',
      data
    })
  } catch (error) {
    return res.redirect(`${systemConfig.prefixAdmin}/roles`)
  }
}

// [PATCH] /admin/role/edit/:id
module.exports.editPatch = async (req, res) => {
  try {
    const id = req.params.id
    await Role.updateOne({ _id: id }, req.body)

    req.flash('success', `Cập nhật nhóm quyền thành công!`)

    // res.redirect(req.get('Referer'))
    res.redirect(`${systemConfig.prefixAdmin}/roles`)
  } catch (error) {
    req.flash('error', `Cập nhật nhóm quyền thất bại!`)
    res.redirect(req.get('Referer'))
  }
}

// [DELETE] /admin/role/edit/:id
module.exports.deleteRole = async (req, res) => {
  const id = req.params.id

  await Role.updateOne({ _id: id }, { deleted: true, deleteAt: new Date() })
  req.flash('success', `Đã xóa nhóm quyền thành công!`)

  res.redirect(req.get('Referer') || '/admin/roles')
  res.send('ok')
}

// [GET] /admin/role/detail/:id
module.exports.detail = async (req, res) => {
  try {
    const find = {
      deleted: false,
      _id: req.params.id
    }

    const data = await Role.findOne(find)

    res.render('admin/pages/roles/detail', {
      pageTitle: 'Chi tiết nhóm quyền',
      data
    })
  } catch (error) {
    return res.redirect(`${systemConfig.prefixAdmin}/roles`)
  }
}

// [GET] /admin/permissions
module.exports.permissions = async (req, res) => {
  let find = {
    deleted: false
  }

  const records = await Role.find(find)
  res.render('admin/pages/roles/permissions', {
    pageTitle: 'Phân quyền',
    records
  })
}

// [PATCH] /admin/permissions
module.exports.permissionsPatch = async (req, res) => {
  try {
    const permissions = JSON.parse(req.body.permissions)

    for (const item of permissions) {
      await Role.updateOne({ _id: item.id }, { permissions: item.permissions })
    }

    req.flash('success', `Cập nhật phân quyền thành công!`)
  } catch (error) {
    req.flash('error', `Cập nhật phân quyền thất bại!`)
  }

  res.redirect(req.get('Referer'))
}
