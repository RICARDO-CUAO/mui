import { Fragment } from 'react';
import Album from './components/album/Album';
import Blog from './components/blog/Blog';
import Checkout from './components/Checkout/Checkout';
import Dasboard from './components/dashboard/Dashboard';
import Pricing from './components/pricing/Pricing';
import SingIn from './components/sign-in/SignIn';
import SingInSide from './components/sign-in-side/SignInSide';
import SignUp from './components/sign-up/SignUp';


function App() {
  return (
    <Fragment>
      <SignUp></SignUp>      
    </Fragment>
  );
}

export default App;
