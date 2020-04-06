import { gql } from 'apollo-boost';

export const GET_RIDE_HISTORY = gql`
  query getRideHistory {
    GetRideHistory {
      ok
      error
      rides {
        id
        pickUpAddress
        dropOffAddress
        distance
        price
        updatedAt
      }
    }
  }
`;
