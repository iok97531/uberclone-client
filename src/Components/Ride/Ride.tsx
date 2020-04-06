import styled from '../../typed-components';
import React from 'react';

const Ride = styled.div`
  margin: 15px 0;
  display: flex;
  align-items: center;
  & i {
    font-size: 12px;
  }
`;

const Data = styled.span`
  display: block;
  color: ${props => props.theme.greyColor};
  font-size: 14px;
  margin-bottom: 5px;
`;

const Container = styled.div`
  margin-left: 10px;
`;

interface IProps {
  distance: string;
  price: number;
  pickUpAddress: string;
  dropOffAddress: string;
  updatedAt: string;
}

const RidePresenter: React.SFC<IProps> = ({
  distance,
  price,
  pickUpAddress,
  dropOffAddress
}) => (
  <Ride>
    <div>{"✩"}</div>
    <Container>
      <Data>{pickUpAddress}</Data>
      <Data>{dropOffAddress}</Data>
      <Data>{"$" + price}</Data>
      <Data>{distance}</Data>
    </Container>
  </Ride>
);

export default RidePresenter;
