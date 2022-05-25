const { ApolloServer } = require('apollo-server-express')
const mongoose = require('mongoose')
const User = require('./model/userModel')
const jwt = require('jsonwebtoken')
const { makeExecutableSchema } = require('@graphql-tools/schema')
const { ApolloServerPluginDrainHttpServer } = require('apollo-server-core')

const { execute, subscribe } = require('graphql')
const { SubscriptionServer } = require('subscriptions-transport-ws')

const typeDefs = require('./schema')
const resolvers = require('./resolvers')

const express = require('express')

const http = require('http')

require('dotenv').config()

const JWT_SECRET = process.env.SECRET_KEY
const DB_PASSWORD = process.env.DB_PASSWORD
const MONGODB_URI = `mongodb+srv://root:${DB_PASSWORD}@cluster0.2t7mh.mongodb.net/?retryWrites=true&w=majority`

mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true, useUnifiedTopology: true
})
    .then(() => {
        console.log('Connected to MongoDB!')
    })
    .catch((error) => {
        console.log('ERROR:', error.message)
    })

const start = async () => {
    const app = express()
    const httpServer = http.createServer(app)
    const schema = makeExecutableSchema({ typeDefs, resolvers })

    const subscriptionServer = SubscriptionServer.create(
        {
            schema,
            execute,
            subscribe
        },
        {
            server: httpServer,
            path: ''
        }
    )

    const server = new ApolloServer({
        schema,
        context: async ({ req}) => {
            const auth = req ? req.headers.authorization : null
            if(auth && auth.toLowerCase().startsWith('bearer ')) {
                const decodeToken = jwt.verify(auth.substring(7), JWT_SECRET)
                const currentUser = await User.findById(decodeToken._id)
                return { currentUser }
            }
        },
        plugins: [ApolloServerPluginDrainHttpServer({ httpServer }),
            {
                async serverWillStart() {
                    return {
                        async drainServer() {
                            subscriptionServer.close()
                        }
                    }
                }
            }
        ]
    })

    await server.start()

    server.applyMiddleware({ app, path: '/' })

    const PORT = 4000

    httpServer.listen(PORT, () => {
        console.log(`Server is now running on http://localhost:${PORT}!`)
    })
}

start()


