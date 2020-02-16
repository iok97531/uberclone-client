import { gql } from 'apollo-boost';

export const LOG_USER_IN = gql`
  mutation logUserIn($token: String!) {
    logUserIn(token: $token) @Client
  }
`;

export const LOG_USER_OUT = gql`
  mutation logUserOut {
    logUserOut @client
  }
`;
