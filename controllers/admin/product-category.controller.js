const ProductCategory = require('../../models/product-category.model')
const systemConfig = require('../../config/system')
const createTreeHelper = require('../../helpers/createTree')

// [GET] /admin/product-category
module.exports.index = async (req, res) => {
  let find = {
    deleted: false
  }

  const records = await ProductCategory.find(find)

  const newRecords = createTreeHelper.tree(records)
  res.render('admin/pages/product-category/index', {
    pageTitle: 'Danh mục sản phẩm',
    records: newRecords
  })
}

// [GET] /admin/product-category/create
module.exports.create = async (req, res) => {
  let find = {
    deleted: false
  }

  const records = await ProductCategory.find(find)

  const newRecords = createTreeHelper.tree(records)

  res.render('admin/pages/product-category/create', {
    pageTitle: 'Tạo danh mục sản phẩm',
    newRecords
  })
}

// [POST] /admin/product-category/create
module.exports.createPost = async (req, res) => {
  if (req.body.position == '') {
    const count = await ProductCategory.countDocuments()
    req.body.position = count + 1
  } else {
    req.body.position = parseInt(req.body.position)
  }

  const record = new ProductCategory(req.body)
  await record.save()
  res.redirect(`${systemConfig.prefixAdmin}/product-category`)
}

// [GET] /admin/product-category/edit/:id
module.exports.edit = async (req, res) => {
  try {
    const id = req.params.id

    const data = await ProductCategory.findOne({
      _id: id,
      deleted: false
    })

    const records = await ProductCategory.find({
      deleted: false
    })
    const newRecords = createTreeHelper.tree(records)

    res.render('admin/pages/product-category/edit', {
      pageTitle: 'Chỉnh sửa danh mục sản phẩm',
      data,
      records: newRecords
    })
  } catch (error) {
    return res.redirect(`${systemConfig.prefixAdmin}/product-category`)
  }
}

// [PATCH] /admin/product-category/edit/:id
module.exports.editPatch = async (req, res) => {
  const id = req.params.id

  req.body.position = parseInt(req.body.position)

  await ProductCategory.updateOne(
    {
      _id: id
    },
    req.body
  )
  res.redirect(req.get('Referer'))
}

// [DELETE] /admin/product-category/delete/:id
module.exports.deleteCategory = async (req, res) => {
  const id = req.params.id
  await ProductCategory.updateOne(
    {
      _id: id
    },
    { deleted: true, deteleAt: new Date() }
  )
  req.flash('success', `Đã xóa danh mục thành công!`)

  res.redirect(req.get('Referer') || '/admin/product-category')
  res.send('ok')
}
// [GET] /admin/product-category/detail/:id
module.exports.detail = async (req, res) => {
  try {
    const find = {
      deleted: false,
      _id: req.params.id
    }

    const data = await ProductCategory.findOne(find)
    var parent = {}
    if (data.parent_id) {
      parent = await ProductCategory.findOne({ _id: data.parent_id })
    }

    res.render('admin/pages/product-category/detail', {
      pageTitle: 'Chi tiết danh mục',
      data,
      parent
    })
  } catch (error) {
    // return res.redirect(`${systemConfig.prefixAdmin}/product-category`)
  }
}
