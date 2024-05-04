import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useSignInUserMutation } from '../../redux/reducers/userReducer';
import { useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import OAuth from '../layout/OAuth';
const SignIn = ({ setauthenticated }) => {
  let [formData, setformData] = useState({});
  const [signIn, result] = useSignInUserMutation();
  const navigate = useNavigate();

  useEffect(() => {
    if (result.isSuccess) {
      toast.success('Login Successfully');
      setauthenticated(true);
      navigate('/');
    }
  }, [result.isSuccess]);

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
    signIn(formData);
  };
  return (
    <>
      <div className='p-3 max-w-lg mx-auto my-20'>
        <h1 className='text-3xl text-center font-semibold my-7 '>Sign In</h1>
        <form className='flex flex-col gap-4 ' onSubmit={handleOnSubmit}>
          <input
            type='email'
            placeholder='email'
            className='border p-3 rounded-lg outline-blue-600'
            id='email'
            required
            onChange={handleOnChange}
          />
          <input
            type='password'
            placeholder='password'
            className='border p-3 rounded-lg  outline-blue-600'
            id='password'
            required
            onChange={handleOnChange}
          />
          <button
            className='bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80'
            disabled={result.isLoading}
          >
            {result.isLoading ? 'Loading....' : 'Sign in'}
          </button>{' '}
          <OAuth setauthenticated={setauthenticated} />
        </form>
        <div className='flex gap-2 mt-5'>
          <p>Dont Have an account?</p>
          <Link to={'/sign-up'}>
            <span className='text-blue-700 '>Sign up</span>
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

export default SignIn;
