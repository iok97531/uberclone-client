import ChatPresenter from './ChatPresenter';
import { GET_CHAT, SEND_MESSAGE, SUBSCRIBE_TO_MESSAGES } from './ChatQueries';
import { USER_PROFILE } from '../../sharedQueries';
import {
  getChat,
  getChatVariables,
  sendMessage,
  sendMessageVariables,
  userProfile
  } from '../../types/api';
import { SubscribeToMoreOptions } from 'apollo-boost';
import React from 'react';
import { Mutation, MutationFn, Query } from 'react-apollo';
import { RouteComponentProps } from 'react-router-dom';

interface IProps extends RouteComponentProps<any> {}
interface IState {
  message: "";
}
class ProfileQuery extends Query<userProfile> {}
class ChatQuery extends Query<getChat, getChatVariables> {}
class SendMessageMutation extends Mutation<sendMessage, sendMessageVariables> {}

class ChatContainer extends React.Component<IProps, IState> {
  public sendMessageFn: MutationFn;
  constructor(props: IProps) {
    super(props);
    if (!props.match.params.chatId) {
      props.history.push("/");
    }
    this.state = {
      message: ""
    };
  }
  public render() {
    const {
      match: {
        params: { chatId }
      }
    } = this.props;
    const { message } = this.state;
    return (
      <ProfileQuery query={USER_PROFILE}>
        {({ data: userData }) => (
          <ChatQuery query={GET_CHAT} variables={{ chatId: chatId * 1 }}>
            {({ data, loading, subscribeToMore }) => {
              return (
                <SendMessageMutation mutation={SEND_MESSAGE}>
                  {sendMessageFn => {
                    this.sendMessageFn = sendMessageFn;
                    return (
                      <ChatPresenter
                        data={data}
                        loading={loading}
                        userData={userData}
                        messageText={message}
                        onInputChange={this.onInputChange}
                        onSubmit={this.onSubmit}
                        subscribeToRideStatus={() => {
                          const messageSubscriptionOptions: SubscribeToMoreOptions = {
                            document: SUBSCRIBE_TO_MESSAGES,
                            updateQuery: (prev, { subscriptionData }) => {
                              if (!subscriptionData.data) {
                                return prev;
                              }
                              const {
                                data: { MessageSubscription }
                              } = subscriptionData;
                              const newObject = Object.assign({}, prev, {
                                GetChat: {
                                  ...prev.GetChat,
                                  chat: {
                                    ...prev.GetChat.chat,
                                    messages: [
                                      ...prev.GetChat.chat.messages,
                                      MessageSubscription
                                    ]
                                  }
                                }
                              });
                              return newObject;
                            }
                          };
                          subscribeToMore(messageSubscriptionOptions);
                        }}
                      />
                    );
                  }}
                </SendMessageMutation>
              );
            }}
          </ChatQuery>
        )}
      </ProfileQuery>
    );
  }
  public onInputChange: React.ChangeEventHandler<HTMLInputElement> = event => {
    const {
      target: { name, value }
    } = event;
    this.setState({
      [name]: value
    } as any);
  };
  public onSubmit = () => {
    const { message } = this.state;
    const {
      match: {
        params: { chatId }
      }
    } = this.props;
    if (message !== "") {
      this.setState({
        message: ""
      });
      this.sendMessageFn({
        variables: {
          text: message,
          chatId: chatId * 1
        }
      });
    }
  };
}
export default ChatContainer;
