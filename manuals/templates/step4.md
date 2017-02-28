Now that we have the initial chats layout and its component, we will take it a step further by providing the chats data from a server instead of having it locally. In this step we will be implementing the API server and we will do so using `Meteor`.

First make sure that you have `Meteor` installed. If not, install it by typing the following command:

    $ curl https://install.meteor.com/ | sh

We will start by creating the `Meteor` project which will be placed inside the `api` dir:

    $ meteor create api

A `Meteor` project will contain the following dirs by default:

- client - A dir containing all client scripts.
- server - A dir containing all server scripts.

These scripts should be loaded automatically by their alphabetic order on their belonging platform, e.g. a script defined under the client dir should be loaded by `Meteor` only on the client. A script defined in neither of these folders should be loaded on both. Since we're using `Ionic`'s CLI for the client code we have no need in the client dir in the `Meteor` project. Let's get rid of it:

    api$ rm -rf client

Since we don't wanna have duplicate resources between the client and the server, we will remove the `package.json` file in the `api` dir:

    api$ remove package.json

And we will add a symbolic link between the client's `node_modules` and client `node_modules`:

    api$ ln -s ../node_modules

Since we will be writing our app using `Typescript`, we will need to support it in our `Meteor` project as well, especially when the client and the server share some of the script files. To add this support we will add the following package to our `Meteor` project:

    api$ meteor add barbatus:typescript

We will also need to add a configuration file for the `TypeScript` compiler in the `Meteor` server, which is derived from our `Ionic` app's config:

{{{diff_step 4.6}}}

Since we're using `TypeScript`, let's change the main server file extension from `.js` to `.ts`:

    api$ mv server/main.js server/main.ts

Now we will need to create a symbolic link to the declaration file located in `src/declarations.d.ts`. This way we can share external `TypeScript` declarations in both client and server. To create the desired symbolic link, simply type the following command in the command line:

    api$ ln -s ../src/declarations.d.ts

The following dependencies are required to be installed so our server can function properly:

    $ npm install --save babel-runtime
    $ npm install --save meteor-node-stubs

Now we'll have to move our models interfaces to the `api` dir so the server will have access to them as well:

    $ mv src/models.ts api/server/models.ts

This requires us to update its reference in the declarations file as well:

{{{diff_step 4.11}}}

We will also install the `meteor-rxjs` package so we can define collections and data streams and TypeScript definitions for Meteor:

    $ npm install --save meteor-rxjs
    $ npm install --save-dev @types/meteor

## Collections

This collection is actually a reference to a [MongoDB](http://mongodb.com) collection, and it is provided to us by a `Meteor` package called [Minimongo](https://guide.meteor.com/collections.html), and it shares almost the same API as a native `MongoDB` collection. In this tutorial we will be wrapping our collections using `RxJS`'s `Observables`, which is available to us thanks to [meteor-rxjs](http://npmjs.com/package/meteor-rxjs).

Our initial collections are gonna be the chats and messages collection, the one is going to store some chats-models, and the other is going to store messages-models:

{{{diff_step 4.13}}}

{{{diff_step 4.14}}}

We chose to create a dedicated module for each collection, because in the near future there might be more logic added into each one of them. To make importation convenient, we will export all collections from a single file:

{{{diff_step 4.15}}}

Now instead of requiring each collection individually, we can just require them from the `index.ts` file.

## Data fixtures

Since we have real collections now, and not dummy ones, we will need to fill them up with some data in case they are empty, so we can test our application properly. Let's create our data fixtures in the server:

{{{diff_step 4.16}}}

> This behavior is **not** recommended and should be removed once we're ready for production. A conditioned environment variable may also be a great solution

Note how we use the `.collection` property to get the actual `Mongo.Collection` instance. In the `Meteor` server we want to avoid the usage of observables since it uses `fibers`. More information about fibers can be fond [here](https://www.npmjs.com/package/fibers).

## Preparing the Meteor client

In order to connect to the `Meteor` server, we need a client which is capable of doing so. To create a `Meteor` client, we will use a bundler called [meteor-client-bundler](https://github.com/Urigo/meteor-client-bundler). This bundler, bundles all the necessary `Meteor` client script files into a single module. This is very useful when we want to interact with [Atmosphere](https://atmospherejs.com/) packages integrate them our client. To install `meteor-client-bundler`, run the following command:

    $ sudo npm install -g meteor-client-bundler

Now we'll add a bundling script to the `package.json` as followed:

{{{diff_step 4.17}}}

To execute it, simply run:

    $ npm run meteor-client:bundle

This will generate a file called `meteor-client.js` under the `node_modules` dir, which needs to be imported in our application like so:

{{{diff_step 4.18}}}

> By default, the client will assume that the server is running at `localhost:3000`. If you'd like to change that, you can simply specify a `--url` option in the `NPM` script. Further information can be found [here](https://github.com/Urigo/meteor-client-bundler).

The client we've just imported gives us the ability to interact with the server. Let's replace the local chats-data with a data which is fetched from the `Meteor` server:

{{{diff_step 4.19}}}

And re-implement the `removeChat` method using the actual `Meteor` collection:

{{{diff_step 4.20}}}
