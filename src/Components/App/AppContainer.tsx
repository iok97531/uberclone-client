import { IS_LOGGED_IN } from './AppQueries';
import React from 'react';
import { graphql } from 'react-apollo';

const AppContainer = ({ data }) => <div>(JSON.stringify(data))</div>;

export default graphql(IS_LOGGED_IN)(AppContainer);
