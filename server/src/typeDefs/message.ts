import { gql } from "apollo-server";

export default gql`
  extend type Query {
    messages(cursor: String, channelId: ID!): [Message!]!
  }

  extend type Mutation {
    createMessage(channelId: ID!, body: String!): CreateMessageResponse!
  }

  extend type Subscription {
    messageCreated(channelId: ID!): Message!
  }

  type CreateMessageResponse {
    ok: Boolean!
  }

  type Message {
    id: ID!
    user: User!
    channel: Channel!
    body: String!
    createdAt: String!
  }
`;
