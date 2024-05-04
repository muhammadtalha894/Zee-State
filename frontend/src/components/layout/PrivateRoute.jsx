import { useGetMyProfileQuery } from '../../redux/reducers/userReducer';
import { Outlet, Navigate } from 'react-router-dom';
const PrivateRoute = () => {
  const { data, isLoading, isError } = useGetMyProfileQuery();
  return (
    <>
      {isLoading ? (
        <h1 className='text-center h-screen mt-auto font-bold '>...Loading</h1>
      ) : data ? (
        <Outlet />
      ) : (
        <Navigate to={'/sign-in'} />
      )}
    </>
  );
};

export default PrivateRoute;
