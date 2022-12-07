import { gql } from "apollo-server";

export default gql`
  extend type Query {
    getDMMessages(cursor: String, senderId: ID!): [DirectMessage!]!
  }

  extend type Mutation {
    createDMMessage(receiverId: ID!, body: String!): CreateMessageResponse!
  }

  extend type Subscription {
    messageDMCreated(senderId: ID!): DirectMessage!
  }

  type CreateMessageResponse {
    ok: Boolean!
  }

  type DirectMessage {
    id: ID!
    body: String!
    sender: User!
    receiver: User!
    createdAt: String!
  }
`;

/**
 *
 *
 * bob is the sender => send message to
 * ..
 * eric is the reciever
 *
 * vice verse
 */

/**
 *
 * sender is the person  you trying to get message from
 * receiver is you thata re recieving the message
 */
