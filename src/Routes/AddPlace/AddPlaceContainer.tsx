import AddPlacePresenter from './AddPlacePresenter';
import { ADD_PLACE } from './AddPlaceQueries';
import React from 'react';
import { Mutation } from 'react-apollo';
import { RouteComponentProps } from 'react-router-dom';
import { toast } from 'react-toastify';
import { GET_PLACES } from 'src/sharedQueries';
import { addPlace, addPlaceVariables } from 'src/types/api';

interface IState {
  address: string;
  name: string;
  lat: number;
  lng: number;
}

interface IProps
  extends RouteComponentProps<
    {},
    any,
    { address: string; lat: number; lng: number }
  > {}

class AddPlaceMutation extends Mutation<addPlace, addPlaceVariables> {}

class AddPlaceContainer extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    if (props.location.state) {
      this.state = {
        address: props.location.state.address || "",
        lat: props.location.state.lat || 0,
        lng: props.location.state.lng || 0,
        name: ""
      };
    } else {
      this.state = {
        address: "",
        lat: 0,
        lng: 0,
        name: ""
      };
    }
  }
  public render() {
    const { address, name, lat, lng } = this.state;
    const { history } = this.props;
    return (
      <AddPlaceMutation
        mutation={ADD_PLACE}
        onCompleted={data => {
          const { AddPlace } = data;
          if (AddPlace.ok) {
            toast.success("Place added!");
            setTimeout(() => {
              history.push("/places");
            }, 2000);
          } else {
            toast.error(AddPlace.error);
          }
        }}
        refetchQueries={[{ query: GET_PLACES }]}
        variables={{
          name,
          address,
          lat,
          lng,
          isFav: false
        }}
      >
        {(addPlaceFn, { loading }) => (
          <AddPlacePresenter
            onInputChange={this.onInputChange}
            address={address}
            name={name}
            loading={loading}
            onSubmit={addPlaceFn}
            pickedAddress={lat !== 0 && lng !== 0}
          />
        )}
      </AddPlaceMutation>
    );
  }

  public onInputChange: React.ChangeEventHandler<
    HTMLInputElement
  > = async event => {
    const {
      target: { name, value }
    } = event;
    this.setState({
      [name]: value
    } as any);
  };
}

export default AddPlaceContainer;
