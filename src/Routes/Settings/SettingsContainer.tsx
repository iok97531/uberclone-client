import SettingsPresenter from './SettingsPresenter';
import { GET_PLACES, USER_PROFILE } from '../../sharedQueries';
import { LOG_USER_OUT } from '../../sharedQueries.local';
import { getPlaces, userProfile } from '../../types/api';
import React from 'react';
import { Mutation, Query } from 'react-apollo';

class MiniProfileQuery extends Query<userProfile> {}
class PlacesQuery extends Query<getPlaces> {}
class SettingsContainer extends React.Component {
  public render() {
    return (
      <Mutation mutation={LOG_USER_OUT}>
        {logUserOut => (
          <MiniProfileQuery query={USER_PROFILE}>
            {({ data: userData, loading: userDataLoading }) => (
              <PlacesQuery query={GET_PLACES}>
                {({ data: placesData, loading: placesLoadding }) => (
                  <SettingsPresenter
                    userDataLoading={userDataLoading}
                    userData={userData}
                    placesLoading={placesLoadding}
                    placesData={placesData}
                    logUserOut={logUserOut}
                  />
                )}
              </PlacesQuery>
            )}
          </MiniProfileQuery>
        )}
      </Mutation>
    );
  }
}

export default SettingsContainer;
