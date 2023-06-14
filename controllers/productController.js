import slugify from "slugify";
import productModel from "../models/productModel.js";
import fs from 'fs';
import braintree from "braintree";

// //payment
// var gateway = new braintree.BraintreeGateway({
// //   environment: braintree.Environment.Sandbox,
// //   merchantId: process.env.BRAINTREE_MERCHANT_ID,
// //   publicKey: process.env.BRAINTREE_PUBLIC_KEY,
// //   privateKey: process.env.BRAINTREE_PRIVATE_KEY,
// });

export const createProductController = async(req, res) => {
    try {
        const {name, slug, description, price, collectionName, quantity, shipping} = req.fields;
        const {photo} = req.files;

        //validation
        switch(true) {
            case !name:
                return res.status(500).send({
                    error: 'Name is required'
                });
            case !description:
                return res.status(500).send({
                    error: 'Description is required'
                });
            case !price:
                return res.status(500).send({
                    error: 'Price is required'
                });
            case !collectionName:
                return res.status(500).send({
                    error: 'Collection is required'
                });
            case !quantity:
                return res.status(500).send({
                    error: 'Quantity is required'
                });
            case photo && photo.size > 5000000:
                return res.status(500).send({
                    error: 'Photo is required and need to be less than 5MB'
                });                            
        }

        const products = new productModel({...req.fields, slug:slugify(name)})

        if(photo) {
            products.photo.data = fs.readFileSync(photo.path);
            products.photo.contentType = photo.type
        }
        
        await products.save();
        res.status(201).send({
            success: true,
            message: 'Created product successfully',
            products,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            error,
            message: 'Cannot create product',
        });
    }
};

//get product controller
export const getProductController = async(req, res) => {
    try {
        const products = await productModel.find({}).populate('collectionName').select("-photo").limit(12).sort({createdAt:-1});
        res.status(200).send({
            success: true,
            message: 'products get successfully',
            products,
            totalCount: products.length,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: 'Cannot get product',
            error: error.message,
        });
    }
};

//get single product
export const getSingleProductController = async(req, res) => {
    try {
       const product = await productModel.findOne({slug:req.params.slug}).select('-photo').populate('collectionName');
       res.status(200).send({
        success: true,
        message: 'Successfully get single product',
        product,
       });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: 'Cannot get single product',
            error,
        });
    }
};

//productPhotoController
export const productPhotoController = async(req, res) => {
    try {
       const product = await productModel.findById(req.params.pid).select('photo');
       if(product.photo.data) {
        res.set('Content-type', product.photo.contentType);
        return res.status(200).send(product.photo.data);
       }
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: 'cannot get photo',
            error,
        });
    }
};

//deleteProductController
export const deleteProductController = async(req, res) => {
    try {
        await productModel.findByIdAndDelete(req.params.pid).select('-photo');
        res.status(200).send({
            success: true,
            message: 'Photo deleted successfully',
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: 'cannot delete photo',
            error,
        });
    }
};

//update product
export const updateProductController = async(req, res) => {
    try {
        const {name, slug, description, price, collectionName, quantity, shipping} = req.fields;
        const {photo} = req.files;

        //validation
        switch(true) {
            case !name:
                return res.status(500).send({
                    error: 'Name is required'
                });
            case !description:
                return res.status(500).send({
                    error: 'Description is required'
                });
            case !price:
                return res.status(500).send({
                    error: 'Price is required'
                });
            case !collectionName:
                return res.status(500).send({
                    error: 'Collection is required'
                });
            case !quantity:
                return res.status(500).send({
                    error: 'Quantity is required'
                });
            case photo && photo.size > 5000000:
                return res.status(500).send({
                    error: 'Photo is required and need to be less than 5MB'
                });                            
        }

        const products = await productModel.findByIdAndUpdate(req.params.pid, {...req.fields, slug: slugify(name)}, {new: true});

        if(photo) {
            products.photo.data = fs.readFileSync(photo.path);
            products.photo.contentType = photo.type
        }
        
        await products.save();
        res.status(201).send({
            success: true,
            message: 'Updated product successfully',
            products,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            error,
            message: 'Cannot update product',
        });
    }
};

//filter
export const productFilterController = async (req, res) => {
    try {
        const {checked, radio} = req.body;
        let args = {};
        if (checked.length > 0) args.category = checked;
        if(radio.length) args.price = {$gte: radio[0], $lte: radio[1]};
        const products = await productModel.find(args);
        res.status(200).send({
            success: true,
            products,
        });

    } catch(error) {
        console.log(error);
        res.status(400).send({
            success: false,
            message: 'cannot filter products',
            error,
        });
    }
}

//search product
export const searchProductController = async(req, res) => {
    try {
        const {keyword} = req.params;
        const product = await productModel.find({
            $or: [
                {name: {$regex :keyword, $options: "i"}},
                {description: {$regex :keyword, $options: "i"}}
            ]
        }).select("-photo");
        res.json(results);
    } catch (error) {
        console.log(error);
        res.status(400).send({
            success: false,
            message: 'cannot search product',
            error,
        });
    }
};

//relatedProductController
export const relatedProductController = async(req, res) => {
    try {
        const {pid, cid} = req.params;
        const products = await productModel.find({
            collection: cid,
            _id:{$ne: pid}
        }).select("-photo").limit(3).populate("collection");
        res.status(200).send({
            success: true,
            products,
        });
    } catch (error) {
        console.log(error);
        res.status(404).send({
            success: false,
            message: 'cannot get related products',
            error,
        });
    }
};

//payment
export const braintreeTokenController = () => {};