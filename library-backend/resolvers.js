const Book = require('./model/bookModel')
const Author = require('./model/authorModel')
const { AuthenticationError, UserInputError } = require('apollo-server')
const User = require('./model/userModel')
const jwt = require('jsonwebtoken')
const { PubSub } = require('graphql-subscriptions')
const pubSub = new PubSub()

const JWT_SECRET = '|,jl/mg_20dZ|bVvTEVBY{@H%m4^OS'

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

            pubSub.publish('BOOK_ADDED', { bookAdded: addBook })

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
        },
    },
    Subscription: {
        bookAdded: {
            subscribe: () => pubSub.asyncIterator(['BOOK_ADDED'])
        }
    },
}

module.exports = resolvers