import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLazyGetListingQuery } from '../../redux/reducers/listingReducer';
import ListingItem from '../layout/ListingItem';

const Search = () => {
  const [listing, setlisting] = useState(null);
  const [sideBarData, setSideBarData] = useState({
    searchTerm: '',
    type: 'all',
    offer: false,
    sort: 'createdAt',
    order: 'desc',
    furnished: false,
    parking: false,
  });
  const navigate = useNavigate();
  const handleChange = (e) => {
    if (
      e.target.id === 'all' ||
      e.target.id === 'rent' ||
      e.target.id === 'sale'
    ) {
      setSideBarData({ ...sideBarData, type: e.target.id });
    }
    if (
      e.target.id === 'furnished' ||
      e.target.id === 'parking' ||
      e.target.id === 'offer'
    ) {
      setSideBarData({
        ...sideBarData,
        [e.target.id]:
          e.target.checked || e.target.checked === 'true' ? true : false,
      });
    }
    if (e.target.id === 'searchTerm') {
      setSideBarData({ ...sideBarData, searchTerm: e.target.value });
    }

    if (e.target.id === 'sort_order') {
      const sort = e.target.value.split('_')[0] || 'createdAt';
      const order = e.target.value.split('_')[1] || 'desc';
      setSideBarData({ ...sideBarData, order, sort });
    }
  };

  const [getQuery, resultQuery] = useLazyGetListingQuery();

  const handleOnSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams();
    urlParams.set('searchTerm', sideBarData.searchTerm);
    urlParams.set('type', sideBarData.type);
    urlParams.set('parking', sideBarData.parking);
    urlParams.set('furnished', sideBarData.furnished);
    urlParams.set('offer', sideBarData.offer);
    urlParams.set('order', sideBarData.order);
    urlParams.set('sort', sideBarData.sort);

    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  };
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get('searchTerm');
    const typeFromUrl = urlParams.get('type');
    const parkingFromUrl = urlParams.get('parking');
    const furnishedFromUrl = urlParams.get('furnished');
    const offerFromUrl = urlParams.get('offer');
    const sortFromUrl = urlParams.get('sort');
    const orderFromUrl = urlParams.get('order');

    if (
      searchTermFromUrl ||
      typeFromUrl ||
      parkingFromUrl ||
      furnishedFromUrl ||
      offerFromUrl ||
      sortFromUrl ||
      orderFromUrl
    ) {
      setSideBarData({
        searchTerm: searchTermFromUrl || '',
        type: typeFromUrl || 'all',
        parking: parkingFromUrl === 'true' ? true : false,
        furnished: furnishedFromUrl === 'true' ? true : false,
        offer: offerFromUrl === 'true' ? true : false,
        sort: sortFromUrl || 'createdAt',
        order: orderFromUrl || 'desc',
      });
    }

    const searchQuery = urlParams.toString();

    getQuery(searchQuery);
  }, [location.search]);

  useEffect(() => {
    if (resultQuery.isSuccess) {
      console.log('hello');
      if (resultQuery.data.length < 8) {
        setShowMore(false);
        setlisting(resultQuery.data);
      } else {
        setShowMore(true);
        setlisting(resultQuery.data);
      }
    }
    if (resultQuery.isError) {
      console.log(resultQuery.error.message);
    }
  }, [resultQuery.isFetching, resultQuery.isSuccess]);

  const [showMore, setShowMore] = useState(true);

  const onShowMoreClick = async () => {
    const numberOfListing = listing && listing.length;
    console.log(numberOfListing);
    const startIndex = numberOfListing;
    const urlParams = new URLSearchParams(location.search);
    urlParams.set('startIndex', startIndex);

    const searchQuery = urlParams.toString();

    const res = await fetch(
      `http://localhost:9000/api/v1/listing/get?${searchQuery}`,
    );
    const data = await res.json();

    if (data.length < 9) {
      setShowMore(false);
    }
    console.log(listing.length, data.length);
    setlisting([...listing, ...data]);
  };

  console.log(listing);

  return (
    <>
      <div className='flex flex-col sm:flex-row mt-16'>
        <div className='border   w-full sm:w-1/4'>
          <form className='flex flex-col m-6 gap-5  ' onSubmit={handleOnSubmit}>
            <div className='flex gap-2 items-center'>
              <label className='text-nowrap font-semibold'>Search Term:</label>
              <input
                className='p-2 m-2 rounded-lg outline-blue-500'
                type='text'
                id='searchTerm'
                placeholder='Search'
                value={sideBarData.searchTerm}
                onChange={handleChange}
              />
            </div>
            <div className='flex flex-col gap-5 '>
              <div className='flex gap-2 flex-wrap'>
                <span className='font-semibold'>Type:</span>
                <div className='flex gap-1 items-center'>
                  <input
                    type='checkbox'
                    checked={sideBarData.type === 'all'}
                    id='all'
                    className='w-4 h-4'
                    onChange={handleChange}
                  />
                  <span>Rent & Sell </span>
                </div>
                <div className='flex gap-1 items-center'>
                  <input
                    type='checkbox'
                    className='w-4 h-4'
                    checked={sideBarData.type === 'rent'}
                    id='rent'
                    onChange={handleChange}
                  />
                  <span>Rent </span>
                </div>
                <div className='flex gap-1 items-center'>
                  <input
                    type='checkbox'
                    className='w-4 h-4'
                    id='sale'
                    checked={sideBarData.type === 'sale'}
                    onChange={handleChange}
                  />
                  <span>Sale </span>
                </div>
                <div className='flex gap-1 items-center'>
                  <input
                    type='checkbox'
                    checked={sideBarData.offer}
                    id='offer'
                    className='w-4 h-4'
                    onChange={handleChange}
                  />
                  <span>Offer </span>
                </div>
              </div>
              <div className='flex gap-2 items-center'>
                <span className='font-semibold'>Amenities:</span>
                <div className='flex gap-1 items-center'>
                  <input
                    type='checkbox'
                    id='parking'
                    className='w-4 h-4'
                    onChange={handleChange}
                    checked={sideBarData.parking}
                  />
                  <span>Parking </span>
                </div>
                <div className='flex gap-1 items-center'>
                  <input
                    type='checkbox'
                    id='furnished'
                    className='w-4 h-4'
                    checked={sideBarData.furnished}
                    onChange={handleChange}
                  />
                  <span>Furnished </span>
                </div>
              </div>

              <div>
                <span className='font-semibold'>Sort:</span>
                <select
                  id='sort_order'
                  defaultValue={'createdAt_desc'}
                  className='p-2 m-2 rounded-lg'
                  onChange={handleChange}
                >
                  <option value='regularPrice_desc'>Price high to Low</option>
                  <option value='regularPrice_asc'>Price low to high</option>
                  <option value='createdAt_desc'>Latest</option>
                  <option value='createdAt_asc'>Oldest</option>
                </select>
              </div>
            </div>
            <button className='bg bg-slate-700 p-3 text-white uppercase rounded-lg hover:opacity-95'>
              Search
            </button>
          </form>
        </div>
        <div className='right'>
          <h1 className='font-bold m-6 text-3xl text-slate-600'>
            Listing Results:
          </h1>

          <div className='p-7 flex flex-col gap-4'>
            {!resultQuery.isLoading && listing && listing.length === 0 && (
              <p className='text-xl text-slate-500 '>No Listing Found!</p>
            )}
            {resultQuery.isLoading && (
              <p className='text-lg text-slate-500 text-center w-full '>
                Loading...
              </p>
            )}
            <div className='flex flex-col sm:flex-row gap-4 flex-wrap items-center'>
              {resultQuery.isSuccess &&
                !resultQuery.isLoading &&
                listing &&
                listing.length > 0 &&
                listing.map((listing) => (
                  <ListingItem key={listing._id} listing={listing} />
                ))}
            </div>
          </div>
          {showMore && (
            <button
              onClick={onShowMoreClick}
              className='text-green-700 hover:underline p-7'
            >
              Show More
            </button>
          )}
        </div>
      </div>
    </>
  );
};

export default Search;
