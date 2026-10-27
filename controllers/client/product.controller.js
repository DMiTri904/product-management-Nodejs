const productHelper = require('../../helpers/product')

// [GET] /products

const Product = require('../../models/product.model')

module.exports.index = async (req, res) => {
  const products = await Product.find({
    status: 'active',
    deleted: false
  }).sort({ position: 'desc' })

  const newProducts = productHelper.priceNewProducts(products)

  res.render('client/pages/products/index', {
    pageTitle: 'Trang danh sách sản phẩm',
    products: newProducts
  })
}

module.exports.detail = async (req, res) => {
  try {
    const find = {
      deleted: false,
      slug: req.params.slug,
      status: 'active'
    }

    const product = await Product.findOne(find)

    if (product == null) {
      return res.redirect(`/products`)
    }
    res.render('client/pages/products/detail', {
      pageTitle: 'Chi tiết sản phẩm',
      product
    })
  } catch (error) {
    res.redirect(`/products`)
  }
}
