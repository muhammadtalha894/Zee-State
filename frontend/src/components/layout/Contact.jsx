import { useEffect, useState } from 'react';
import { useGetMyProfileQuery } from '../../redux/reducers/userReducer';
import { Link } from 'react-router-dom';
const Contact = ({ listing }) => {
  const [landLord, setlandLord] = useState(null);
  const [message, setmessage] = useState('');
  const { data, isError, isSuccess, isLoading } = useGetMyProfileQuery(
    listing.userRef,
  );

  useEffect(() => {
    if (data) {
      setlandLord(data.rest);
    }
  }, [isSuccess]);

  return (
    <>
      {landLord && (
        <div className='flex flex-col gap-4 my-6'>
          <p className=''>
            Contact{' '}
            <span className='font-semibold mx-1'>{landLord.username}</span>
            for
            <span className='font-semibold mx-1'>
              {listing.name.toLowerCase()}
            </span>
          </p>
          <textarea
            name='message'
            id='message'
            className='w-full border p-3 rounded-lg'
            rows='2'
            value={message}
            placeholder='Enter your message here.... '
            onChange={(e) => setmessage(e.target.value)}
          ></textarea>
          <Link
            className='bg-slate-700 text-white uppercase w-full rounded-lg p-3 text-center hover:opacity-95'
            to={`mailto:${landLord.email}?subject=Regarding ${listing.name} &body= ${message}`}
          >
            Send Message
          </Link>
        </div>
      )}
    </>
  );
};

export default Contact;
