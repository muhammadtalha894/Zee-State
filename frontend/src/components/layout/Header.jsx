import { FaSearch } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { useLazyGetMyProfileQuery } from '../../redux/reducers/userReducer';
import { useEffect, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
const Header = ({ authenticated }) => {
  const [userProfile, userProfileResult] = useLazyGetMyProfileQuery();
  const [searchTerm, setsearchTerm] = useState('');
  const [profile, setprofile] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    userProfile();
    if (userProfileResult.data && userProfileResult.data.rest) {
      setprofile(userProfileResult.data.rest.photo);
    }

    if (!authenticated) {
      userProfile();
      setprofile(null);
    }
  }, [userProfileResult.data, profile, authenticated]);

  useEffect(() => {
    if (authenticated) {
      toast.success('Successfully login');
    }
  }, [authenticated]);

  const handleOnSearch = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(window.location.search);
    urlParams.set('searchTerm', searchTerm);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  };
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFormUrl = urlParams.get('searchTerm');

    if (searchTermFormUrl) {
      setsearchTerm(searchTermFormUrl);
    }
  }, [location.search]);

  // console.log(profile);

  return (
    <>
      <header className='bg-slate-200 shadow-sm fixed top-0  z-10 left-0 right-0'>
        <div className='flex justify-between items-center max-w-6xl mx-auto p-3'>
          <Link to='/'>
            <h1 className='font-bold text-sm sm:text-xl flex flex-wrap'>
              <span className='text-slate-500'>Zee-</span>
              <span className='text-slate-700'>State</span>
            </h1>
          </Link>
          <form
            onSubmit={handleOnSearch}
            className='bg-slate-100 p-1.5 rounded-lg flex items-center sm:p-3 '
          >
            <input
              type='text'
              placeholder='Search...'
              value={searchTerm}
              className='bg-transparent outline-none w-24 sm:w-64'
              onChange={(e) => setsearchTerm(e.target.value)}
            />

            <button>
              <FaSearch className='text-slate-600' />
            </button>
          </form>
          <ul className='flex gap-4 sm:gap-6'>
            <Link to='/'>
              <li className='hidden  text-slate-900   sm:inline hover:text-black'>
                Home
              </li>
            </Link>
            <Link to='/about'>
              <li className=' text-slate-900   sm:inline hover:text-black'>
                About
              </li>
            </Link>
            <Link to={userProfileResult.data ? '/profile' : '/sign-in'}>
              {!userProfileResult.isLoading && !userProfileResult.isError ? (
                <img
                  className='w-8 h-8 rounded-full'
                  src={profile && profile}
                  alt='Profile'
                />
              ) : (
                <li className=' text-slate-900   sm:inline hover:text-black'>
                  Sign in
                </li>
              )}
            </Link>
          </ul>
        </div>
        <Toaster />
      </header>
    </>
  );
};

export default Header;
