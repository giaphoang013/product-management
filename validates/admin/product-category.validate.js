module.exports.createPost = (req, res, next) => {
    if (!req.body.title) {
        req.flash("error",`Vui lòng nhập tiêu đề sản phẩm`)
        res.redirect("back")
        return;
        // return sẽ dừng hết các đoạn code bên dưới
    }
    next();
}