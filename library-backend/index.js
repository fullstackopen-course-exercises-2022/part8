const { ApolloServer, gql, UserInputError, AuthenticationError } = require('apollo-server')
const { v4: uuid } = require('uuid')
const mongoose = require('mongoose')
const Book = require('./model/bookModel')
const Author = require('./model/authorModel')
const User = require('./model/userModel')
const jwt = require('jsonwebtoken')

require('dotenv').config()

const JWT_SECRET = process.env.SECRET_KEY
const DB_PASSWORD = process.env.DB_PASSWORD

mongoose.connect(`mongodb+srv://root:${DB_PASSWORD}@cluster0.2t7mh.mongodb.net/?retryWrites=true&w=majority`, {
    useNewUrlParser: true, useUnifiedTopology: true
})
    .then(() => {
        console.log('Connected to MongoDB!')
    })
    .catch((error) => {
        console.log('ERROR:', error.message)
    })

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
`

const resolvers = {
    Query: {
        bookCount: () => Book.collection.countDocuments(),
        authorCount: () => Author.collection.countDocuments(),
        getBooks: async (root, args)  => {
            if(!args.author && !args.genre) {
                return Book.find({}).populate('author')
            }
            if(args.author) {
                return Book.find({ author: { $in: [ args.name, args.born ] } })
            } else if (args.genre) {
                return Book.find({ genres: { $in: [args.genre] } }).populate('author')
            }
        },

        getAuthors: async () => {
            const authors = await Author.find({})
            return authors
        },
        me: async (root, args, context) => {
            return context.currentUser
        }
    },
    Mutation: {
        createBooks: async (root, args, { currentUser }) => {
            if(!currentUser) {
                throw new AuthenticationError('You need to be authenticated!')
            }
           let foundAuthor = await Author.findOne({ name: args.author })
           if(!foundAuthor) {
               const addAuthor = new Author({ name: args.author })
               try {
                   await addAuthor.save()
               } catch(err) {
                   throw new UserInputError(err, {
                       invalidArgs: args
                   })
               }
           }
           let author = await Author.findOne({ name: args.author })
           const addBook = new Book({ ...args, author: author })
           try {
               await addBook.save()
           } catch(err) {
               throw new UserInputError(err, {
                   invalidArgs: args
               })
           }

           return addBook
        },
        editBorn: async(root, args, { currentUser }) => {
            if(!currentUser) {
                throw new AuthenticationError('You need to be authenticated!')
            }
            const author = await Author.findOne({ name: args.name })
            author.born = args.born
            try {
                return await author.save()
            } catch(err) {
                throw new UserInputError(err, {
                    invalidArgs: args
                })
            }
        },
        createUser: async(root, args) => {
            const addUser = new User({ username: args.username, favoriteGenre: args.favoriteGenre })
            try {
                return await addUser.save()
            } catch(err) {
                throw new UserInputError(err, {
                    invalidArgs: args
                })
            }
        },
        login: async(root, args) => {
            const username = await User.findOne({ username: args.username })
            if(!username || args.password !== 'Password@123?') {
                throw new UserInputError('Wrong User login details!')
            }
            const userInfo = {
                username: args.username,
                _id: username._id,
            }
            const token = jwt.sign(userInfo, JWT_SECRET, { expiresIn: '2d' })
            return { value: token }
        }
    }
}

const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: async ({ req}) => {
        const auth = req ? req.headers.authorization : null
        if(auth && auth.toLowerCase().startsWith('bearer ')) {
            const decodeToken = jwt.verify(auth.substring(7), JWT_SECRET)
            const currentUser = await User.findById(decodeToken._id)
            return { currentUser }
        }
    }
})

server.listen().then(({ url }) => {
    console.log(`Server ready at ${ url }`)
})