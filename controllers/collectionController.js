import collectionModel from "../models/collectionModel.js";
import slugify from "slugify";

export const addCollectionController = async(req, res) => {
    try {
        const {name} = req.body;
        if(!name) {
            return res.status(401).send({
                message: 'Name is required',
            });
        }
        const existingCollection = await collectionModel.findOne({name})
        if(existingCollection) {
            return res.status(200).send({
                success: true,
                message: 'Category exist already',
            });
        }

        const collection = await new collectionModel({name, slug:slugify(name)}).save()
        res.status(201).send({
            success: true,
            message: 'Collection Created',
            collection,
        });

    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            error,
            message: 'Collection Error',
        });
    }
};

//updateCollectionController - upate collection
export const updateCollectionController = async(req, res) => {
    try {
        const {name} = req.body;
        const {id} = req.params;
        const collection = await collectionModel.findByIdAndUpdate(id, {name, slug:slugify(name)}, {new: true});

        res.status(200).send({
            success: true,
            message: 'Collection Updated',
            collection,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            error,
            message: 'Update error',
        });
    }
};

//get all collection
export  const collectionController = async(req, res) => {
    try {
        const collection = await collectionModel.find({});
        res.status(200).send({
            success: true,
            message: 'All Collection shown',
            collection,
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            error,
            message: 'Cannot get all Collection',
        });
    }
};

//get single collection
export const singleCollectionController = async(req, res) => {
    try {
        const collection = await collectionModel.findOne({slug:req.params.slug})
        res.status(200).send({
            success: true,
            message: 'Succesfully get single collection',
            collection,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            error,
            message: 'Cannot get single collection',
        })
    }
};

//delete collection
export const deleteCollectionController = async(req, res) => {
    try {
        const {id} = req.params;
        await collectionModel.findByIdAndDelete(id);   
        res.status(200).send({
            success: true,
            message: 'Collection deleted successfully',
            
        })     
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: 'false',
            message: 'Delete Unsuccessful',
            error,
        })
    }
};