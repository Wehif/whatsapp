Both [Meteor](https://meteor.com) and [Ionic](https://ionicframework.com) took their platform to the next level in tooling. They both provide CLI interfaces and build tools which will help you build a mobile-application.

In this post we will focus on the `Ionic` CLI; We will use it to serve the client and build the our project using [Cordova](https://cordova.apache.org/), and we will use `Meteor` as a platform for our server, so we will be able to use [Mongo collections](https://docs.meteor.com/api/collections.html) and [subscriptions](https://docs.meteor.com/api/pubsub.html).

The only pre-requirements for this tutorial is for you to have `Node.JS` version 5 or above installed. If you haven't already installed it, you can download it from its official website over [here](https://nodejs.org/en/).

We will start by installing Ionic and `Cordova` globally:

    $ npm install -g ionic cordova

We will create our `Whatsapp`-clone using the following command:

    $ ionic start whatsapp --v2

To start our app, simply type:

    $ ionic serve

> For more information on how to run an Ionic-app on a mobile device, see the following link: https://ionicframework.com/docs/v2/getting-started/installation/.

`Ionic 2` apps are written using [Angular 2](https://angular.io). Although `Angular 2` apps can be created using plain JavaScript, it is recommended to write them using [Typescript](https://typescriptlang.org), for 2 reasons:

- It prevents runtime errors.
- Dependency injection is done automatically based on the provided data-types.

In order to apply `TypeScript`, `Ionic`'s build system is built on top of a module bundler called [Rollup](http://rollupjs.org/).

In this tutorial we will use a custom build-config, and replace `Rollup` with [Webpack](https://webpack.github.io). Both module-bundlers are great solutions for building our app, but `Webpack` provides us with some extra features like aliases and custom module-loaders which are crucial ingredients for our app to work properly.

## Ionic 2 + Webpack

The first thing we gonna do would be telling Ionic that we're using `Webpack` as our module-bundler. To specify it, add the following field in the `package.json` file:

{{{diff_step 1.1}}}

Ionic provides us with a sample `Webpack` config file that we can extend later on, and it's located under the path `node_modules/@ionic/app-scripts/config/webpack.config.js`. We will copy it to a newly created `config` dir using the following command:

    $ cp node_modules/@ionic/app-scripts/config/webpack.config.js .

The configuration file should look like so:

{{{diff_step 1.2}}}

As we said earlier, this is only a base for our config. We would also like to add the following abilities while bundling our project:

- The ability to load external `TypeScript` modules without any issues.
- Have an alias for our `Meteor` server under the `api` dir (Which will be created later in).
- Be able to import `Meteor` packages and `Cordova` plugins.

To achieve these abilities, this is how our extension should look like:

{{{diff_step 1.3}}}

In addition to the alias we've just created, we also need to tell the `TypesScript` compiler to include the `api` dir during the compilation process:

{{{diff_step 1.4}}}

And we will need to install the following dependencies so the `Webpack` config can be registered properly:

    $ npm install --save-dev typescript-extends

## TypeScript Configuration

Now, we need to make some modifications for the `TypeScript` config so we can load `Meteor` as an external dependency; One of the changes include the specification for `CommonJS`:

{{{diff_step 1.6}}}

This configuration requires us to install the declaration files specified under the `types` field:

    $ npm install --save-dev @types/underscore
    $ npm install --save-dev meteor-typings

## Trying It Out

By this point, you can run `ionic serve` and test how our application works with the new module bundler we've just configured. You might encounter the following warnings when launching the app in the browser:

    Native: tried calling StatusBar.styleDefault, but Cordova is not available. Make sure to include cordova.js or run in a device/simulator
    Native: tried calling Splashscreen.hide, but Cordova is not available. Make sure to include cordova.js or run in a device/simulator

This is caused due to expectation to be run in a mobile environment. To fix this warning, simply check if the current platform supports `Cordova` before calling any methods related to it:

{{{diff_step 1.8}}}
