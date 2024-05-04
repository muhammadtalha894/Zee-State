import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useRegisterUserMutation } from '../../redux/reducers/userReducer';
import { useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import OAuth from '../layout/OAuth';

const SignUp = ({ setauthenticated }) => {
  const [signUp, result] = useRegisterUserMutation();
  const navigate = useNavigate();

  if (result.isSuccess) {
    setauthenticated(true);
    navigate('/sign-in');
    toast.success('Account Created Successfully');
  }

  let [formData, setformData] = useState({});
  const handleOnChange = (e) => {
    let value = e.target.value;
    let id = e.target.id;
    setformData({
      ...formData,
      [id]: value,
    });
  };

  const handleOnSubmit = (e) => {
    e.preventDefault();
    signUp(formData);
  };
  return (
    <>
      <div className='p-3 max-w-lg  my-20 mx-auto'>
        <h1 className='text-3xl text-center font-semibold my-7'>Sign Up</h1>
        <form className='flex flex-col gap-4 ' onSubmit={handleOnSubmit}>
          <input
            type='text'
            required={true}
            placeholder='username'
            className='border p-3 rounded-lg outline-blue-600'
            id='username'
            onChange={handleOnChange}
          />
          <input
            required={true}
            type='email'
            placeholder='email'
            className='border p-3 rounded-lg outline-blue-600'
            id='email'
            onChange={handleOnChange}
          />
          <input
            required={true}
            type='password'
            placeholder='password'
            className='border p-3 rounded-lg outline-blue-600'
            id='password'
            onChange={handleOnChange}
          />
          <button
            disabled={result.isLoading}
            className='bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80'
          >
            {result.isLoading ? 'Loading....' : 'Sign up'}
          </button>
          <OAuth setauthenticated={setauthenticated} />
        </form>
        <div className='flex gap-2 mt-5'>
          <p>Have an account?</p>
          <Link to={'/sign-in'}>
            <span className='text-blue-700 '>Sign in</span>
          </Link>
        </div>
        <div className='text-red-600 text-center'>
          {result.isError ? result.error.data.message : null}
        </div>
        <Toaster />
      </div>
    </>
  );
};

export default SignUp;
