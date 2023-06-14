import express from 'express';
import { isAdmin, requireSignin } from '../middlewares/authMidlleware.js';
import { braintreeTokenController, createProductController, deleteProductController, getProductController, getSingleProductController, productFilterController, productPhotoController, relatedProductController, searchProductController, updateProductController } from '../controllers/productController.js';
import formidable from 'express-formidable';

const router = express.Router();

//router
//create products
router.post('/add-product', requireSignin, isAdmin, formidable(), createProductController);

//update product
router.put('/update-product/:pid', requireSignin, isAdmin, formidable(), updateProductController);

//get products (all)
router.get('/get-product', getProductController);

//get single product
router.get('/get-product/:slug', getSingleProductController);

//get photo
router.get('/product-photo/:pid', productPhotoController);

//delete product
router.delete('/delete-product/:pid', deleteProductController);

//filter product
router.post('/product-filters', productFilterController);

//search product
router.get('/search/:keyword', searchProductController);

//product you might like
router.get('related-product/:pid/:cid', relatedProductController);

//payment routes
//token
// router.get('/braintree/token', braintreeTokenController);

// //payment
// router.post('/braintree/payment', requireSignin, brainTreePaymentController)

export default router;