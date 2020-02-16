import EditAccountPresenter from './EditAccountPresenter';
import { UPDATE_PROFILE } from './EditAccountQueries';
import { updateProfile, updateProfileVariables, userProfile } from '../../types/api';
import axios from 'axios';
import React from 'react';
import { Mutation, Query } from 'react-apollo';
import { RouteComponentProps } from 'react-router-dom';
import { toast } from 'react-toastify';
import { USER_PROFILE } from 'src/sharedQueries';

interface IState {
  firstName: string;
  lastName: string;
  email: string;
  profilePhoto: string;
  uploading: boolean;
}

interface IProps extends RouteComponentProps<any> {}

class UpdateProfileMutation extends Mutation<
  updateProfile,
  updateProfileVariables
> {}

class ProfileQuery extends Query<userProfile> {}

class EditAccountContainer extends React.Component<IProps, IState> {
  public state = {
    email: "",
    firstName: "",
    lastName: "",
    profilePhoto: "",
    uploading: false
  };
  public render() {
    const { email, firstName, lastName, profilePhoto, uploading } = this.state;
    return (
      <ProfileQuery
        query={USER_PROFILE}
        fetchPolicy={"cache-and-network"}
        onCompleted={this.updateFields}
      >
        {() => (
          <UpdateProfileMutation
            mutation={UPDATE_PROFILE}
            update={(cache, { data }) => {
              if (data) {
                const { UpdateMyProfile } = data;
                if (!UpdateMyProfile.ok) {
                  toast.error(UpdateMyProfile.error);
                  return;
                } else {
                  const query: userProfile | null = cache.readQuery({
                    query: USER_PROFILE
                  });
                  if (query) {
                    const {
                      GetMyProfile: { user }
                    } = query;
                    if (user) {
                      user.firstName = firstName;
                      user.lastName = lastName;
                      user.email = email;
                    }
                  }
                  cache.writeQuery({ query: USER_PROFILE, data: query });
                  toast.success("Profile updated!");
                }
              }
            }}
            variables={{
              email,
              firstName,
              lastName,
              profilePhoto
            }}
          >
            {(updateProfileFn, { loading }) => (
              <EditAccountPresenter
                email={email}
                firstName={firstName}
                lastName={lastName}
                profilePhoto={profilePhoto}
                onInputChange={this.onInputChange}
                loading={loading}
                onSubmit={updateProfileFn}
                uploading={uploading}
              />
            )}
          </UpdateProfileMutation>
        )}
      </ProfileQuery>
    );
  }
  public onInputChange: React.ChangeEventHandler<
    HTMLInputElement
  > = async event => {
    const {
      target: { name, value, files }
    } = event;

    if (files) {
      this.setState({
        uploading: true
      });
      const formData = new FormData();
      formData.append("file", files[0]);
      formData.append("api_key", "768881837465924");
      formData.append("upload_preset", "hjd6yyvc");
      formData.append("timestamp", String(Date.now() / 1000));
      const {
        data: { secure_url }
      } = await axios.post(
        "https://api.coudnary.com/v1_1/dhveprjwb/image/upload",
        formData
      );

      if (secure_url) {
        this.setState({
          uploading: false,
          profilePhoto: secure_url
        });
      }
    }

    this.setState({
      [name]: value
    } as any);
  };

  public updateFields = (data: {} | userProfile) => {
    if ("GetMyProfile" in data) {
      const {
        GetMyProfile: { user }
      } = data;

      if (user) {
        const { firstName, lastName, email, profilePhoto } = user;
        this.setState({
          firstName,
          lastName,
          email,
          profilePhoto,
          uploaded: profilePhoto !== null
        } as any);
      }
    }
  };
}

export default EditAccountContainer;
