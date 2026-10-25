const Product = require('../../models/product.model')
const ProductCategory = require('../../models/product-category.model')
const Account = require('../../models/account.model')
const createTreeHelper = require('../../helpers/createTree')

const systemConfig = require('../../config/system')

const filterStatusHelper = require('../../helpers/filterStatus')
const searchHelper = require('../../helpers/search')
const paginationHelper = require('../../helpers/pagination')

// [GET] /admin/products
module.exports.index = async (req, res) => {
  const filterStatus = filterStatusHelper(req.query)

  let find = {
    deleted: false
  }

  if (req.query.status) {
    find.status = req.query.status
  }

  const objectSearch = searchHelper(req.query)

  if (objectSearch.regex) {
    find.title = objectSearch.regex
  }

  // Pagination
  const countProducts = await Product.countDocuments(find)

  let objectPagination = paginationHelper(
    {
      currentPage: 1,
      limitItems: 4
    },
    req.query,
    countProducts
  )

  // End Pagination

  // Sort
  let sort = {}
  if (req.query.sortKey && req.query.sortValue) {
    sort[req.query.sortKey] = req.query.sortValue
  } else {
    sort.position = 'desc'
  }
  // End Sort

  const products = await Product.find(find)
    .sort(sort)
    .limit(objectPagination.limitItems)
    .skip(objectPagination.skip)

  for (const product of products) {
    // Lấy ra thông tin người tạo
    const user = await Account.findOne({
      _id: product.createdBy.account_id
    })

    if (user) {
      product.accountFullName = user.fullName
    }

    // Lấy ra thông tin người cập nhật gần nhất
    const updatedBy = product.updatedBy[product.updatedBy.length - 1]
    if (updatedBy) {
      const userUpdated = await Account.findOne({
        _id: updatedBy.account_id
      })

      updatedBy.accountFullName = userUpdated.fullName
    }
  }

  res.render('admin/pages/products/index', {
    pageTitle: 'Trang danh sach san pham',
    products,
    filterStatus,
    keyword: objectSearch.keyword,
    pagination: objectPagination
  })
}

// [PATCH] /admin/products/change-status/:status/:id

module.exports.changeStatus = async (req, res) => {
  const status = req.params.status
  const id = req.params.id
  const updatedBy = {
    account_id: res.locals.user.id,
    updatedAt: new Date()
  }

  await Product.updateOne({ _id: id }, { status: status, $push: { updatedBy } })

  req.flash('success', 'Cập nhật trạng thái sản phẩm thành công!')

  res.redirect(req.get('Referer') || '/admin/products')
}

// [PATCH] /admin/products/change-multi

module.exports.changeMulti = async (req, res) => {
  const ids = req.body.ids.split(', ')
  const type = req.body.type
  const status = req.body.status
  const updatedBy = {
    account_id: res.locals.user.id,
    updatedAt: new Date()
  }

  switch (type) {
    case 'active':
      await Product.updateMany(
        { _id: { $in: ids } },
        { status: `active`, $push: { updatedBy } }
      )
      req.flash(
        'success',
        `Cập nhật trạng thái của ${ids.length} sản phẩm thành công!`
      )
      break
    case 'inactive':
      await Product.updateMany(
        { _id: { $in: ids } },
        { status: `inactive`, $push: { updatedBy } }
      )
      req.flash(
        'success',
        `Cập nhật trạng thái của ${ids.length} sản phẩm thành công!`
      )
      break
    case 'delete-all':
      await Product.updateMany(
        { _id: { $in: ids } },
        {
          deleted: true,
          deletedBy: { account_id: res.locals.user.id, deletedAt: new Date() }
        }
      )
      req.flash('success', `Đã xóa thành công ${ids.length} sản phẩm!`)

      break
    case 'change-position':
      for (const item of ids) {
        let [id, position] = item.split('-')
        position = parseInt(position)
        await Product.updateMany(
          { _id: id },
          { position, $push: { updatedBy } }
        )
      }
      req.flash(
        'success',
        `Đã thay đổi vị trí ${ids.length} sản phẩm thành công!`
      )
      // await Product.updateMany({_id:{ $in: ids}}, {deleted: true, deleteAt: new Date()})
      break
    default:
      break
  }

  res.redirect(req.get('Referer') || '/admin/products')
}

// [DELETE] /admin/products/delete

module.exports.deleteItem = async (req, res) => {
  const id = req.params.id
  // Xóa cứng
  // await Product.deleteOne({_id: id})
  // Xóa mềm
  await Product.updateOne(
    { _id: id },
    {
      deleted: true,
      deletedBy: { account_id: res.locals.user.id, deletedAt: new Date() }
    }
  )
  req.flash('success', `Đã xóa sản phẩm thành công!`)

  res.redirect(req.get('Referer') || '/admin/products')
}

// [GET] /admin/products/create
module.exports.create = async (req, res) => {
  console.log(res.locals.user)
  let find = {
    deleted: false
  }

  const category = await ProductCategory.find(find)

  const newCategory = createTreeHelper.tree(category)
  res.render('admin/pages/products/create', {
    pageTitle: 'Thêm mới sản phẩm',
    category: newCategory
  })
}

// [POST] /admin/products/create
module.exports.createPost = async (req, res) => {
  req.body.price = parseInt(req.body.price)
  req.body.discountPercentage = parseInt(req.body.discountPercentage)
  req.body.stock = parseInt(req.body.stock)
  if (req.body.position == '') {
    const countProducts = await Product.countDocuments()
    req.body.position = countProducts + 1
  } else {
    req.body.position = parseInt(req.body.position)
  }

  req.body.createdBy = {
    account_id: res.locals.user.id
  }

  const product = new Product(req.body)
  await product.save()

  res.redirect(`${systemConfig.prefixAdmin}/products`)
}

// [GET] /admin/products/edit/:id
module.exports.edit = async (req, res) => {
  try {
    const find = {
      deleted: false,
      _id: req.params.id
    }

    const product = await Product.findOne(find)

    const category = await ProductCategory.find({
      deleted: false
    })

    const newCategory = createTreeHelper.tree(category)

    if (!product) {
      req.flash('error', 'Sản phẩm không tồn tại')
      return res.redirect(`${systemConfig.prefixAdmin}/products`)
    }

    res.render('admin/pages/products/edit', {
      pageTitle: 'Chỉnh sửa sản phẩm',
      product,
      category: newCategory
    })
  } catch (error) {
    req.flash('error', 'Sản phẩm không tồn tại')
    return res.redirect(`${systemConfig.prefixAdmin}/products`)
  }
}

// [PATCH] /admin/products/edit/:id
module.exports.editPatch = async (req, res) => {
  req.body.price = parseInt(req.body.price)
  req.body.discountPercentage = parseInt(req.body.discountPercentage)
  req.body.stock = parseInt(req.body.stock)
  req.body.position = parseInt(req.body.position)

  if (req.file) {
    req.body.thumbnail = `/uploads/${req.file.filename}`
  }
  try {
    const updatedBy = {
      account_id: res.locals.user.id,
      updatedAt: new Date()
    }

    await Product.updateOne(
      { _id: req.params.id },
      { ...req.body, $push: { updatedBy } }
    )
    req.flash('success', `Cập nhật sản phẩm thành công!`)
  } catch (error) {
    req.flash('error', `Cập nhật sản phẩm thất bại!`)
  }
  res.redirect(req.get('Referer'))
}

// [GET] /admin/products/detail/:id
module.exports.detail = async (req, res) => {
  try {
    const find = {
      deleted: false,
      _id: req.params.id
    }

    const product = await Product.findOne(find)

    if (!product) {
      req.flash('error', 'Sản phẩm không tồn tại')
      return res.redirect(`${systemConfig.prefixAdmin}/products`)
    }

    res.render('admin/pages/products/detail', {
      pageTitle: product.title,
      product
    })
  } catch (error) {
    req.flash('error', 'Sản phẩm không tồn tại')
    return res.redirect(`${systemConfig.prefixAdmin}/products`)
  }
}
