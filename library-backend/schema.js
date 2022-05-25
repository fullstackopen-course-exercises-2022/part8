const { gql } = require('apollo-server')

const typeDefs = gql`
    type Book {
        title: String!
        published: Int!
        author: Author!
        id: ID!
        genres: [String!]!
    }
    type Author {
        name: String!
        born: Int
        id: ID!
    }
    type User {
        username: String!
        favoriteGenre: String!
        id: ID!
    }
    type Token {
        value: String!
    }

    type Query {
        bookCount: Int!
        authorCount: Int!
        getBooks(author: String, genre: String): [Book!]!
        getAuthors: [Author!]!
        findBooks(name: String!): Book
        me: User
    }
    type Mutation {
        createBooks(
            title: String!
            author: String!
            published: Int!
            genres: [String!]!
        ): Book
        editBorn(
            name: String!
            born: Int!
        ) : Author
        createUser(
            username: String!
            favoriteGenre: String!
        ) : User
        login(
            username: String!
            password: String!
        ) : Token
    }
    
    type Subscription {
        bookAdded: Book!
    }
`

module.exports = typeDefs