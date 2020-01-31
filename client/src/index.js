import React from "react";
import ReactDOM from "react-dom";
import { split } from "apollo-link";
import { createHttpLink, HttpLink } from "apollo-link-http";
import { ApolloProvider } from "react-apollo";
import { InMemoryCache } from "apollo-cache-inmemory";
import { WebSocketLink } from "apollo-link-ws";
import ApolloClient from "apollo-client";
import { getMainDefinition } from "apollo-utilities";
import { BrowserRouter as Router, Route, Switch, Redirect } from "react-router-dom";

import "./index.css";
import 'bootstrap/dist/css/bootstrap.min.css';

import App from "./App";
import { Login } from "./components/Login/";
import { NoMatch } from "./components/NoMatch/";
import * as serviceWorker from "./serviceWorker";

// Create WebSocket client
const wsLink = new WebSocketLink({
  uri: "ws://localhost:4000/graphql",
  options: {
    reconnect: true
  }
});

// Create an http link:
const httpLink = createHttpLink({
  uri: "http://localhost:4000/graphql"
});

// using the ability to split links, you can send data to each link
// depending on what kind of operation is being sent
const link = split(
  // split based on operation type
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === "OperationDefinition" &&
      definition.operation === "subscription"
    );
  },
  wsLink,
  httpLink
);

const GraphQLClient = new ApolloClient({
  link: wsLink,
  cache: new InMemoryCache()
});

const routes = [
  {
    key: "app",
    path: "/home/:username?",
    exact: true,
    component: App,
  },
  {
    key: "login",
    path: "/login",
    exact: true,
    component: Login
  },
  {
    key: 'redirect',
    exact: true,
    path: '/',
    children: <Redirect to="/home" />
  },
  {
    key: "nomatch",
    component: NoMatch
  }
];

ReactDOM.render(
  <ApolloProvider client={GraphQLClient}>
    <Router>
      <Switch>
        {routes.map(route => (
          <Route {...route} />
        ))}
      </Switch>
    </Router>
  </ApolloProvider>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
