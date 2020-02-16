import styled from '../../typed-components';
import React from 'react';
import { MutationFn } from 'react-apollo';
import { Link } from 'react-router-dom';
import { userProfile } from 'src/types/api';

const Container = styled.div`
  height: 100%;
`;

const Header = styled.div`
  background-color: black;
  height: 20%;
  margin-bottom: 30px;
  padding: 0 15px;
  color: white;
`;

const SLink = styled(Link)`
  font-size: 22px;
  display: block;
  margin-left: 15px;
  margin-bottom: 25px;
  font-weight: 400;
`;

const Image = styled.img`
  height: 80px;
  width: 80px;
  background-color: grey;
  border-radius: 40px;
  overflow: hidden;
`;

const Name = styled.h2`
  font-size: 22px;
  color: white;
  margin-bottom: 10px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const Rating = styled.h5`
  font-size: 18px;
  color: white;
`;

const Text = styled.span`
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr 2fr;
  grid-gap: 10px;
  height: 100%;
  align-items: center;
`;

interface IToggleProps {
  isDriving: boolean;
}

const ToggleDriving = styled<IToggleProps, any>("button")`
  -webkit-appearance: none;
  background-color: ${props =>
    props.isDriving ? props.theme.yellowColor : props.theme.greenColor};
  width: 100%;
  color: white;
  font-size: 18px;
  border: 0;
  padding: 15px 0px;
  cursor: pointer;
`;

interface IProps {
  data?: userProfile;
  loading: boolean;
  toggleDrivingFn: MutationFn;
}

const MenuPresenter: React.SFC<IProps> = ({
  data: { GetMyProfile: { user = {} } = {} } = {},
  loading,
  toggleDrivingFn
}) => (
  <Container>
    {!loading && user && user.fullName && (
      <React.Fragment>
        <Header>
          <Grid>
            <Link to={"/edit-account"}>
              <Image
                src={
                  user.profilePhoto ||
                  "https://www.google.com/imgres?imgurl=https%3A%2F%2Fpngimage.net%2Fwp-content%2Fuploads%2F2019%2F05%2Fpng-facebook-profile-picture-1.jpg&imgrefurl=https%3A%2F%2Fpngimage.net%2Fpng-facebook-profile-picture-1%2F&tbnid=WHnyHx7cNvWDTM&vet=12ahUKEwjtxffIqLXnAhWoG6YKHfhXAqMQMygCegUIARDQAQ..i&docid=ly_l1wYluB7NwM&w=820&h=770&itg=1&q=facebook%20no%20profile%20img&ved=2ahUKEwjtxffIqLXnAhWoG6YKHfhXAqMQMygCegUIARDQAQ"
                }
              />
            </Link>
            <Text>
              <Name>{user.fullName}</Name>
              <Rating>4.5</Rating>
            </Text>
          </Grid>
        </Header>
        <SLink to="/trips">Your Trips</SLink>
        <SLink to="/settings">Settings</SLink>
        <ToggleDriving onClick={toggleDrivingFn} isDriving={user.isDriving}>
          {user.isDriving ? "Stop driving" : "Start driving"}
        </ToggleDriving>
      </React.Fragment>
    )}
  </Container>
);

export default MenuPresenter;
