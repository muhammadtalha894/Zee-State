import { GoogleAuthProvider, getAuth, signInWithPopup } from 'firebase/auth';
import { useSignInWithGoogleMutation } from '../../redux/reducers/userReducer';
import { app } from '../../firebase';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

const OAuth = ({ setauthenticated }) => {
  const [googleSignIn, result] = useSignInWithGoogleMutation();
  const navigate = useNavigate();
  useEffect(() => {
    if (result.isSuccess) {
      setauthenticated(true);
      localStorage.setItem('user', JSON.stringify(result.data));
      navigate('/');
    }
  }, [result]);

  const handleGoogleClick = async () => {
    try {
      const Provider = new GoogleAuthProvider();
      const auth = getAuth(app);

      const results = await signInWithPopup(auth, Provider);

      googleSignIn({
        name: results.user.displayName,
        email: results.user.email,
        photo: results.user.photoURL,
      });

      if (result.isSuccess) {
        console.log(result.data);
      }
    } catch (error) {
      console.log('could not sign in with google', error);
    }
  };
  return (
    <button
      onClick={handleGoogleClick}
      type='button'
      className='bg-red-700 text-white p-3 rounded-lg hover:opacity-95 uppercase'
    >
      Continue With Google
    </button>
  );
};

export default OAuth;
