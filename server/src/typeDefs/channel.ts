import { gql } from "apollo-server";

export default gql`
  extend type Query {
    getChannels(serverId: ID!): [Channel!]!
  }

  extend type Mutation {
    createChannel(name: String!, serverId: ID!): CreateChannelResponse!
    deleteChannel(id: ID!, serverId: ID!): VoidResponse!
  }

  extend type Subscription {
    channelCreated(serverId: ID!): Channel!
    channelDeleted(serverId: ID!): Channel!
  }

  type CreateChannelResponse {
    ok: Boolean!
    channel: Channel
  }

  type VoidResponse {
    ok: Boolean!
  }

  type Channel {
    id: ID!
    server: Server!
    name: String!
    messages: [Message!]!
  }
`;
