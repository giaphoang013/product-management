const express = require('express')
const multer  = require('multer')



// const storageMulter = require("../../helpers/storageMulter")
// const upload = multer({ storage: storageMulter() }) upload off

const upload = multer() 

// upload online
const router = express.Router();

const controller = require("../../controllers/admin/product.controller")
const validate = require("../../validates/admin/product.validate")

const uploadCloud = require("../../middlewares/admin/uploadCloud.middlewares")

router.get('/', controller.index );
router.patch('/change-status/:status/:id', controller.changeStatus);

router.patch('/change-multi', controller.changeMulti);

router.delete('/delete/:id', controller.deleteItem);

router.get('/create', controller.create );

// router.post(
//   '/create', 
//   upload.single('thumbnail'), 
//   validate.createPost,
//   controller.createPost 
// ); 
// upload off

// upload online

router.post(
  '/create', 
  upload.single('thumbnail'), 
  uploadCloud.upload,
  validate.createPost,
  controller.createPost 
); 

router.get('/edit/:id', controller.edit );
router.patch(
  '/edit/:id', 
  upload.single('thumbnail'),
  uploadCloud.upload,
  validate.createPost,
  controller.editPatch
);
// :id là id động


router.get('/detail/:id', controller.detail );
  module.exports = router;