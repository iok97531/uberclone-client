import PlacesPresenter from './PlacesPresenter';
import { GET_PLACES } from '../../sharedQueries';
import { getPlaces } from '../../types/api';
import React from 'react';
import { Query } from 'react-apollo';

class PlacesQuery extends Query<getPlaces> {}

class PlacesContainer extends React.Component {
  public render() {
    return (
      <PlacesQuery query={GET_PLACES}>
        {({ data, loading }) => (
          <PlacesPresenter data={data} loading={loading} />
        )}
      </PlacesQuery>
    );
  }
}
export default PlacesContainer;
