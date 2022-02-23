import {Injectable, NgModule} from '@angular/core';
import {APOLLO_OPTIONS} from 'apollo-angular';
import {ApolloClientOptions, ApolloLink, DefaultOptions, InMemoryCache, split} from '@apollo/client/core';
import {HttpLink} from 'apollo-angular/http';
import {WebSocketLink} from '@apollo/client/link/ws';
import {getMainDefinition} from '@apollo/client/utilities';
import {AuthService} from './_services/auth.service';
import {OperationDefinitionNode} from 'graphql';
import {SubscriptionService} from './_services/subscription.service';

// const uri = 'http://demo.aggregatoricapaci.com:5000/graphql/'; // <-- add the URL of the GraphQL server here
const defaultOption: DefaultOptions = { // disable cache memory
    watchQuery: {
        fetchPolicy: 'no-cache',
        errorPolicy: 'ignore',
    },
    query: {
        fetchPolicy: 'no-cache',
        errorPolicy: 'all',
    },
};


export function createApollo(
    httpLink: HttpLink,
    authService: AuthService,
    subscriptionService: SubscriptionService
): ApolloClientOptions<any> {


    const WS_URI = `ws://demo.aggregatoricapaci.com:5000/graphql`;

    const wsClient = subscriptionService.getWSClient(WS_URI, {
        lazy: true,
        // When connectionParams is a function, it gets evaluated before each connection.
        connectionParams: () => {
            return {
                Authorization: `Bearer ${authService.getToken()}`
            };
        },
    });




    const http = httpLink.create({ uri: 'http://demo.aggregatoricapaci.com:5000/graphql' });
    const ws = new WebSocketLink(wsClient);


    const splitLink = split(
        ({ query }) => {
            const { kind, operation } = getMainDefinition(query) as OperationDefinitionNode;
            return kind === 'OperationDefinition' && operation === 'subscription';
        },
        ws,
        http,
    );

    return {
        link: splitLink,
        cache: new InMemoryCache(),
        defaultOptions: defaultOption
    };
}

@NgModule({
    providers: [
        {
            provide: APOLLO_OPTIONS,
            useFactory: createApollo,
            deps: [HttpLink, AuthService,SubscriptionService],
        },
    ],
})
export class GraphQLModule {

}
