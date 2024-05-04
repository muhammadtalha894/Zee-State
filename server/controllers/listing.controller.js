import Listing from '../models/listing.model.js';
import ErrorHandler from '../utils/errorHandlerClass.js';
export const createListing = async (req, res, next) => {
  req.body = { ...req.body, userRef: req.user };
  try {
    const listing = await Listing.create(req.body);

    res.status(201).json({ success: true, listing });
  } catch (error) {
    next(error);
  }
};

export const userListing = async (req, res, next) => {
  if (req.user !== req.params.id)
    return next(new ErrorHandler('User not found!', 400));
  try {
    const listing = await Listing.find({ userRef: req.params.id });

    res.status(200).json({ success: true, listing });
  } catch (error) {
    next(error);
  }
};

export const deleteUserListing = async (req, res, next) => {
  let listing = await Listing.findById(req.params.id);

  if (!listing) return next(new ErrorHandler('Listing not found', 404));
  if (req.user !== listing.userRef.toString())
    return next(new ErrorHandler('you can delete your own listing', 401));
  try {
    await Listing.findByIdAndDelete(req.params.id);

    res
      .status(200)
      .json({ success: true, message: 'Listing has been deleted' });
  } catch (error) {
    next(error);
  }
};
export const updateListing = async (req, res, next) => {
  console.log(req.body);
  let listing = await Listing.findById(req.params.id);

  if (!listing) return next(new ErrorHandler('Listing not found', 404));
  if (req.user !== listing.userRef.toString())
    return next(new ErrorHandler('you can update your own listing', 401));
  try {
    const updatedListing = await Listing.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true },
    );

    res.status(200).json({ success: true, updatedListing });
  } catch (error) {
    next(error);
  }
};

export const listingDetails = async (req, res, next) => {
  console.log(req.params.id);
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) return next(new ErrorHandler('listing not found!', 400));

    res.status(200).json({ success: true, listing });
  } catch (error) {
    next(error);
  }
};

export const getListings = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 9;
    const startIndex = parseInt(req.query.startIndex) || 0;
    let offer = req.query.offer;

    if (offer == undefined || offer == 'false') {
      offer = { $in: [false, true] };
    }
    let furnished = req.query.furnished;

    if (furnished == undefined || furnished == 'false') {
      furnished = { $in: [false, true] };
    }
    let parking = req.query.parking;

    if (parking == undefined || parking == 'false') {
      parking = { $in: [false, true] };
    }

    let type = req.query.type;
    if (type == undefined || type == 'all') {
      type = { $in: ['sale', 'rent'] };
    }

    const searchTerm = req.query.searchTerm || '';

    const sort = req.query.sort || 'createdAt';

    const order = req.query.order || 'desc';

    const listings = await Listing.find({
      name: { $regex: searchTerm, $options: 'i' },
      offer,
      furnished,
      parking,
      type,
    })
      .sort({ [sort]: order })
      .limit(limit)
      .skip(startIndex);

    return res.status(200).json(listings);
  } catch (error) {
    next(error);
  }
};
