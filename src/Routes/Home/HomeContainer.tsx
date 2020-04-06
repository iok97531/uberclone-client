import HomePresenter from './HomePresenter';
import {
  ACCEPT_RIDE,
  GET_NEARBY_DRIVERS,
  GET_NEARBY_RIDE,
  REPORT_LOCATION,
  REQUEST_RIDE,
  SUBSCRIBE_NEARBY_RIDES
  } from './HomeQueries';
import { geoCode, reverseGeoCode } from '../../mapHelpers';
import {
  acceptRide,
  acceptRideVariables,
  getDrivers,
  getRides,
  reportMovement,
  reportMovementVariables,
  requestRide,
  requestRideVariables,
  userProfile
  } from '../../types/api';
import { SubscribeToMoreOptions } from 'apollo-boost';
import React from 'react';
import {
  graphql,
  Mutation,
  MutationFn,
  Query
  } from 'react-apollo';
import ReactDOM from 'react-dom';
import { RouteComponentProps } from 'react-router-dom';
import { toast } from 'react-toastify';
import { USER_PROFILE } from 'src/sharedQueries';

interface IState {
  isMenuOpen: boolean;
  toAddress: string;
  toLat: number;
  toLng: number;
  lat: number;
  lng: number;
  distance?: string;
  duration?: string;
  price?: number;
  fromAddress: string;
  isDriving: boolean;
}

interface IProps extends RouteComponentProps<any> {
  google: any;
  reportLocation: MutationFn;
}

class ProfileQuery extends Query<userProfile> {}
class NearbyQuery extends Query<getDrivers> {}
class RequestRideMutation extends Mutation<requestRide, requestRideVariables> {}
class GetNearbyRides extends Query<getRides> {}
class AcceptRide extends Mutation<acceptRide, acceptRideVariables> {}

class HomeContainer extends React.Component<IProps, IState> {
  public mapRef: any;
  public map: google.maps.Map;
  public userMarker: google.maps.Marker;
  public toMarker: google.maps.Marker;
  public directions: google.maps.DirectionsRenderer;
  public drivers: google.maps.Marker[];
  public state = {
    fromAddress: "",
    isMenuOpen: false,
    lat: 0,
    lng: 0,
    toAddress: "",
    toLat: 0,
    toLng: 0,
    distance: "",
    duration: undefined,
    price: undefined,
    isDriving: true
  };
  constructor(props) {
    super(props);
    this.mapRef = React.createRef();
    this.drivers = [];
  }
  public componentDidMount() {
    navigator.geolocation.getCurrentPosition(
      this.handleGeoSuccess,
      this.handleGeoError
    );
  }
  public render() {
    const {
      isMenuOpen,
      toAddress,
      price,
      distance,
      duration,
      fromAddress,
      lat,
      lng,
      toLat,
      toLng,
      isDriving
    } = this.state;
    return (
      <ProfileQuery query={USER_PROFILE} onCompleted={this.handleProfileQuery}>
        {({ data, loading }) => {
          return (
            <NearbyQuery
              query={GET_NEARBY_DRIVERS}
              pollInterval={5000}
              skip={isDriving}
              onCompleted={this.handleNearbyDrivers}
            >
              {() => (
                <RequestRideMutation
                  mutation={REQUEST_RIDE}
                  onCompleted={this.handleRideRequest}
                  variables={{
                    distance,
                    duration: duration || "",
                    pickUpAddress: fromAddress,
                    pickUpLat: lat,
                    pickUpLng: lng,
                    dropOffAddress: toAddress,
                    dropOffLat: toLat,
                    dropOffLng: toLng,
                    price: price || 0
                  }}
                >
                  {requestRideFn => (
                    <GetNearbyRides query={GET_NEARBY_RIDE} skip={!isDriving}>
                      {({ subscribeToMore, data: nearbyRide }) => {
                        return (
                          <AcceptRide
                            mutation={ACCEPT_RIDE}
                            onCompleted={this.handleRideAcceptance}
                          >
                            {acceptRideFn => (
                              <HomePresenter
                                loading={loading}
                                isMenuOpen={isMenuOpen}
                                toggleMenu={this.toggleMenu}
                                mapRef={this.mapRef}
                                toAddress={toAddress}
                                onInputChange={this.onInputChange}
                                onAddressSubmit={this.onAddressSubmit}
                                price={price}
                                data={data}
                                requestRideFn={requestRideFn}
                                nearbyRide={nearbyRide}
                                acceptRideFn={acceptRideFn}
                                nearbyRideSubscription={isDriver => {
                                  const rideSubscriptionOptions: SubscribeToMoreOptions = {
                                    document: SUBSCRIBE_NEARBY_RIDES,
                                    updateQuery: (
                                      prev,
                                      { subscriptionData }
                                    ) => {
                                      if (!subscriptionData.data) {
                                        return prev;
                                      }
                                      const newObject = Object.assign(
                                        {},
                                        prev,
                                        {
                                          GetNearbyRide: {
                                            ...prev.GetNearbyRide,
                                            ride:
                                              subscriptionData.data
                                                .NearbyRideSubscription
                                          }
                                        }
                                      );
                                      return newObject;
                                    }
                                  };
                                  if (isDriver) {
                                    subscribeToMore(rideSubscriptionOptions);
                                  }
                                }}
                              />
                            )}
                          </AcceptRide>
                        );
                      }}
                    </GetNearbyRides>
                  )}
                </RequestRideMutation>
              )}
            </NearbyQuery>
          );
        }}
      </ProfileQuery>
    );
  }
  public toggleMenu = () => {
    this.setState(state => {
      return {
        isMenuOpen: !state.isMenuOpen
      };
    });
  };

  public handleGeoSuccess = (positon: Position) => {
    const {
      coords: { latitude, longitude }
    } = positon;
    this.setState({
      lat: latitude,
      lng: longitude
    });
    this.getFromAddress(latitude, longitude);
    this.loadMap(latitude, longitude);
  };
  public getFromAddress = async (lat: number, lng: number) => {
    const address = await reverseGeoCode(lat, lng);
    if (address) {
      this.setState({
        fromAddress: address
      });
    }
  };
  public loadMap = (lat, lng) => {
    const { google } = this.props;
    const maps = google.maps;
    const mapNode = ReactDOM.findDOMNode(this.mapRef.current);
    const mapConfig: google.maps.MapOptions = {
      center: {
        lat,
        lng
      },
      disableDefaultUI: true,
      zoom: 13
    };
    this.map = new maps.Map(mapNode, mapConfig);
    const userMarkerOptions: google.maps.MarkerOptions = {
      icon: {
        path: maps.SymbolPath.CIRCLE,
        scale: 7
      },
      position: {
        lat,
        lng
      }
    };
    this.userMarker = new maps.Marker(userMarkerOptions);
    this.userMarker.setMap(this.map);
    const watchOptions: PositionOptions = {
      enableHighAccuracy: true
    };
    navigator.geolocation.watchPosition(
      this.handleGeoWatchSuccess,
      this.handleGeoWatchError,
      watchOptions
    );
  };
  public handleGeoWatchSuccess = (position: Position) => {
    const { reportLocation } = this.props;
    const {
      coords: { latitude, longitude }
    } = position;
    this.userMarker.setPosition({ lat: latitude, lng: longitude });
    this.map.panTo({ lat: latitude, lng: longitude });
    reportLocation({
      variables: {
        lat: parseFloat(latitude.toFixed(10)),
        lng: parseFloat(longitude.toFixed(10))
      }
    });
  };
  public handleGeoWatchError = () => {
    toast.error("Error watching you");
  };
  public handleGeoError = () => {
    toast.error("No location");
  };
  public onInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const {
      target: { name, value }
    } = event;
    this.setState({
      [name]: value
    } as any);
  };
  public onAddressSubmit = async () => {
    const { toAddress } = this.state;
    const { google } = this.props;
    const maps = google.maps;
    const result = await geoCode(toAddress);
    if (result !== false) {
      const { lat, lng, formatted_address } = result;

      if (this.toMarker) {
        this.toMarker.setMap(null);
      }
      const toMarkerOptions: google.maps.MarkerOptions = {
        position: {
          lat,
          lng
        }
      };
      this.toMarker = new maps.Marker(toMarkerOptions);
      this.toMarker.setMap(this.map);
      const bounds = new maps.LatLngBounds();
      bounds.extend({ lat, lng });
      bounds.extend({ lat: this.state.lat, lng: this.state.lng });
      this.map.fitBounds(bounds);
      this.setState(
        {
          toAddress: formatted_address,
          toLat: lat,
          toLng: lng
        },
        this.createPath
      );
    }
  };
  public createPath = () => {
    const { toLat, toLng, lat, lng } = this.state;
    if (this.directions) {
      this.directions.setMap(null);
    }
    const renderOptions: google.maps.DirectionsRendererOptions = {
      suppressMarkers: true,
      polylineOptions: {
        strokeColor: "#000"
      }
    };
    this.directions = new google.maps.DirectionsRenderer(renderOptions);
    const driectionsService: google.maps.DirectionsService = new google.maps.DirectionsService();
    const to = new google.maps.LatLng(toLat, toLng);
    const from = new google.maps.LatLng(lat, lng);
    const directionsOptions: google.maps.DirectionsRequest = {
      destination: to,
      origin: from,
      travelMode: google.maps.TravelMode.TRANSIT
    };
    driectionsService.route(directionsOptions, this.handleRouteRequest);
  };
  public handleRouteRequest = (
    result: google.maps.DirectionsResult,
    status: google.maps.DirectionsStatus
  ) => {
    if (status === google.maps.DirectionsStatus.OK) {
      const { routes } = result;
      const {
        distance: { text: distance },
        duration: { text: duration }
      } = routes[0].legs[0];
      this.directions.setDirections(result);
      this.directions.setMap(this.map);
      this.setState(
        {
          distance,
          duration
        },
        this.setPrice
      );
    } else {
      toast.error("There is no route there");
    }
  };
  public setPrice = () => {
    const { distance } = this.state;
    const price = Number(
      (parseFloat(distance.replace(",", "")) * 3).toFixed(2)
    );
    this.setState({
      price
    });
  };
  public handleNearbyDrivers = (data: {} | getDrivers) => {
    if ("GetNearbyDrivers" in data) {
      const {
        GetNearbyDrivers: { drivers, ok }
      } = data;
      if (ok && drivers) {
        for (const driver of drivers) {
          if (driver && driver.lat && driver.lng) {
            const existingDriver:
              | google.maps.Marker
              | undefined = this.drivers.find(
              (driverMarker: google.maps.Marker) => {
                const markerID = driverMarker.get("ID");
                return markerID === driver.id;
              }
            );

            if (existingDriver) {
              existingDriver.setPosition({ lat: driver.lat, lng: driver.lng });
              existingDriver.setMap(this.map);
            } else {
              const markerOptions: google.maps.MarkerOptions = {
                position: {
                  lat: driver.lat,
                  lng: driver.lng
                },
                icon: {
                  path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
                  scale: 5
                }
              };
              const newMarker: google.maps.Marker = new google.maps.Marker(
                markerOptions
              );
              newMarker.set("ID", driver.id);
              newMarker.setMap(this.map);
              this.drivers.push(newMarker);
            }
          }
        }
      }
    }
  };
  public handleRideRequest = (data: requestRide) => {
    const { history } = this.props;
    const { RequestRide } = data;
    if (RequestRide.ok) {
      toast.success("Drive requested, finding a driver");
      history.push(`/ride/${RequestRide.ride!.id}`);
    } else {
      toast.error(RequestRide.error);
    }
  };
  public handleProfileQuery = (data: userProfile) => {
    const { GetMyProfile } = data;
    if (GetMyProfile.user) {
      const {
        user: { isDriving }
      } = GetMyProfile;
      this.setState({
        isDriving
      });
    }
  };
  public handleRideAcceptance = (data: acceptRide) => {
    const { history } = this.props;
    const { UpdateRideStatus } = data;
    if (UpdateRideStatus.ok) {
      history.push(`/ride/${UpdateRideStatus.rideId}`);
    }
  };
}

export default graphql<any, reportMovement, reportMovementVariables>(
  REPORT_LOCATION,
  { name: "reportLocation" }
)(HomeContainer);