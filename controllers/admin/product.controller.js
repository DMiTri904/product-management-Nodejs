const Product = require('../../models/product.model')

const filterStatusHelper = require('../../helpers/filterStatus') 
const searchHelper = require('../../helpers/search') 
const paginationHelper = require('../../helpers/pagination') 

// [GET] /admin/products
module.exports.index = async (req, res) => {
  
  const filterStatus = filterStatusHelper(req.query)

  let find = {
    deleted: false
  }

  if(req.query.status){
    find.status = req.query.status
  }

  const objectSearch = searchHelper(req.query)

  if(objectSearch.regex) {
    find.title = objectSearch.regex
  }

  // Pagination  
    const countProducts = await Product.countDocuments(find)

    let objectPagination = paginationHelper({
      currentPage: 1,
      limitItems: 4
    }, req.query, countProducts)
    
    
    // End Pagination  
  

  const products = await Product.find(find).sort({position: "desc"}).limit(objectPagination.limitItems).skip(objectPagination.skip)


   res.render('admin/pages/products/index', {
    pageTitle: 'Trang danh sach san pham',
    products,
    filterStatus,
    keyword: objectSearch.keyword,
    pagination: objectPagination
  });
}

// [PATCH] /admin/products/change-status/:status/:id

module.exports.changeStatus = async (req, res) => {
  const status = req.params.status
  const id = req.params.id
  await Product.updateOne({_id: id}, {status: status})

  req.flash('success', 'Cập nhật trạng thái sản phẩm thành công!');
  
  res.redirect(req.get('Referer') || '/admin/products')
}

// [PATCH] /admin/products/change-multi

module.exports.changeMulti = async (req, res) => {
  const ids = req.body.ids.split(", ")
  const type = req.body.type

  switch (type) {
    case "active":
      await Product.updateMany({_id:{ $in: ids}}, {status: `active`})
      req.flash('success', `Cập nhật trạng thái của ${ids.length} sản phẩm thành công!`);
      break;
    case 'inactive':
      await Product.updateMany({_id:{ $in: ids}}, {status: `inactive`})
      req.flash('success', `Cập nhật trạng thái của ${ids.length} sản phẩm thành công!`);
      break;
    case 'delete-all':
      await Product.updateMany({_id:{ $in: ids}}, {deleted: true, deleteAt: new Date()})
      req.flash('success', `Đã xóa thành công ${ids.length} sản phẩm!`);

      break;
    case 'change-position':
      for (const item of ids) {
        let [id, position] = item.split("-")
        position = parseInt(position)
        await Product.updateMany({_id:id}, {position})
      }
      // await Product.updateMany({_id:{ $in: ids}}, {deleted: true, deleteAt: new Date()})
      break;
    default:
      break;
  }



  res.redirect(req.get('Referer') || '/admin/products')

}

// [DELETE] /admin/products/delete

module.exports.deleteItem = async (req, res) => {
  const id = req.params.id
  // Xóa cứng
  // await Product.deleteOne({_id: id})
  // Xóa mềm
  await Product.updateOne({_id: id}, {deleted: true, deleteAt: new Date()})
  req.flash('success', `Đã xóa sản phẩm thành công!`);

  
  res.redirect(req.get('Referer') || '/admin/products')
}
