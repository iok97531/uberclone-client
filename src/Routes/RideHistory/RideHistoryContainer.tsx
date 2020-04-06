import RideHistoryPresenter from './RideHistoryPresenter';
import { GET_RIDE_HISTORY } from './RideHistoryQueries';
import React from 'react';
import { Query } from 'react-apollo';
import { getRideHistory } from 'src/types/api';

class RideHistoryQuery extends Query<getRideHistory> {}

class RideHistoryContainer extends React.Component {
  public render() {
    return (
      <RideHistoryQuery query={GET_RIDE_HISTORY}>
        {({ data, loading }) => (
          <RideHistoryPresenter data={data} loading={loading} />
        )}
      </RideHistoryQuery>
    );
  }
}
export default RideHistoryContainer;
