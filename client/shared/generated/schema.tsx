import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
const defaultOptions = {} as const;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};

export type Channel = {
  __typename?: 'Channel';
  id: Scalars['ID'];
  messages: Array<Message>;
  name: Scalars['String'];
  server: Server;
};

export type CreateChannelResponse = {
  __typename?: 'CreateChannelResponse';
  channel?: Maybe<Channel>;
  ok: Scalars['Boolean'];
};

export type CreateMessageResponse = {
  __typename?: 'CreateMessageResponse';
  ok: Scalars['Boolean'];
};

export type CreateServerResponse = {
  __typename?: 'CreateServerResponse';
  ok: Scalars['Boolean'];
  server?: Maybe<Server>;
};

export type CreateUserResponse = {
  __typename?: 'CreateUserResponse';
  ok: Scalars['Boolean'];
  user?: Maybe<User>;
};

export type DirectMessage = {
  __typename?: 'DirectMessage';
  body: Scalars['String'];
  createdAt: Scalars['String'];
  id: Scalars['ID'];
  receiver: User;
  sender: User;
};

export type Message = {
  __typename?: 'Message';
  body: Scalars['String'];
  channel: Channel;
  createdAt: Scalars['String'];
  id: Scalars['ID'];
  user: User;
};

export type Mutation = {
  __typename?: 'Mutation';
  _?: Maybe<Scalars['String']>;
  addMember: VoidResponse;
  createChannel: CreateChannelResponse;
  createDMMessage: CreateMessageResponse;
  createMessage: CreateMessageResponse;
  createServer: CreateServerResponse;
  deleteChannel: VoidResponse;
  deleteServer: VoidResponse;
  loginUser: Token;
  registerUser: CreateUserResponse;
  removeMember: VoidResponse;
};


export type MutationAddMemberArgs = {
  id: Scalars['ID'];
  serverId: Scalars['ID'];
};


export type MutationCreateChannelArgs = {
  name: Scalars['String'];
  serverId: Scalars['ID'];
};


export type MutationCreateDmMessageArgs = {
  body: Scalars['String'];
  receiverId: Scalars['ID'];
};


export type MutationCreateMessageArgs = {
  body: Scalars['String'];
  channelId: Scalars['ID'];
};


export type MutationCreateServerArgs = {
  name: Scalars['String'];
};


export type MutationDeleteChannelArgs = {
  id: Scalars['ID'];
  serverId: Scalars['ID'];
};


export type MutationDeleteServerArgs = {
  id: Scalars['ID'];
};


export type MutationLoginUserArgs = {
  email: Scalars['String'];
  password: Scalars['String'];
};


export type MutationRegisterUserArgs = {
  email: Scalars['String'];
  password: Scalars['String'];
  username: Scalars['String'];
};


export type MutationRemoveMemberArgs = {
  id: Scalars['ID'];
  serverId: Scalars['ID'];
};

export type Query = {
  __typename?: 'Query';
  _?: Maybe<Scalars['String']>;
  allServers: Array<Server>;
  getChannels: Array<Channel>;
  getDMMessages: Array<DirectMessage>;
  getMembers: Array<User>;
  getServer: Server;
  getUsers: Array<User>;
  me: User;
  messages: Array<Message>;
};


export type QueryGetChannelsArgs = {
  serverId: Scalars['ID'];
};


export type QueryGetDmMessagesArgs = {
  cursor?: InputMaybe<Scalars['String']>;
  senderId: Scalars['ID'];
};


export type QueryGetMembersArgs = {
  id: Scalars['ID'];
};


export type QueryGetServerArgs = {
  id: Scalars['ID'];
};


export type QueryMessagesArgs = {
  channelId: Scalars['ID'];
  cursor?: InputMaybe<Scalars['String']>;
};

export type Server = {
  __typename?: 'Server';
  channels: Array<Channel>;
  id: Scalars['ID'];
  logo?: Maybe<Scalars['String']>;
  name: Scalars['String'];
  owner: User;
  users: Array<User>;
};

export type Subscription = {
  __typename?: 'Subscription';
  _?: Maybe<Scalars['String']>;
  channelCreated: Channel;
  channelDeleted: Channel;
  messageCreated: Message;
  messageDMCreated: DirectMessage;
  serverDeleted: Server;
  userJoined: Server;
  userRemoved: Server;
};


export type SubscriptionChannelCreatedArgs = {
  serverId: Scalars['ID'];
};


export type SubscriptionChannelDeletedArgs = {
  serverId: Scalars['ID'];
};


export type SubscriptionMessageCreatedArgs = {
  channelId: Scalars['ID'];
};


export type SubscriptionMessageDmCreatedArgs = {
  senderId: Scalars['ID'];
};


export type SubscriptionServerDeletedArgs = {
  serverId: Scalars['ID'];
};

export type Token = {
  __typename?: 'Token';
  access_token: Scalars['String'];
};

export type User = {
  __typename?: 'User';
  discriminator: Scalars['String'];
  email: Scalars['String'];
  id: Scalars['ID'];
  servers: Array<Server>;
  username: Scalars['String'];
};

export type VoidResponse = {
  __typename?: 'VoidResponse';
  ok: Scalars['Boolean'];
};

export type GetChannelsQueryVariables = Exact<{
  serverId: Scalars['ID'];
}>;


export type GetChannelsQuery = { __typename?: 'Query', getChannels: Array<{ __typename?: 'Channel', id: string, name: string }> };

export type CreateChannelMutationVariables = Exact<{
  name: Scalars['String'];
  serverId: Scalars['ID'];
}>;


export type CreateChannelMutation = { __typename?: 'Mutation', createChannel: { __typename?: 'CreateChannelResponse', ok: boolean, channel?: { __typename?: 'Channel', id: string, name: string } | null } };

export type DeleteChannelMutationVariables = Exact<{
  deleteChannelId: Scalars['ID'];
  serverId: Scalars['ID'];
}>;


export type DeleteChannelMutation = { __typename?: 'Mutation', deleteChannel: { __typename?: 'VoidResponse', ok: boolean } };

export type ChannelCreatedSubscriptionVariables = Exact<{
  serverId: Scalars['ID'];
}>;


export type ChannelCreatedSubscription = { __typename?: 'Subscription', channelCreated: { __typename?: 'Channel', id: string, name: string, server: { __typename?: 'Server', id: string, name: string } } };

export type ChannelDeletedSubscriptionVariables = Exact<{
  serverId: Scalars['ID'];
}>;


export type ChannelDeletedSubscription = { __typename?: 'Subscription', channelDeleted: { __typename?: 'Channel', id: string, name: string, server: { __typename?: 'Server', id: string, name: string } } };

export type MessageDmCreatedSubscriptionVariables = Exact<{
  senderId: Scalars['ID'];
}>;


export type MessageDmCreatedSubscription = { __typename?: 'Subscription', messageDMCreated: { __typename?: 'DirectMessage', id: string, body: string, createdAt: string, sender: { __typename?: 'User', id: string, username: string }, receiver: { __typename?: 'User', id: string, username: string } } };

export type CreateDMessageMutationVariables = Exact<{
  receiverId: Scalars['ID'];
  body: Scalars['String'];
}>;


export type CreateDMessageMutation = { __typename?: 'Mutation', createDMMessage: { __typename?: 'CreateMessageResponse', ok: boolean } };

export type GetDmMessageQueryVariables = Exact<{
  senderId: Scalars['ID'];
  cursor?: InputMaybe<Scalars['String']>;
}>;


export type GetDmMessageQuery = { __typename?: 'Query', getDMMessages: Array<{ __typename?: 'DirectMessage', id: string, body: string, createdAt: string, sender: { __typename?: 'User', id: string, username: string }, receiver: { __typename?: 'User', id: string, username: string } }> };

export type MessageCreatedSubscriptionVariables = Exact<{
  channelId: Scalars['ID'];
}>;


export type MessageCreatedSubscription = { __typename?: 'Subscription', messageCreated: { __typename?: 'Message', id: string, body: string, createdAt: string, user: { __typename?: 'User', id: string, username: string }, channel: { __typename?: 'Channel', id: string, name: string } } };

export type CreateMessageMutationVariables = Exact<{
  channelId: Scalars['ID'];
  body: Scalars['String'];
}>;


export type CreateMessageMutation = { __typename?: 'Mutation', createMessage: { __typename?: 'CreateMessageResponse', ok: boolean } };

export type GetMessageQueryVariables = Exact<{
  channelId: Scalars['ID'];
  cursor?: InputMaybe<Scalars['String']>;
}>;


export type GetMessageQuery = { __typename?: 'Query', messages: Array<{ __typename?: 'Message', id: string, body: string, createdAt: string, user: { __typename?: 'User', id: string, username: string }, channel: { __typename?: 'Channel', id: string, name: string } }> };

export type GetServersQueryVariables = Exact<{ [key: string]: never; }>;


export type GetServersQuery = { __typename?: 'Query', allServers: Array<{ __typename?: 'Server', id: string, name: string, owner: { __typename?: 'User', id: string, email: string, discriminator: string }, channels: Array<{ __typename?: 'Channel', id: string, name: string }> }> };

export type GetServerDataQueryVariables = Exact<{
  id: Scalars['ID'];
}>;


export type GetServerDataQuery = { __typename?: 'Query', getServer: { __typename?: 'Server', id: string, name: string, owner: { __typename?: 'User', id: string }, channels: Array<{ __typename?: 'Channel', id: string, name: string }>, users: Array<{ __typename?: 'User', id: string, username: string, email: string, discriminator: string }> } };

export type CreateServerMutationVariables = Exact<{
  name: Scalars['String'];
}>;


export type CreateServerMutation = { __typename?: 'Mutation', createServer: { __typename?: 'CreateServerResponse', ok: boolean, server?: { __typename?: 'Server', id: string, name: string, owner: { __typename?: 'User', id: string, email: string } } | null } };

export type DeleteServerMutationVariables = Exact<{
  deleteServerId: Scalars['ID'];
}>;


export type DeleteServerMutation = { __typename?: 'Mutation', deleteServer: { __typename?: 'VoidResponse', ok: boolean } };

export type GetMembersQueryVariables = Exact<{
  serverId: Scalars['ID'];
}>;


export type GetMembersQuery = { __typename?: 'Query', getMembers: Array<{ __typename?: 'User', id: string, username: string, email: string, discriminator: string }> };

export type AddMemberMutationVariables = Exact<{
  id: Scalars['ID'];
  serverId: Scalars['ID'];
}>;


export type AddMemberMutation = { __typename?: 'Mutation', addMember: { __typename?: 'VoidResponse', ok: boolean } };

export type RemoveMemberMutationVariables = Exact<{
  id: Scalars['ID'];
  serverId: Scalars['ID'];
}>;


export type RemoveMemberMutation = { __typename?: 'Mutation', removeMember: { __typename?: 'VoidResponse', ok: boolean } };

export type UserJoinedSubscriptionVariables = Exact<{ [key: string]: never; }>;


export type UserJoinedSubscription = { __typename?: 'Subscription', userJoined: { __typename?: 'Server', id: string, name: string, owner: { __typename?: 'User', id: string, email: string, discriminator: string }, channels: Array<{ __typename?: 'Channel', id: string, name: string }> } };

export type UserRemovedSubscriptionVariables = Exact<{ [key: string]: never; }>;


export type UserRemovedSubscription = { __typename?: 'Subscription', userRemoved: { __typename?: 'Server', id: string, name: string, owner: { __typename?: 'User', id: string, email: string, discriminator: string }, channels: Array<{ __typename?: 'Channel', id: string, name: string }> } };

export type RegisterUserMutationVariables = Exact<{
  username: Scalars['String'];
  email: Scalars['String'];
  password: Scalars['String'];
}>;


export type RegisterUserMutation = { __typename?: 'Mutation', registerUser: { __typename?: 'CreateUserResponse', ok: boolean, user?: { __typename?: 'User', id: string, username: string, email: string } | null } };

export type LoginUserMutationVariables = Exact<{
  email: Scalars['String'];
  password: Scalars['String'];
}>;


export type LoginUserMutation = { __typename?: 'Mutation', loginUser: { __typename?: 'Token', access_token: string } };

export type GetMeQueryVariables = Exact<{ [key: string]: never; }>;


export type GetMeQuery = { __typename?: 'Query', me: { __typename?: 'User', id: string, email: string, username: string } };

export type GetUsersQueryVariables = Exact<{ [key: string]: never; }>;


export type GetUsersQuery = { __typename?: 'Query', getUsers: Array<{ __typename?: 'User', id: string, email: string, username: string, discriminator: string, servers: Array<{ __typename?: 'Server', id: string }> }> };


export const GetChannelsDocument = gql`
    query GetChannels($serverId: ID!) {
  getChannels(serverId: $serverId) {
    id
    name
  }
}
    `;

/**
 * __useGetChannelsQuery__
 *
 * To run a query within a React component, call `useGetChannelsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetChannelsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetChannelsQuery({
 *   variables: {
 *      serverId: // value for 'serverId'
 *   },
 * });
 */
export function useGetChannelsQuery(baseOptions: Apollo.QueryHookOptions<GetChannelsQuery, GetChannelsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetChannelsQuery, GetChannelsQueryVariables>(GetChannelsDocument, options);
      }
export function useGetChannelsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetChannelsQuery, GetChannelsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetChannelsQuery, GetChannelsQueryVariables>(GetChannelsDocument, options);
        }
export type GetChannelsQueryHookResult = ReturnType<typeof useGetChannelsQuery>;
export type GetChannelsLazyQueryHookResult = ReturnType<typeof useGetChannelsLazyQuery>;
export type GetChannelsQueryResult = Apollo.QueryResult<GetChannelsQuery, GetChannelsQueryVariables>;
export const CreateChannelDocument = gql`
    mutation CreateChannel($name: String!, $serverId: ID!) {
  createChannel(name: $name, serverId: $serverId) {
    ok
    channel {
      id
      name
    }
  }
}
    `;
export type CreateChannelMutationFn = Apollo.MutationFunction<CreateChannelMutation, CreateChannelMutationVariables>;

/**
 * __useCreateChannelMutation__
 *
 * To run a mutation, you first call `useCreateChannelMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateChannelMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createChannelMutation, { data, loading, error }] = useCreateChannelMutation({
 *   variables: {
 *      name: // value for 'name'
 *      serverId: // value for 'serverId'
 *   },
 * });
 */
export function useCreateChannelMutation(baseOptions?: Apollo.MutationHookOptions<CreateChannelMutation, CreateChannelMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateChannelMutation, CreateChannelMutationVariables>(CreateChannelDocument, options);
      }
export type CreateChannelMutationHookResult = ReturnType<typeof useCreateChannelMutation>;
export type CreateChannelMutationResult = Apollo.MutationResult<CreateChannelMutation>;
export type CreateChannelMutationOptions = Apollo.BaseMutationOptions<CreateChannelMutation, CreateChannelMutationVariables>;
export const DeleteChannelDocument = gql`
    mutation DeleteChannel($deleteChannelId: ID!, $serverId: ID!) {
  deleteChannel(id: $deleteChannelId, serverId: $serverId) {
    ok
  }
}
    `;
export type DeleteChannelMutationFn = Apollo.MutationFunction<DeleteChannelMutation, DeleteChannelMutationVariables>;

/**
 * __useDeleteChannelMutation__
 *
 * To run a mutation, you first call `useDeleteChannelMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteChannelMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteChannelMutation, { data, loading, error }] = useDeleteChannelMutation({
 *   variables: {
 *      deleteChannelId: // value for 'deleteChannelId'
 *      serverId: // value for 'serverId'
 *   },
 * });
 */
export function useDeleteChannelMutation(baseOptions?: Apollo.MutationHookOptions<DeleteChannelMutation, DeleteChannelMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteChannelMutation, DeleteChannelMutationVariables>(DeleteChannelDocument, options);
      }
export type DeleteChannelMutationHookResult = ReturnType<typeof useDeleteChannelMutation>;
export type DeleteChannelMutationResult = Apollo.MutationResult<DeleteChannelMutation>;
export type DeleteChannelMutationOptions = Apollo.BaseMutationOptions<DeleteChannelMutation, DeleteChannelMutationVariables>;
export const ChannelCreatedDocument = gql`
    subscription ChannelCreated($serverId: ID!) {
  channelCreated(serverId: $serverId) {
    id
    name
    server {
      id
      name
    }
  }
}
    `;

/**
 * __useChannelCreatedSubscription__
 *
 * To run a query within a React component, call `useChannelCreatedSubscription` and pass it any options that fit your needs.
 * When your component renders, `useChannelCreatedSubscription` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the subscription, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useChannelCreatedSubscription({
 *   variables: {
 *      serverId: // value for 'serverId'
 *   },
 * });
 */
export function useChannelCreatedSubscription(baseOptions: Apollo.SubscriptionHookOptions<ChannelCreatedSubscription, ChannelCreatedSubscriptionVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useSubscription<ChannelCreatedSubscription, ChannelCreatedSubscriptionVariables>(ChannelCreatedDocument, options);
      }
export type ChannelCreatedSubscriptionHookResult = ReturnType<typeof useChannelCreatedSubscription>;
export type ChannelCreatedSubscriptionResult = Apollo.SubscriptionResult<ChannelCreatedSubscription>;
export const ChannelDeletedDocument = gql`
    subscription ChannelDeleted($serverId: ID!) {
  channelDeleted(serverId: $serverId) {
    id
    name
    server {
      id
      name
    }
  }
}
    `;

/**
 * __useChannelDeletedSubscription__
 *
 * To run a query within a React component, call `useChannelDeletedSubscription` and pass it any options that fit your needs.
 * When your component renders, `useChannelDeletedSubscription` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the subscription, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useChannelDeletedSubscription({
 *   variables: {
 *      serverId: // value for 'serverId'
 *   },
 * });
 */
export function useChannelDeletedSubscription(baseOptions: Apollo.SubscriptionHookOptions<ChannelDeletedSubscription, ChannelDeletedSubscriptionVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useSubscription<ChannelDeletedSubscription, ChannelDeletedSubscriptionVariables>(ChannelDeletedDocument, options);
      }
export type ChannelDeletedSubscriptionHookResult = ReturnType<typeof useChannelDeletedSubscription>;
export type ChannelDeletedSubscriptionResult = Apollo.SubscriptionResult<ChannelDeletedSubscription>;
export const MessageDmCreatedDocument = gql`
    subscription MessageDMCreated($senderId: ID!) {
  messageDMCreated(senderId: $senderId) {
    id
    body
    sender {
      id
      username
    }
    receiver {
      id
      username
    }
    createdAt
  }
}
    `;

/**
 * __useMessageDmCreatedSubscription__
 *
 * To run a query within a React component, call `useMessageDmCreatedSubscription` and pass it any options that fit your needs.
 * When your component renders, `useMessageDmCreatedSubscription` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the subscription, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useMessageDmCreatedSubscription({
 *   variables: {
 *      senderId: // value for 'senderId'
 *   },
 * });
 */
export function useMessageDmCreatedSubscription(baseOptions: Apollo.SubscriptionHookOptions<MessageDmCreatedSubscription, MessageDmCreatedSubscriptionVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useSubscription<MessageDmCreatedSubscription, MessageDmCreatedSubscriptionVariables>(MessageDmCreatedDocument, options);
      }
export type MessageDmCreatedSubscriptionHookResult = ReturnType<typeof useMessageDmCreatedSubscription>;
export type MessageDmCreatedSubscriptionResult = Apollo.SubscriptionResult<MessageDmCreatedSubscription>;
export const CreateDMessageDocument = gql`
    mutation CreateDMessage($receiverId: ID!, $body: String!) {
  createDMMessage(receiverId: $receiverId, body: $body) {
    ok
  }
}
    `;
export type CreateDMessageMutationFn = Apollo.MutationFunction<CreateDMessageMutation, CreateDMessageMutationVariables>;

/**
 * __useCreateDMessageMutation__
 *
 * To run a mutation, you first call `useCreateDMessageMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateDMessageMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createDMessageMutation, { data, loading, error }] = useCreateDMessageMutation({
 *   variables: {
 *      receiverId: // value for 'receiverId'
 *      body: // value for 'body'
 *   },
 * });
 */
export function useCreateDMessageMutation(baseOptions?: Apollo.MutationHookOptions<CreateDMessageMutation, CreateDMessageMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateDMessageMutation, CreateDMessageMutationVariables>(CreateDMessageDocument, options);
      }
export type CreateDMessageMutationHookResult = ReturnType<typeof useCreateDMessageMutation>;
export type CreateDMessageMutationResult = Apollo.MutationResult<CreateDMessageMutation>;
export type CreateDMessageMutationOptions = Apollo.BaseMutationOptions<CreateDMessageMutation, CreateDMessageMutationVariables>;
export const GetDmMessageDocument = gql`
    query GetDMMessage($senderId: ID!, $cursor: String) {
  getDMMessages(senderId: $senderId, cursor: $cursor) {
    id
    body
    sender {
      id
      username
    }
    receiver {
      id
      username
    }
    createdAt
  }
}
    `;

/**
 * __useGetDmMessageQuery__
 *
 * To run a query within a React component, call `useGetDmMessageQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetDmMessageQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetDmMessageQuery({
 *   variables: {
 *      senderId: // value for 'senderId'
 *      cursor: // value for 'cursor'
 *   },
 * });
 */
export function useGetDmMessageQuery(baseOptions: Apollo.QueryHookOptions<GetDmMessageQuery, GetDmMessageQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetDmMessageQuery, GetDmMessageQueryVariables>(GetDmMessageDocument, options);
      }
export function useGetDmMessageLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetDmMessageQuery, GetDmMessageQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetDmMessageQuery, GetDmMessageQueryVariables>(GetDmMessageDocument, options);
        }
export type GetDmMessageQueryHookResult = ReturnType<typeof useGetDmMessageQuery>;
export type GetDmMessageLazyQueryHookResult = ReturnType<typeof useGetDmMessageLazyQuery>;
export type GetDmMessageQueryResult = Apollo.QueryResult<GetDmMessageQuery, GetDmMessageQueryVariables>;
export const MessageCreatedDocument = gql`
    subscription MessageCreated($channelId: ID!) {
  messageCreated(channelId: $channelId) {
    id
    body
    user {
      id
      username
    }
    channel {
      id
      name
    }
    createdAt
  }
}
    `;

/**
 * __useMessageCreatedSubscription__
 *
 * To run a query within a React component, call `useMessageCreatedSubscription` and pass it any options that fit your needs.
 * When your component renders, `useMessageCreatedSubscription` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the subscription, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useMessageCreatedSubscription({
 *   variables: {
 *      channelId: // value for 'channelId'
 *   },
 * });
 */
export function useMessageCreatedSubscription(baseOptions: Apollo.SubscriptionHookOptions<MessageCreatedSubscription, MessageCreatedSubscriptionVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useSubscription<MessageCreatedSubscription, MessageCreatedSubscriptionVariables>(MessageCreatedDocument, options);
      }
export type MessageCreatedSubscriptionHookResult = ReturnType<typeof useMessageCreatedSubscription>;
export type MessageCreatedSubscriptionResult = Apollo.SubscriptionResult<MessageCreatedSubscription>;
export const CreateMessageDocument = gql`
    mutation CreateMessage($channelId: ID!, $body: String!) {
  createMessage(channelId: $channelId, body: $body) {
    ok
  }
}
    `;
export type CreateMessageMutationFn = Apollo.MutationFunction<CreateMessageMutation, CreateMessageMutationVariables>;

/**
 * __useCreateMessageMutation__
 *
 * To run a mutation, you first call `useCreateMessageMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateMessageMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createMessageMutation, { data, loading, error }] = useCreateMessageMutation({
 *   variables: {
 *      channelId: // value for 'channelId'
 *      body: // value for 'body'
 *   },
 * });
 */
export function useCreateMessageMutation(baseOptions?: Apollo.MutationHookOptions<CreateMessageMutation, CreateMessageMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateMessageMutation, CreateMessageMutationVariables>(CreateMessageDocument, options);
      }
export type CreateMessageMutationHookResult = ReturnType<typeof useCreateMessageMutation>;
export type CreateMessageMutationResult = Apollo.MutationResult<CreateMessageMutation>;
export type CreateMessageMutationOptions = Apollo.BaseMutationOptions<CreateMessageMutation, CreateMessageMutationVariables>;
export const GetMessageDocument = gql`
    query GetMessage($channelId: ID!, $cursor: String) {
  messages(channelId: $channelId, cursor: $cursor) {
    id
    body
    user {
      id
      username
    }
    channel {
      id
      name
    }
    createdAt
  }
}
    `;

/**
 * __useGetMessageQuery__
 *
 * To run a query within a React component, call `useGetMessageQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetMessageQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetMessageQuery({
 *   variables: {
 *      channelId: // value for 'channelId'
 *      cursor: // value for 'cursor'
 *   },
 * });
 */
export function useGetMessageQuery(baseOptions: Apollo.QueryHookOptions<GetMessageQuery, GetMessageQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetMessageQuery, GetMessageQueryVariables>(GetMessageDocument, options);
      }
export function useGetMessageLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetMessageQuery, GetMessageQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetMessageQuery, GetMessageQueryVariables>(GetMessageDocument, options);
        }
export type GetMessageQueryHookResult = ReturnType<typeof useGetMessageQuery>;
export type GetMessageLazyQueryHookResult = ReturnType<typeof useGetMessageLazyQuery>;
export type GetMessageQueryResult = Apollo.QueryResult<GetMessageQuery, GetMessageQueryVariables>;
export const GetServersDocument = gql`
    query GetServers {
  allServers {
    id
    name
    owner {
      id
      email
      discriminator
    }
    channels {
      id
      name
    }
  }
}
    `;

/**
 * __useGetServersQuery__
 *
 * To run a query within a React component, call `useGetServersQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetServersQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetServersQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetServersQuery(baseOptions?: Apollo.QueryHookOptions<GetServersQuery, GetServersQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetServersQuery, GetServersQueryVariables>(GetServersDocument, options);
      }
export function useGetServersLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetServersQuery, GetServersQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetServersQuery, GetServersQueryVariables>(GetServersDocument, options);
        }
export type GetServersQueryHookResult = ReturnType<typeof useGetServersQuery>;
export type GetServersLazyQueryHookResult = ReturnType<typeof useGetServersLazyQuery>;
export type GetServersQueryResult = Apollo.QueryResult<GetServersQuery, GetServersQueryVariables>;
export const GetServerDataDocument = gql`
    query GetServerData($id: ID!) {
  getServer(id: $id) {
    id
    name
    owner {
      id
    }
    channels {
      id
      name
    }
    users {
      id
      username
      email
      discriminator
    }
  }
}
    `;

/**
 * __useGetServerDataQuery__
 *
 * To run a query within a React component, call `useGetServerDataQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetServerDataQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetServerDataQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetServerDataQuery(baseOptions: Apollo.QueryHookOptions<GetServerDataQuery, GetServerDataQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetServerDataQuery, GetServerDataQueryVariables>(GetServerDataDocument, options);
      }
export function useGetServerDataLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetServerDataQuery, GetServerDataQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetServerDataQuery, GetServerDataQueryVariables>(GetServerDataDocument, options);
        }
export type GetServerDataQueryHookResult = ReturnType<typeof useGetServerDataQuery>;
export type GetServerDataLazyQueryHookResult = ReturnType<typeof useGetServerDataLazyQuery>;
export type GetServerDataQueryResult = Apollo.QueryResult<GetServerDataQuery, GetServerDataQueryVariables>;
export const CreateServerDocument = gql`
    mutation CreateServer($name: String!) {
  createServer(name: $name) {
    ok
    server {
      id
      name
      owner {
        id
        email
      }
    }
  }
}
    `;
export type CreateServerMutationFn = Apollo.MutationFunction<CreateServerMutation, CreateServerMutationVariables>;

/**
 * __useCreateServerMutation__
 *
 * To run a mutation, you first call `useCreateServerMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateServerMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createServerMutation, { data, loading, error }] = useCreateServerMutation({
 *   variables: {
 *      name: // value for 'name'
 *   },
 * });
 */
export function useCreateServerMutation(baseOptions?: Apollo.MutationHookOptions<CreateServerMutation, CreateServerMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateServerMutation, CreateServerMutationVariables>(CreateServerDocument, options);
      }
export type CreateServerMutationHookResult = ReturnType<typeof useCreateServerMutation>;
export type CreateServerMutationResult = Apollo.MutationResult<CreateServerMutation>;
export type CreateServerMutationOptions = Apollo.BaseMutationOptions<CreateServerMutation, CreateServerMutationVariables>;
export const DeleteServerDocument = gql`
    mutation DeleteServer($deleteServerId: ID!) {
  deleteServer(id: $deleteServerId) {
    ok
  }
}
    `;
export type DeleteServerMutationFn = Apollo.MutationFunction<DeleteServerMutation, DeleteServerMutationVariables>;

/**
 * __useDeleteServerMutation__
 *
 * To run a mutation, you first call `useDeleteServerMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteServerMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteServerMutation, { data, loading, error }] = useDeleteServerMutation({
 *   variables: {
 *      deleteServerId: // value for 'deleteServerId'
 *   },
 * });
 */
export function useDeleteServerMutation(baseOptions?: Apollo.MutationHookOptions<DeleteServerMutation, DeleteServerMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteServerMutation, DeleteServerMutationVariables>(DeleteServerDocument, options);
      }
export type DeleteServerMutationHookResult = ReturnType<typeof useDeleteServerMutation>;
export type DeleteServerMutationResult = Apollo.MutationResult<DeleteServerMutation>;
export type DeleteServerMutationOptions = Apollo.BaseMutationOptions<DeleteServerMutation, DeleteServerMutationVariables>;
export const GetMembersDocument = gql`
    query GetMembers($serverId: ID!) {
  getMembers(id: $serverId) {
    id
    username
    email
    discriminator
  }
}
    `;

/**
 * __useGetMembersQuery__
 *
 * To run a query within a React component, call `useGetMembersQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetMembersQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetMembersQuery({
 *   variables: {
 *      serverId: // value for 'serverId'
 *   },
 * });
 */
export function useGetMembersQuery(baseOptions: Apollo.QueryHookOptions<GetMembersQuery, GetMembersQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetMembersQuery, GetMembersQueryVariables>(GetMembersDocument, options);
      }
export function useGetMembersLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetMembersQuery, GetMembersQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetMembersQuery, GetMembersQueryVariables>(GetMembersDocument, options);
        }
export type GetMembersQueryHookResult = ReturnType<typeof useGetMembersQuery>;
export type GetMembersLazyQueryHookResult = ReturnType<typeof useGetMembersLazyQuery>;
export type GetMembersQueryResult = Apollo.QueryResult<GetMembersQuery, GetMembersQueryVariables>;
export const AddMemberDocument = gql`
    mutation AddMember($id: ID!, $serverId: ID!) {
  addMember(id: $id, serverId: $serverId) {
    ok
  }
}
    `;
export type AddMemberMutationFn = Apollo.MutationFunction<AddMemberMutation, AddMemberMutationVariables>;

/**
 * __useAddMemberMutation__
 *
 * To run a mutation, you first call `useAddMemberMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAddMemberMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [addMemberMutation, { data, loading, error }] = useAddMemberMutation({
 *   variables: {
 *      id: // value for 'id'
 *      serverId: // value for 'serverId'
 *   },
 * });
 */
export function useAddMemberMutation(baseOptions?: Apollo.MutationHookOptions<AddMemberMutation, AddMemberMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<AddMemberMutation, AddMemberMutationVariables>(AddMemberDocument, options);
      }
export type AddMemberMutationHookResult = ReturnType<typeof useAddMemberMutation>;
export type AddMemberMutationResult = Apollo.MutationResult<AddMemberMutation>;
export type AddMemberMutationOptions = Apollo.BaseMutationOptions<AddMemberMutation, AddMemberMutationVariables>;
export const RemoveMemberDocument = gql`
    mutation RemoveMember($id: ID!, $serverId: ID!) {
  removeMember(id: $id, serverId: $serverId) {
    ok
  }
}
    `;
export type RemoveMemberMutationFn = Apollo.MutationFunction<RemoveMemberMutation, RemoveMemberMutationVariables>;

/**
 * __useRemoveMemberMutation__
 *
 * To run a mutation, you first call `useRemoveMemberMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRemoveMemberMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [removeMemberMutation, { data, loading, error }] = useRemoveMemberMutation({
 *   variables: {
 *      id: // value for 'id'
 *      serverId: // value for 'serverId'
 *   },
 * });
 */
export function useRemoveMemberMutation(baseOptions?: Apollo.MutationHookOptions<RemoveMemberMutation, RemoveMemberMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<RemoveMemberMutation, RemoveMemberMutationVariables>(RemoveMemberDocument, options);
      }
export type RemoveMemberMutationHookResult = ReturnType<typeof useRemoveMemberMutation>;
export type RemoveMemberMutationResult = Apollo.MutationResult<RemoveMemberMutation>;
export type RemoveMemberMutationOptions = Apollo.BaseMutationOptions<RemoveMemberMutation, RemoveMemberMutationVariables>;
export const UserJoinedDocument = gql`
    subscription UserJoined {
  userJoined {
    id
    name
    owner {
      id
      email
      discriminator
    }
    channels {
      id
      name
    }
  }
}
    `;

/**
 * __useUserJoinedSubscription__
 *
 * To run a query within a React component, call `useUserJoinedSubscription` and pass it any options that fit your needs.
 * When your component renders, `useUserJoinedSubscription` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the subscription, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useUserJoinedSubscription({
 *   variables: {
 *   },
 * });
 */
export function useUserJoinedSubscription(baseOptions?: Apollo.SubscriptionHookOptions<UserJoinedSubscription, UserJoinedSubscriptionVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useSubscription<UserJoinedSubscription, UserJoinedSubscriptionVariables>(UserJoinedDocument, options);
      }
export type UserJoinedSubscriptionHookResult = ReturnType<typeof useUserJoinedSubscription>;
export type UserJoinedSubscriptionResult = Apollo.SubscriptionResult<UserJoinedSubscription>;
export const UserRemovedDocument = gql`
    subscription UserRemoved {
  userRemoved {
    id
    name
    owner {
      id
      email
      discriminator
    }
    channels {
      id
      name
    }
  }
}
    `;

/**
 * __useUserRemovedSubscription__
 *
 * To run a query within a React component, call `useUserRemovedSubscription` and pass it any options that fit your needs.
 * When your component renders, `useUserRemovedSubscription` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the subscription, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useUserRemovedSubscription({
 *   variables: {
 *   },
 * });
 */
export function useUserRemovedSubscription(baseOptions?: Apollo.SubscriptionHookOptions<UserRemovedSubscription, UserRemovedSubscriptionVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useSubscription<UserRemovedSubscription, UserRemovedSubscriptionVariables>(UserRemovedDocument, options);
      }
export type UserRemovedSubscriptionHookResult = ReturnType<typeof useUserRemovedSubscription>;
export type UserRemovedSubscriptionResult = Apollo.SubscriptionResult<UserRemovedSubscription>;
export const RegisterUserDocument = gql`
    mutation RegisterUser($username: String!, $email: String!, $password: String!) {
  registerUser(username: $username, email: $email, password: $password) {
    ok
    user {
      id
      username
      email
    }
  }
}
    `;
export type RegisterUserMutationFn = Apollo.MutationFunction<RegisterUserMutation, RegisterUserMutationVariables>;

/**
 * __useRegisterUserMutation__
 *
 * To run a mutation, you first call `useRegisterUserMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRegisterUserMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [registerUserMutation, { data, loading, error }] = useRegisterUserMutation({
 *   variables: {
 *      username: // value for 'username'
 *      email: // value for 'email'
 *      password: // value for 'password'
 *   },
 * });
 */
export function useRegisterUserMutation(baseOptions?: Apollo.MutationHookOptions<RegisterUserMutation, RegisterUserMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<RegisterUserMutation, RegisterUserMutationVariables>(RegisterUserDocument, options);
      }
export type RegisterUserMutationHookResult = ReturnType<typeof useRegisterUserMutation>;
export type RegisterUserMutationResult = Apollo.MutationResult<RegisterUserMutation>;
export type RegisterUserMutationOptions = Apollo.BaseMutationOptions<RegisterUserMutation, RegisterUserMutationVariables>;
export const LoginUserDocument = gql`
    mutation LoginUser($email: String!, $password: String!) {
  loginUser(email: $email, password: $password) {
    access_token
  }
}
    `;
export type LoginUserMutationFn = Apollo.MutationFunction<LoginUserMutation, LoginUserMutationVariables>;

/**
 * __useLoginUserMutation__
 *
 * To run a mutation, you first call `useLoginUserMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useLoginUserMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [loginUserMutation, { data, loading, error }] = useLoginUserMutation({
 *   variables: {
 *      email: // value for 'email'
 *      password: // value for 'password'
 *   },
 * });
 */
export function useLoginUserMutation(baseOptions?: Apollo.MutationHookOptions<LoginUserMutation, LoginUserMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<LoginUserMutation, LoginUserMutationVariables>(LoginUserDocument, options);
      }
export type LoginUserMutationHookResult = ReturnType<typeof useLoginUserMutation>;
export type LoginUserMutationResult = Apollo.MutationResult<LoginUserMutation>;
export type LoginUserMutationOptions = Apollo.BaseMutationOptions<LoginUserMutation, LoginUserMutationVariables>;
export const GetMeDocument = gql`
    query GetMe {
  me {
    id
    email
    username
  }
}
    `;

/**
 * __useGetMeQuery__
 *
 * To run a query within a React component, call `useGetMeQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetMeQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetMeQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetMeQuery(baseOptions?: Apollo.QueryHookOptions<GetMeQuery, GetMeQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetMeQuery, GetMeQueryVariables>(GetMeDocument, options);
      }
export function useGetMeLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetMeQuery, GetMeQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetMeQuery, GetMeQueryVariables>(GetMeDocument, options);
        }
export type GetMeQueryHookResult = ReturnType<typeof useGetMeQuery>;
export type GetMeLazyQueryHookResult = ReturnType<typeof useGetMeLazyQuery>;
export type GetMeQueryResult = Apollo.QueryResult<GetMeQuery, GetMeQueryVariables>;
export const GetUsersDocument = gql`
    query GetUsers {
  getUsers {
    id
    email
    username
    discriminator
    servers {
      id
    }
  }
}
    `;

/**
 * __useGetUsersQuery__
 *
 * To run a query within a React component, call `useGetUsersQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetUsersQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetUsersQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetUsersQuery(baseOptions?: Apollo.QueryHookOptions<GetUsersQuery, GetUsersQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetUsersQuery, GetUsersQueryVariables>(GetUsersDocument, options);
      }
export function useGetUsersLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetUsersQuery, GetUsersQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetUsersQuery, GetUsersQueryVariables>(GetUsersDocument, options);
        }
export type GetUsersQueryHookResult = ReturnType<typeof useGetUsersQuery>;
export type GetUsersLazyQueryHookResult = ReturnType<typeof useGetUsersLazyQuery>;
export type GetUsersQueryResult = Apollo.QueryResult<GetUsersQuery, GetUsersQueryVariables>;