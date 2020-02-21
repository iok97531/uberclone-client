import HomeContainer from './HomeContainer';
import { MAPS_KEY } from '../../keys';
import { GoogleApiWrapper } from 'google-maps-react';
export default GoogleApiWrapper({
  apiKey: MAPS_KEY
})(HomeContainer);
