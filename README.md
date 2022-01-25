# BEdita API SDK

A simple JavaScript SDK for BEdita API based on [axios](https://axios-http.com).
It is fully written in Typescript and then compiled to JavaScript. Use it as you prefer.

## Install

```bash
yarn add @atlas/bedita-sdk
```

## Getting started

The following code uses `Promise` but you can take advantage of `async` functions and `await` operator.

```js
import { ApiProvider } from '@atlas/bedita-sdk';

// The first argument is the name of the client
// used to register that specific client
const client = ApiProvider.get('bedita', {
    baseUrl: 'https://api-bedita.example.com',
    apiKey: '123456',
});

client.get('/documents')
    .then(response => {
        console.log(res.data);
    });

// Authenticate user.
// After authentication the Authorization header will be added to every request.
// The client take cares of JWT token renew too.
client.authenticate('username', 'password')
    .then(response => {
        // Use save() to create or update an object.
        // To update the object add object id to data
        client.save('documents', {
            title: 'My document',
            description: 'The description is here',
        });
    })
```

After having configured a client you can get that instance everywhere

```js
import { ApiProvider } from '@atlas/bedita-sdk';

// get the previous registered client
const client = ApiProvider.get('bedita');

// get user data previously authenticated
client.getUserAuth()
    .then(response => {
        // the formattedData property contain a modified response data
        console.log(response.data.formattedData);
    });
```

In this way it is possible to instantiate different BEdita API clients distingued by name.

### Interceptors

The client take advantage of [Axios Interceptors](https://axios-http.com/docs/interceptors) to intercept request and response before they are handled by `then` or `catch`.

A set of default interceptor are always used:

* `AuthInterceptor` is responsible for adding `Authorization` header if needed
* `ContentTypeInterceptor` set default content type if no one is passed
* `RefreshAuthInterceptor` is responsible for refreshing the access token when expired

An interceptor can be added to the client or to a request.
When added to the client it will be used unless it was removed.

```js
import { ApiProvider, MapIncludedInterceptor } from '@atlas/bedita-sdk';

const client = ApiProvider.get('bedita');
// Map included data inside the relationships
client.addInterceptor(new MapIncludedInterceptor());
```

A request interceptor **must** implements `RequestInterceptorInterface`.
A response interceptor **must** implements `ResponseInterceptorInterface`.

## Develop

@todo

### Testing

* run docker image of BEdita API as

  ```bash
  docker run -p 8090:80 --env BEDITA_ADMIN_USR=admin --env BEDITA_ADMIN_PWD=admin --env BEDITA_API_KEY=1234567890 bedita/bedita:latest
  ```

  Set the values you want for `BEDITA_ADMIN_USR`, `BEDITA_ADMIN_PWD` and `BEDITA_API_KEY` and the version of docker image, for example `bedita/bedita:4.6.1`.

* run test with `yarn test`
* launch `yarn coverage` if you want a coverage report
