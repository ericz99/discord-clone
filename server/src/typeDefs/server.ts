import { gql } from "apollo-server";

export default gql`
  extend type Query {
    allServers: [Server!]!
    getServer(id: ID!): Server!
    getMembers(id: ID!): [User!]!
  }

  extend type Mutation {
    createServer(name: String!): CreateServerResponse!
    deleteServer(id: ID!): VoidResponse!
    addMember(id: ID!, serverId: ID!): VoidResponse!
    removeMember(id: ID!, serverId: ID!): VoidResponse!
  }

  extend type Subscription {
    serverDeleted(serverId: ID!): Server!
    userJoined: Server!
    userRemoved: Server!
  }

  type CreateServerResponse {
    ok: Boolean!
    server: Server
  }

  type VoidResponse {
    ok: Boolean!
  }

  type Server {
    id: ID!
    owner: User!
    name: String!
    logo: String
    channels: [Channel!]!
    users: [User!]!
  }
`;
