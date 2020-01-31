import { ApolloServer, PubSub } from "apollo-server-express";

const app = require("express")();
const httpServer = require("http").createServer(app);

import kafkaStartClient from "./kafkaConfig";
import { typeDefs } from './typeDefs'
import { resolvers } from './resolvers'

const { highLevelProducer, queryResultConsumerGroup } = kafkaStartClient();

const pubsub = new PubSub()

const context = ({req, res}) => {
    return { req, res, queryResultConsumerGroup, highLevelProducer, pubsub };
}

const server = new ApolloServer({
    typeDefs,
    resolvers,
    context
})

server.applyMiddleware({app, path: '/graphql'})
server.installSubscriptionHandlers(httpServer);


httpServer.listen({ port: 4000 }, () => {
    console.log(`Apollo Server websocket on  localhost:4000${server.subscriptionsPath}`);
    console.log(`Apollo Server http on localhost:4000${server.graphqlPath}`);
  });