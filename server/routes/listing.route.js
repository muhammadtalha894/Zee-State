import express from 'express';
import {
  createListing,
  userListing,
  listingDetails,
  deleteUserListing,
  updateListing,
  getListings,
} from '../controllers/listing.controller.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const listingRoute = express.Router();

listingRoute.post('/create', authMiddleware, createListing);
listingRoute.get('/listing/:id', authMiddleware, userListing);
listingRoute.get('/details/:id', listingDetails);
listingRoute.get('/get', getListings);
listingRoute.delete('/delete/:id', authMiddleware, deleteUserListing);
listingRoute.post('/update/:id', authMiddleware, updateListing);

export default listingRoute;
