import Header from '../../Components/Header';
import Ride from '../../Components/Ride';
import styled from '../../typed-components';
import { getRideHistory } from '../../types/api';
import React from 'react';
import Helmet from 'react-helmet';

const Container = styled.div`
  padding: 0 40px;
`;

interface IProps {
  data?: getRideHistory;
  loading: boolean;
}

const RideHistoryPresenter: React.SFC<IProps> = ({
  data: { GetRideHistory: { rides = null } = {} } = {},
  loading
}) => (
  <React.Fragment>
    <Helmet>
      <title>Trips | UberClone</title>
    </Helmet>
    <Header title={"Trips"} backTo={"/"} />
    <Container>
      {!loading && rides && rides.length === 0 && "You have no history\n"}
      {!loading &&
        rides &&
        rides.map(ride => (
          <Ride
            key={ride!.id}
            distance={ride!.distance}
            price={ride!.price}
            pickUpAddress={ride!.pickUpAddress}
            dropOffAddress={ride!.dropOffAddress}
            updatedAt={ride!.updatedAt!}
          />
        ))}
      <br />
      <br />
    </Container>
  </React.Fragment>
);

export default RideHistoryPresenter;
