import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/home/Home';
import Profile from './components/profile/Profile';
import SignIn from './components/signIn/SignIn';
import SignUp from './components/signUp/SignUp';
import About from './components/about/About';
import Header from './components/layout/Header';
import PrivateRoute from './components/layout/PrivateRoute';
import { useLazyGetMyProfileQuery } from './redux/reducers/userReducer';
import { useEffect, useState } from 'react';
import CreateListing from './components/listing/CreateListing';
import UpdateListing from './components/listing/UpdateListing';
import Listing from './components/listing/Listing';
import Search from './components/search/Search';

const App = () => {
  const [userProfile, userProfileResult] = useLazyGetMyProfileQuery();
  const [authenticated, setauthenticated] = useState(false);

  useEffect(() => {
    userProfile();
    if (userProfileResult.data && userProfileResult.data.rest) {
      console.log(userProfileResult.data);
      setauthenticated(true);
    }
  }, [userProfileResult.data]);

  return (
    <>
      <Router>
        <Header authenticated={authenticated} />
        <Routes>
          <Route path='/' element={<Home />}></Route>
          <Route
            path='/sign-in'
            element={<SignIn setauthenticated={setauthenticated} />}
          ></Route>
          <Route
            path='/sign-up'
            element={<SignUp setauthenticated={setauthenticated} />}
          ></Route>
          <Route path='/about' element={<About />}></Route>
          <Route path='/search' element={<Search />}></Route>
          <Route path='/listing/:id' element={<Listing />}></Route>
          <Route element={<PrivateRoute />}>
            <Route
              path='/profile'
              element={<Profile setauthenticated={setauthenticated} />}
            ></Route>
            <Route
              path='/create-listing'
              element={<CreateListing setauthenticated={setauthenticated} />}
            ></Route>

            <Route
              path='/update-listing/:id'
              element={<UpdateListing setauthenticated={setauthenticated} />}
            ></Route>
          </Route>
        </Routes>
      </Router>
    </>
  );
};

export default App;
