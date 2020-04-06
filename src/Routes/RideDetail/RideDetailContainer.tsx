import RidePresenter from './RideDetailPresenter';
import { RIDE_SUBSCRIPTION, UPDATE_RIDE_STATUS } from './RideDetailQueries';
import { GET_RIDE, USER_PROFILE } from '../../sharedQueries';
import {
  getRide,
  getRideVariables,
  updateRide,
  updateRideVariables,
  userProfile
  } from '../../types/api';
import { SubscribeToMoreOptions } from 'apollo-client';
import React from 'react';
import { Mutation, Query } from 'react-apollo';
import { RouteComponentProps } from 'react-router-dom';

class RideQuery extends Query<getRide, getRideVariables> {}
class ProfileQuery extends Query<userProfile> {}
class RideUpdate extends Mutation<updateRide, updateRideVariables> {}

interface IProps extends RouteComponentProps<any> {}

class RideDetailContainer extends React.Component<IProps> {
  constructor(props: IProps) {
    super(props);
    if (!props.match.params.rideId) {
      props.history.push("/");
    }
  }
  public render() {
    const {
      match: {
        params: { rideId }
      }
    } = this.props;
    return (
      <ProfileQuery query={USER_PROFILE}>
        {({ data: userData }) => (
          <RideQuery query={GET_RIDE} variables={{ rideId: rideId * 1 }}>
            {({ data, loading, subscribeToMore }) => {
              return (
                <RideUpdate mutation={UPDATE_RIDE_STATUS}>
                  {updateRideFn => (
                    <RidePresenter
                      userData={userData}
                      loading={loading}
                      data={data}
                      updateRideFn={updateRideFn}
                      rideStatusSubscription={() => {
                        const subscribeOptions: SubscribeToMoreOptions = {
                          document: RIDE_SUBSCRIPTION,
                          updateQuery: (prev, { subscriptionData }) => {
                            if (!subscriptionData.data) {
                              return prev;
                            }
                            const {
                              data: {
                                RideStatusSubscription: { status }
                              }
                            } = subscriptionData;
                            if (status === "FINISHED") {
                              window.location.href = "/";
                            }
                          }
                        };

                        subscribeToMore(subscribeOptions);
                      }}
                    />
                  )}
                </RideUpdate>
              );
            }}
          </RideQuery>
        )}
      </ProfileQuery>
    );
  }
}
export default RideDetailContainer;
