import { useParams } from 'react-router-dom';
import { useLazyDetailsListingQuery } from '../../redux/reducers/listingReducer';
import { useGetMyProfileQuery } from '../../redux/reducers/userReducer';
import { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import toast, { Toaster } from 'react-hot-toast';
import { motion } from 'framer-motion';
import SwiperCore from 'swiper';
import {
  FaMapMarkerAlt,
  FaBed,
  FaBath,
  FaParking,
  FaChair,
  FaShare,
} from 'react-icons/fa';
import { Navigation } from 'swiper/modules';
import 'swiper/css/bundle';
import Contact from '../layout/Contact';

const Listing = () => {
  SwiperCore.use(Navigation);
  let getprofile = useGetMyProfileQuery();

  const [listing, setlisting] = useState();
  const [copied, setCopied] = useState(false);
  const [contact, setcontact] = useState(false);
  const { id } = useParams();

  const [queryDetails, resultqueryDetails] = useLazyDetailsListingQuery(id, {
    refetchOnMount: true,
  });

  useEffect(() => {
    queryDetails(id);
  }, [id]);

  const handleOnCopy = () => {
    const urlToCopy = window.location.href;

    navigator.clipboard
      .writeText(urlToCopy)
      .then(() => {
        // Set state to indicate the URL has been copied
        setCopied(true);
      })
      .catch((error) => {
        console.error('Error copying to clipboard: ', error);
      });
  };

  useEffect(() => {
    if (copied) {
      toast.success('url copied');
      setCopied(false);
    }
  }, [copied]);
  useEffect(() => {
    if (resultqueryDetails.isSuccess) {
      setlisting(resultqueryDetails.data.listing);
    }
  }, [resultqueryDetails.isSuccess]);

  return (
    <>
      <main>
        {resultqueryDetails.isLoading && (
          <p className='text-center my-7 text-2xl'>Loading...</p>
        )}
        {resultqueryDetails.isError && (
          <p className='text-center my-7 text-2xl text-red-700'>
            Some Thing Went Wrong!
          </p>
        )}
        {listing &&
          !resultqueryDetails.isLoading &&
          !resultqueryDetails.isError && (
            <>
              <Swiper navigation={true}>
                {listing.imageUrls.map((url) => (
                  <SwiperSlide key={url}>
                    <div
                      className=' h-[350px]  sm:h-[550px] '
                      style={{
                        background: `url(${url}) center no-repeat`,
                        backgroundSize: 'cover',
                      }}
                    >
                      <motion.div
                        initial={{ y: '-100', opacity: 0 }}
                        whileInView={{ y: 100, opacity: 1 }}
                        className='fixed top-[13%] right-[3%] z-10 border rounded-full w-12 h-12 flex justify-center items-center bg-slate-100 cursor-pointer'
                      >
                        <FaShare
                          onClick={handleOnCopy}
                          className='text-slate-500'
                        />
                      </motion.div>
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>

              <div className='p-6 my-7 w-full mx-auto sm:w-4/5 '>
                <p className='text-3xl font-semibold'>{`${listing.name} - Rs. ${
                  listing.offer && listing.discountPrice > 0
                    ? listing.discountPrice.toLocaleString('en-US')
                    : listing.regularPrice.toLocaleString('en-US')
                } ${listing.type == 'rent' ? '/month' : ''}`}</p>

                <p className='my-5 flex  gap-3 items-center text-gray-500 '>
                  <FaMapMarkerAlt
                    style={{ color: 'green', fontSize: '1.34rem' }}
                  />
                  {listing.address}
                </p>
                <div className='flex gap-4'>
                  <p className='bg-red-800 text-white py-1 px-2 w-full max-w-[200px] rounded-md text-lg text-center'>
                    {listing.type === 'rent' ? 'For Rent' : 'For Sale'}
                  </p>
                  {listing.offer && (
                    <p className='bg-green-800 text-white py-1 px-2 w-full max-w-[200px] rounded-md text-lg text-center'>
                      {listing.offer
                        ? `Rs.${(
                            +listing.regularPrice - +listing.discountPrice
                          ).toLocaleString('en-US')} discount`
                        : null}
                    </p>
                  )}
                </div>
                <div className=' flex'>
                  <p className='text-slate-700 my-8'>
                    <span className='font-semibold'>Description -</span>{' '}
                    {`${listing.description}`}
                  </p>
                </div>
                <div>
                  <ul className='flex gap-4 flex-wrap'>
                    <li className='flex gap-2 items-center text-green-700'>
                      <FaBed className='text-lg text-green-700' />
                      {listing.bedRooms > 1
                        ? `${listing.bedRooms} Beds`
                        : `${listing.bedRooms} Bed`}
                    </li>
                    <li className='flex gap-2 items-center text-green-700'>
                      <FaBath className='text-lg text-green-700' />
                      {listing.bathRooms > 1
                        ? `${listing.bathRooms} Baths`
                        : `${listing.bathRooms} Bath`}
                    </li>
                    <li className='flex gap-2 items-center text-green-700'>
                      <FaParking className='text-lg text-green-700' />
                      {listing.parking ? ` Parking` : `No parking`}
                    </li>
                    <li className='flex gap-2 items-center text-green-700'>
                      <FaChair className='text-lg text-green-700' />
                      {listing.furnished ? `Furnished` : `Not furnished`}
                    </li>
                  </ul>
                  {listing &&
                    getprofile.isSuccess &&
                    getprofile.data.rest &&
                    getprofile.data.rest._id !== listing.userRef &&
                    !contact && (
                      <button
                        className='p-3 bg-slate-700 uppercase my-6 rounded-lg w-full text-white hover:opacity-95'
                        onClick={() => setcontact(true)}
                      >
                        Contact landlord
                      </button>
                    )}
                  {contact && <Contact listing={listing} />}
                </div>
                <Toaster />
              </div>
            </>
          )}
      </main>
    </>
  );
};

export default Listing;
