import AddPlace from '../../Routes/AddPlace';
import Chat from '../../Routes/Chat';
import EditAccount from '../../Routes/EditAccount';
import FindAddress from '../../Routes/FindAddress';
import Home from '../../Routes/Home';
import Login from '../../Routes/Login';
import PhoneLogin from '../../Routes/PhoneLogin';
import Places from '../../Routes/Places';
import RideDetail from '../../Routes/RideDetail';
import RideHistory from '../../Routes/RideHistory';
import Settings from '../../Routes/Settings';
import SocialLogin from '../../Routes/SocialLogin';
import VerifyPhone from '../../Routes/VerifyPhone';
import PropTypes from 'prop-types';
import React from 'react';
import {
  BrowserRouter,
  Redirect,
  Route,
  Switch
  } from 'react-router-dom';

interface IProps {
  isLoggedIn: boolean;
}

const AppPresenter: React.SFC<IProps> = ({ isLoggedIn }) => (
  <BrowserRouter>
    {isLoggedIn ? <LoggedInRoutes /> : <LoggedOutRoutes />}
  </BrowserRouter>
);

const LoggedOutRoutes: React.SFC = () => (
  <Switch>
    <Route path={"/"} exact={true} component={Login} />
    <Route path={"/phone-login"} component={PhoneLogin} />
    <Route path={"/verify-phone/"} component={VerifyPhone} />
    <Route path={"/social-login"} component={SocialLogin} />
    <Redirect from={"*"} to={"/"} />
  </Switch>
);

const LoggedInRoutes: React.SFC = () => (
  <Switch>
    <Route path={"/"} exact={true} component={Home} />
    <Route path={"/ride/:rideId"} exact={true} component={RideDetail} />
    <Route path={"/trips"} exact={true} component={RideHistory} />
    <Route path={"/chat/:chatId"} exaxt={true} component={Chat} />
    <Route path={"/edit-account"} exact={true} component={EditAccount} />
    <Route path={"/settings"} exact={true} component={Settings} />
    <Route path={"/places"} exact={true} component={Places} />
    <Route path={"/add-place"} exact={true} component={AddPlace} />
    <Route path={"/find-address"} exact={true} component={FindAddress} />
    <Redirect from={"*"} to={"/"} />
  </Switch>
);

AppPresenter.propTypes = {
  isLoggedIn: PropTypes.bool.isRequired
};

export default AppPresenter;
