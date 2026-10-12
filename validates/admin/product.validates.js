module.exports.createPost = (req, res, next) => {
  if(!req.body.title) {
    req.flash('error', `Vui lòng nhập tiêu đề cho sản phẩm`);
    res.redirect(req.get('Referer') || '/admin/products')
    return
  }
  next()
}