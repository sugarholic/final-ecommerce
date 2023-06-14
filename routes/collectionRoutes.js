import express  from "express";
import { isAdmin, requireSignin } from '../middlewares/authMidlleware.js';
import { addCollectionController, collectionController, deleteCollectionController, singleCollectionController, updateCollectionController } from '../controllers/collectionController.js';

const router = express.Router();

//routes
//create collection
router.post('/add-collection', requireSignin, isAdmin, addCollectionController);

//update category
router.put('/update-collection/:id', requireSignin, isAdmin, updateCollectionController);

//get all collection
router.get('/get-collection', collectionController)

//single collection
router.get('/single-collection/:slug', singleCollectionController);

//delete collection
router.delete('/delete-collection/:id', requireSignin, isAdmin, deleteCollectionController);

export default router;