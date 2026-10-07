const Product = require('../../models/product.model')

const filterStatusHelper = require('../../helpers/filterStatus') 
const searchHelper = require('../../helpers/search') 

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

  console.log(objectSearch);
  

  const products = await Product.find(find)


   res.render('admin/pages/products/index', {
    pageTitle: 'Trang danh sach san pham',
    products,
    filterStatus,
    keyword: objectSearch.keyword
  });
}