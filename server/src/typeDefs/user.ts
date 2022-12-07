import { gql } from "apollo-server";

export default gql`
  extend type Query {
    me: User!
    getUsers: [User!]!
  }

  extend type Mutation {
    registerUser(
      username: String!
      email: String!
      password: String!
    ): CreateUserResponse!
    loginUser(email: String!, password: String!): Token!
  }

  type CreateUserResponse {
    ok: Boolean!
    user: User
  }

  type Token {
    access_token: String!
  }

  type User {
    id: ID!
    username: String!
    email: String!
    discriminator: String!
    servers: [Server!]!
  }
`;
