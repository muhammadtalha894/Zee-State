import { Link } from 'react-router-dom';
import { MdLocationOn } from 'react-icons/md';
const ListingItem = ({ listing }) => {
  return (
    <>
      <div className='bg-white shadow-md hover:shadow-lg h-full overflow-hidden transition-shadow rounded-lg w-full sm:w-[300px] sm:h-[420px] '>
        {' '}
        <Link to={`/listing/${listing._id}`}>
          <img
            src={listing.imageUrls[0]}
            alt='listing cover'
            className='h-[320px]  sm:h-[220px] w-full object-cover hover:scale-105 transition-scale duration-300 hover:opacity-95'
          />
          <div className='p-3 flex flex-col gap-2 w-full'>
            <p className='text-xl font-semibold text-slate-700 truncate'>
              {listing.name}
            </p>
            <div className='flex items-center gap-1 '>
              <MdLocationOn className='text-green-700 w-4 h-4' />
              <p className='text-gray-600 truncate text-sm w-full'>
                {listing.address}
              </p>
            </div>
            <p className='text-sm  line-clamp-2 text-gray-600'>
              {listing.description}
            </p>
            <p className='text-slate-500 mt-2 font-semibold'>
              Rs.
              {listing.offer
                ? listing.discountPrice.toLocaleString('en-US')
                : listing.regularPrice.toLocaleString('en-US')}
              {listing.type === 'rent' && ' /month'}
            </p>
            <div className='flex  gap-3'>
              <div className='flex gap-1'>
                <p className='font-semibold text-xs'>
                  {listing.bedRooms === '1'
                    ? `${listing.bedRooms} Bed`
                    : `${listing.bedRooms} Beds`}
                </p>
              </div>
              <div className='flex gap-1'>
                <p className='font-semibold text-xs'>
                  {listing.bathRooms === '1'
                    ? `${listing.bathRooms} Bath`
                    : `${listing.bathRooms} Baths`}
                </p>
              </div>
            </div>
          </div>
        </Link>
      </div>
    </>
  );
};

export default ListingItem;
