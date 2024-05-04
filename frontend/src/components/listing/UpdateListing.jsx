import { useEffect, useState } from 'react';

import {
  useDetailsListingQuery,
  useUpdateListingMutation,
} from '../../redux/reducers/listingReducer';
import { useNavigate, useParams } from 'react-router-dom';

import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
  uploadString,
} from 'firebase/storage';
import { app } from '../../firebase';

const UpdateListing = () => {
  const { id } = useParams();
  console.log(id);

  const navigate = useNavigate();
  const [updateListing, updateListingResult] = useUpdateListingMutation();

  const { data, isLoading, isError, isSuccess } = useDetailsListingQuery(id, {
    refetchOnMount: true,
  });
  const [files, setfiles] = useState([]);
  const [imageUploadError, setimageUploadError] = useState(false);
  const [uploadPerc, setuploadPerc] = useState(false);
  const [formData, setformData] = useState({
    imageUrls: [],
    name: '',
    description: '',
    address: '',
    type: 'rent',
    bedRooms: 1,
    bathRooms: 1,
    regularPrice: 50,
    discountPrice: 30,
    offer: false,
    parking: false,
    furnished: false,
  });
  useEffect(() => {
    return () => {
      if (updateListingResult.isSuccess) {
        console.log(updateListingResult);
      }
    };
  }, []);

  useEffect(() => {
    if (data) {
      setformData(data.listing);
    }
    if (updateListingResult.isSuccess) {
      console.log(updateListingResult.data);
    }

    if (updateListingResult.isError) {
      setimageUploadError(updateListingResult.error.data.message);
    }
    if (updateListingResult.isSuccess) {
      navigate(`/listing/${updateListingResult.data.updatedListing._id}`);
    }
  }, [updateListingResult, data]);

  const handleOnChange = (e) => {
    if (e.target.id == 'sale' || e.target.id === 'rent') {
      setformData({ ...formData, type: e.target.id });
    }
    if (
      e.target.id == 'furnished' ||
      e.target.id === 'parking' ||
      e.target.id === 'offer'
    ) {
      setformData({ ...formData, [e.target.id]: e.target.checked });
    }
    if (e.target.type == 'number') {
      setformData({ ...formData, [e.target.id]: Number(e.target.value) });
    }
    if (e.target.type === 'text' || e.target.type === 'textarea') {
      setformData({ ...formData, [e.target.id]: e.target.value });
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files;
    setfiles(file);
  };

  const handleDeleteImage = (index) => {
    setformData({
      ...formData,
      imageUrls: formData.imageUrls.filter((_, i) => i !== index),
    });
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (formData.discountPrice >= formData.regularPrice)
      return setimageUploadError(
        'Your regular price should be greater than discount price!',
      );
    if (formData.imageUrls.length <= 0)
      return setimageUploadError('You should upload atleast one image!');
    updateListing({ id, formData }).then(() => {
      // Invalidate cache for the listing query after successful update
      listingApi.invalidateQueries(['userListing', id]);
    });
  };
  // Image Uploading On FireBase

  const handleImageSubmit = () => {
    if (files.length > 0 && files.length + formData.imageUrls.length < 7) {
      setuploadPerc(true);
      setimageUploadError(false);
      let promises = [];
      for (let i = 0; i < files.length; i++) {
        promises.push(storeImages(files[i]));
      }
      Promise.all(promises)
        .then((url) => {
          setformData({
            ...formData,
            imageUrls: formData.imageUrls.concat(url),
          });
          setimageUploadError(false);
          setuploadPerc(false);
        })
        .catch((error) => {
          setimageUploadError('Image Upload Failed (3 MB max per image)!');
          setuploadPerc(false);
        });
    } else {
      setimageUploadError(
        `You have uploaded ${files.length} images you can only upload 6 images per listing!`,
      );
      setuploadPerc(false);
    }
  };
  // Image Uploading On FireBase

  const storeImages = async (file) => {
    return new Promise((resolve, reject) => {
      const storage = getStorage(app);
      const fileName = new Date().getTime() + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setuploadPerc(Math.round(progress));
        },
        (error) => {
          reject(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            resolve(downloadURL);
          });
        },
      );
    });
  };

  return (
    <>
      {isLoading ? (
        'Loading..'
      ) : (
        <main className='p-3 max-w-4xl mx-auto mt-10'>
          <h1 className='text-3xl font-semibold text-center my-7'>
            Update a Listing
          </h1>
          <form
            className='flex flex-col  sm:flex-row gap-5 '
            onSubmit={handleFormSubmit}
          >
            <div className='flex flex-col gap-4 flex-1'>
              <input
                type='text'
                placeholder='Name'
                className='border p-3 rounded-lg'
                id='name'
                maxLength='62'
                minLength='10'
                required
                onChange={handleOnChange}
                value={formData.name}
              />

              <input
                type='text'
                placeholder='Description'
                className='border p-3 rounded-lg'
                id='description'
                required
                onChange={handleOnChange}
                value={formData.description}
              />
              <input
                type='text'
                placeholder='Address'
                className='border p-3 rounded-lg'
                id='address'
                required
                onChange={handleOnChange}
                value={formData.address}
              />
              <div className='flex gap-4 flex-wrap my-5'>
                <div className='flex gap-2'>
                  <input
                    type='checkbox'
                    id='sale'
                    className='w-5'
                    onChange={handleOnChange}
                    checked={formData.type === 'sale'}
                  />
                  <span>Sell</span>
                </div>
                <div className='flex gap-2'>
                  <input
                    type='checkbox'
                    id='rent'
                    className='w-5'
                    onChange={handleOnChange}
                    checked={formData.type === 'rent'}
                  />
                  <span>Rent</span>
                </div>
                <div className='flex gap-2'>
                  <input
                    type='checkbox'
                    id='parking'
                    className='w-5'
                    onChange={handleOnChange}
                    checked={formData.parking}
                  />
                  <span>Parking Spot</span>
                </div>
                <div className='flex gap-2'>
                  <input
                    type='checkbox'
                    id='furnished'
                    className='w-5'
                    onChange={handleOnChange}
                    checked={formData.furnished}
                  />
                  <span>Furnished</span>
                </div>
                <div className='flex gap-2'>
                  <input
                    type='checkbox'
                    id='offer'
                    className='w-5'
                    onChange={handleOnChange}
                    checked={formData.offer}
                  />
                  <span>Offer</span>
                </div>
              </div>
              <div className='flex gap-6 flex-wrap'>
                <div className='flex gap-2 items-center'>
                  <input
                    type='number'
                    id='bedRooms'
                    min='1'
                    max='10'
                    className='rounded-lg p-3 outline-blue-600 border border-gray-300'
                    onChange={handleOnChange}
                    value={formData.bedRooms}
                  />
                  <p> Beds</p>
                </div>
                <div className='flex gap-4 items-center'>
                  <input
                    type='number'
                    id='bathRooms'
                    min='1'
                    max='10'
                    className='rounded-lg p-3 outline-blue-600 border border-gray-300'
                    onChange={handleOnChange}
                    value={formData.bathRooms}
                  />
                  <p> baths</p>
                </div>

                <div className='flex gap-4 items-center'>
                  <input
                    type='number'
                    id='regularPrice'
                    className='rounded-lg p-3 outline-blue-600 border border-gray-3 w-28'
                    onChange={handleOnChange}
                    value={formData.regularPrice}
                  />
                  <div className='flex flex-col items-center'>
                    <p> Regular Price</p>
                    <span className='text-gray-600 text-xs'>
                      {' '}
                      {formData.type === 'rent' && '(Rs / month)'}
                    </span>
                  </div>
                </div>
                {formData.offer && (
                  <div className='flex gap-4 items-center mb-6'>
                    <input
                      type='number'
                      id='discountPrice'
                      className='rounded-lg p-3 w-100  outline-blue-600 border border-gray-300 w-28'
                      onChange={handleOnChange}
                      value={formData.discountPrice}
                    />
                    <div className='flex flex-col items-center'>
                      <p> Discount Price</p>
                      <span className='text-gray-600 text-xs'>
                        {formData.type === 'rent' && '(Rs / month)'}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className='flex flex-col flex-1 gap-4 '>
              <p className='font-semibold'>
                Images:
                <span className='font-normal text-gray-700 ml-2'>
                  The first image will be the cover (max 6)
                </span>
              </p>
              <div className='flex gap-4'>
                <input
                  type='file'
                  id='images'
                  accept='images/* '
                  onChange={handleFileChange}
                  multiple
                  className='p-3  border border-gray-300 rounded w-full'
                />
                <button
                  type='button'
                  disabled={uploadPerc}
                  onClick={handleImageSubmit}
                  className='bg-transparent border uppercase border-green-700 p-3 rounded hover:shadow-lg disabled:opacity-80'
                >
                  {uploadPerc ? 'Uploading...' : 'Upload'}
                </button>
              </div>
              <button
                className='bg-slate-700 uppercase p-3 rounded-lg text-white disabled:opacity-70 hover:opacity-95 sm:'
                disabled={uploadPerc}
              >
                Update Listing
              </button>
              <p className='text-red-700'>
                {imageUploadError && imageUploadError}
              </p>
              {formData.imageUrls.length > 0 &&
                formData.imageUrls.map((Urls, index) => (
                  <div className='flex justify-between gap-4'>
                    <img
                      src={Urls}
                      alt='image'
                      className='w-20 h-20 object-contain rounded-lg'
                    />
                    <button
                      type='button'
                      onClick={() => handleDeleteImage(index)}
                      className='text-red-700 p-3 uppercase hover:opacity-75 rounded-lg'
                    >
                      {' '}
                      Delete
                    </button>
                  </div>
                ))}
            </div>
          </form>
        </main>
      )}
    </>
  );
};

export default UpdateListing;
