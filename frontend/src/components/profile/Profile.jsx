import { useEffect, useRef, useState } from 'react';
import { useGetMyProfileQuery } from '../../redux/reducers/userReducer';
import { Link } from 'react-router-dom';
import {
  useUpdateUserMutation,
  useDeleteUserMutation,
  useLazySignoutUserQuery,
} from '../../redux/reducers/usersReducer';
import { useLazyUserListingQuery } from '../../redux/reducers/listingReducer';
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from 'firebase/storage';
import { useNavigate } from 'react-router-dom';
import { app } from '../../firebase';
import { useDeleteListingMutation } from '../../redux/reducers/listingReducer';

const Profile = ({ setauthenticated }) => {
  const navigate = useNavigate();
  const [updateUser, result] = useUpdateUserMutation();
  const [deleteUser, deleteResult] = useDeleteUserMutation();
  const [signOutUser, signOutResult] = useLazySignoutUserQuery();
  const [userListing, userlistingResult] = useLazyUserListingQuery();
  const [deleteListing, deleteListingResult] = useDeleteListingMutation();

  const [file, setfile] = useState(undefined);
  const [filePerc, setfilePerc] = useState(0);
  const [fileUploadError, setfileUploadError] = useState(false);
  const [formData, setformData] = useState({});
  const [userListingState, setuserListingState] = useState([]);
  const { data, isLoading, isError } = useGetMyProfileQuery();
  const fileRef = useRef(null);

  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
    if (deleteResult.isSuccess) {
      navigate('/sign-in');
    }
    if (userlistingResult.isSuccess) {
      setuserListingState(userlistingResult.data.listing);
    }
    if (signOutResult.isSuccess) {
      navigate('/sign-in');
    }
    if (deleteListingResult.isError) {
      console.log(deleteListingResult.error);
    }
  }, [file, deleteResult, signOutResult, userlistingResult]);

  const handleFileUpload = (file) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);
    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setfilePerc(Math.round(progress));
      },
      (error) => {
        setfileUploadError(true);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setformData({ ...formData, photo: downloadURL });
        });
      },
    );
  };

  const handleUserDelete = () => {
    const id = data.rest._id;
    deleteUser(id);
    setauthenticated(false);
    localStorage.removeItem('user');
  };

  const handleSignOut = () => {
    signOutUser();
    localStorage.clear();
    setauthenticated(false);
  };

  const handleOnChange = (e) => {
    let id = e.target.id;
    let value = e.target.value;

    setformData({ ...formData, [id]: value });
  };

  const handleOnSubmit = (e) => {
    e.preventDefault();
    const id = data.rest._id;
    console.log(id);
    updateUser({ id, formData });
  };

  const handleShowListing = (id) => {
    userListing(id);
  };
  const handleDeleteListing = (listing) => {
    deleteListing(listing._id);
    setuserListingState((prev) =>
      prev.filter((Listing) => Listing._id !== listing._id),
    );
  };
  const handleUpdateListing = (listing) => {
    navigate(`/update-listing/${listing._id}`);
  };

  return (
    <>
      {isLoading ? (
        <h1>...Loading</h1>
      ) : (
        <>
          {' '}
          <div className='p-3 max-w-lg mx-auto'>
            <h1 className='font-semibold text-3xl text-center my-7'>Profile</h1>
            <form className='flex flex-col gap-4' onSubmit={handleOnSubmit}>
              <input
                type='file'
                ref={fileRef}
                hidden
                accept='image/*'
                onChange={(e) => setfile(e.target.files[0])}
              />
              <img
                className='h-24 w-24 rounded-full object-cover self-center mt-3 cursor-pointer'
                src={formData.photo || (data && data.rest.photo)}
                alt='Profile'
                onClick={() => fileRef.current.click()}
              />
              <p>
                {fileUploadError ? (
                  <span className='text-red-600'>Image uploading Error</span>
                ) : filePerc > 0 && filePerc < 100 ? (
                  <span className='text-slate-600'>{`Uploading... ${filePerc}% `}</span>
                ) : filePerc === 100 ? (
                  <span className='text-green-600'>
                    Image successfully uploaded!
                  </span>
                ) : null}
              </p>
              <input
                type='text'
                placeholder='username'
                defaultValue={data.rest.username}
                id='username'
                className='border p-3 rounded-lg outline-blue-600 '
                onChange={handleOnChange}
              />
              <input
                type='email'
                defaultValue={data.rest.email}
                id='email'
                placeholder='email'
                className='border p-3 rounded-lg outline-blue-600'
                onChange={handleOnChange}
              />
              <input
                type='password'
                id='password'
                placeholder='password'
                className='border p-3 rounded-lg outline-blue-600'
                onChange={handleOnChange}
              />
              <button
                disabled={result.isLoading}
                className='bg-slate-700 p-3 rounded-lg text-white uppercase hover:opacity-95 disabled:opacity-80'
              >
                {result.isLoading ? 'Loading...' : 'Update'}
              </button>
              <Link
                className='bg-green-700 p-3 text-center rounded-lg text-white uppercase hover:opacity-95 disabled:opacity-80'
                to={'/create-listing'}
              >
                Create listing
              </Link>
            </form>
            <div className='flex justify-between mt-5'>
              <span
                className='text-red-700 cursor-pointer hover:opacity-80'
                onClick={handleUserDelete}
              >
                Delete Account
              </span>
              <span
                className='text-red-700 cursor-pointer hover:opacity-80'
                onClick={handleSignOut}
              >
                Sign Out
              </span>
            </div>
            <p className='text-red-600 mt-5'>
              {result.isError ? result.error.data.message : null}
            </p>
            <p className='text-green-600 mt-5'>
              {result.isSuccess ? 'User Updated Successfully' : null}
            </p>
            <button
              className='text-green-700 w-full hover:opacity-80'
              onClick={() => handleShowListing(data.rest._id)}
            >
              Show Listings
            </button>

            <h1 className='text-center font-semibold text-3xl my-7'>
              {userListingState &&
                userListingState.length > 0 &&
                'Your Listing'}
            </h1>
            <p className='text-red-700 text-center'>
              {userlistingResult.isError ? 'Error Showing' : ''}
            </p>
            <p className='text-green-700 text-center'>
              {deleteListingResult.isSuccess
                ? deleteListingResult.data.message
                : ''}
            </p>

            {userListingState &&
              userListingState.length > 0 &&
              userListingState.map((listing) => (
                <div
                  className='flex justify-between items-center bg-slate-100 border  p-3 rounded-md my-3 hover:shadow-sm'
                  key={listing._id}
                >
                  <Link
                    to={`/listing/${listing._id}`}
                    className='flex gap-3 items-center'
                  >
                    <img
                      className='w-16 h-16  rounded-3xl object-contain '
                      src={listing.imageUrls[0]}
                      alt='listing'
                    />
                    <Link
                      to={`/listing/${listing._id}`}
                      className='hover:border-b-2 border-gray-700 font-semibold'
                    >
                      {listing.name}
                    </Link>
                  </Link>
                  <div className='flex flex-col gap-2'>
                    <button
                      onClick={() => handleDeleteListing(listing)}
                      className='text-red-700 uppercase hover:opacity-80'
                    >
                      Delete
                    </button>
                    <button
                      className='text-green-700 uppercase hover:opacity-80'
                      onClick={() => handleUpdateListing(listing)}
                    >
                      edit
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </>
      )}
    </>
  );
};

export default Profile;
