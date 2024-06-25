const Product = require("../../models/product.model")
const systemConfig = require("../../config/system")
const filterStatusHelper = require("../../helpers/filterStatus")
const searchHelper = require("../../helpers/search")
const paginationHelper = require("../../helpers/pagination")
// [GET] /admin/products

module.exports.index = async (req, res) => {
    const filterStatus = filterStatusHelper(req.query);

    let find = {
        deleted: false,
    };

    if (req.query.status) {
        find.status = req.query.status;
    }


    const objectSearch = searchHelper(req.query)
    if (objectSearch.regex) {
        find.title = objectSearch.regex;
    }

    // Pagination
    const countProducts = await Product.countDocuments(find);
    let objectPagination = paginationHelper(
        {
        currentPage: 1,
        limitItem: 4
        },
        req.query,
        countProducts
        );
    
    // End Pagination
    const products = await Product.find(find)
    .sort({position: "desc"})
    .limit(objectPagination.limitItem)
    .skip(objectPagination.skip);
    
    res.render("admin/pages/products/index.pug", {
        pageTitle: "Danh sách sản phẩm",
        products: products,
        filterStatus: filterStatus,
        keyword: objectSearch.keyword,
        pagination: objectPagination

      });
  }

// [PATCH] /admin/products/change-status/:status/:id
module.exports.changeStatus = async (req, res) => {
    const status = req.params.status;
    const id = req.params.id;
    await Product.updateOne({ _id: id },{ status: status })
    
    req.flash("success","Cập nhật trạng thái thành công!")
    res.redirect("back");
}

// [PATCH] /admin/products/change-multi
module.exports.changeMulti = async (req, res) => {
    
    const type = req.body.type;
    const ids = req.body.ids.split(", ");
    // console.log(type)
    // console.log(ids)
    
    switch (type){
        case "active":
            await Product.updateMany({ _id: { $in: ids} }, {status: "active"});
            req.flash("success",`Cập nhật trạng thái thành công ${ids.length} sản phẩm!`)
            break;
        case "inactive":
            await Product.updateMany({ _id: { $in: ids} }, {status: "inactive"});
            req.flash("success",`Cập nhật trạng thái thành công ${ids.length} sản phẩm!`)
            break;
        case "delete-all":
            await Product.updateMany({ _id: { $in: ids} }, {
                deleted: true,
                deleteAt: new Date()
            });
            req.flash("success",`Đã xóa thành công ${ids.length} sản phẩm!`)
            break;
        case "change-position":
            // console.log(ids)
            for (const item of ids) {
                let [id, position] = item.split("-");
                position = parseInt(position)
                // console.log(id)
                // console.log(position)
                await Product.updateOne({ _id: id },{ 
                    position: position
                })
            req.flash("success",`Thay đổi vị trí thành công ${ids.length} sản phẩm!`)
            }
            
            break;
        default:
            break;
    }
  
    res.redirect("back");
   
}
// [DELETE] /admin/products/delete/:id

module.exports.deleteItem = async (req, res) => {
    const id = req.params.id;
    // await Product.deleteOne({ _id: id })
// Xóa cứng, xóa vĩnh viễn
    await Product.updateOne({ _id: id }, {
        deleted: true,
        deleteAt: new Date()
    })
    req.flash("success",`Đã xóa thành công sản phẩm!`)
    res.redirect("back");
}

// [GET] /admin/products/create

module.exports.create = async (req, res) => {
    res.render("admin/pages/products/create.pug", {
        pageTitle: "Thêm mới sản phẩm"
  

      });
  }
// [POST] /admin/products/create

module.exports.createPost = async (req, res) => {

    
    if (req.body.title.length < 8) {
        req.flash("error",`Vui lòng nhập tiêu đề ít nhất 8 ký tự`)
        res.redirect("back")
        return;
        // return sẽ dừng hết các đoạn code bên dưới
    }

    req.body.price = parseInt(req.body.price)
    req.body.discountPercentage = parseInt(req.body.discountPercentage)
    req.body.stock = parseInt(req.body.stock)
    if (req.body.position == "") {
        const countProducts = await Product.countDocuments()
        req.body.position = countProducts + 1
    } else {
        req.body.position = parseInt(req.body.position)
    }
    // Lưu offline trong thư mục upload
    // if (req.file){
    //     req.body.thumbnail = `/uploads/${req.file.filename}`
    // }
 
    
    // Lưa dữ liệu vào database
    const product = new Product(req.body);
    await product.save();
    res.redirect(`${systemConfig.prefixAdmin}/products`)
      
  }

// [GET] /admin/products/edit/:id

module.exports.edit = async (req, res) => {
    
    try {
        const find = {
            deleted: false,
            _id: req.params.id
        };
    
    
   const product = await Product.findOne(find)
 
    res.render("admin/pages/products/edit", {
        pageTitle: "Chỉnh sửa sản phẩm",
        product: product

      });
  } catch (error) {
    res.redirect(`${systemConfig.prefixAdmin}/products`)
  }
}




module.exports.editPatch = async (req, res) => {
    
    if (req.body.title.length < 8) {
        req.flash("error",`Vui lòng nhập tiêu đề ít nhất 8 ký tự`)
        res.redirect("back")
        return;
        // return sẽ dừng hết các đoạn code bên dưới
    }
    const id = req.params.id
    req.body.price = parseInt(req.body.price)
    req.body.discountPercentage = parseInt(req.body.discountPercentage)
    req.body.stock = parseInt(req.body.stock)
    req.body.position = parseInt(req.body.position)
    if (req.file){
        req.body.thumbnail = `/uploads/${req.file.filename}`
    }
    
    

    try {
        await Product.updateOne({_id: id},req.body)
        req.flash("success",`Cập nhật thành công sản phẩm!`)
    } catch (error) {
        req.flash("error",`Cập nhật thất bại`)
    }
    res.redirect(`back`)
  }

  // [GET] /admin/products/detail/:id
module.exports.detail = async (req, res) => {
    
    try {
        const find = {
            deleted: false,
            _id: req.params.id,
            status: "active"
        };
    
    
   const product = await Product.findOne(find)
 
    res.render("admin/pages/products/detail", {
        pageTitle: product.title,
        product: product

      });
  } catch (error) {
    res.redirect(`${systemConfig.prefixAdmin}/products`)
  }
}