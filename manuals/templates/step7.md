In this step we will authenticate and identify users in our app.

Before we go ahead and start extending our app, we will add a few packages which will make our lives a bit less complex when it comes to authentication and users management.

First we will update our Meteor server and add few `Meteor` packages called `accounts-base` and `accounts-phone` which will give us the ability to verify a user using an SMS code, so run the following inside `api` directory:

    api$ meteor add accounts-base
    api$ meteor add npm-bcrypt
    api$ meteor add mys:accounts-phone

Be sure to keep your `Meteor` client script updated as well by running:

    $ npm run meteor-client:bundle

For the sake of debugging we gonna write an authentication settings file (`api/private/settings.json`) which might make our life easier, but once you're in production mode you *shouldn't* use this configuration:

{{{diff_step 7.2}}}

Now anytime we run our app we should provide it with a `settings.json`:

    api$ meteor run --settings private/settings.json

To make it simpler we can add a script called `api` script to the `package.json` which will start the Meteor server:

{{{diff_step 7.3}}}

> *NOTE*: If you would like to test the verification with a real phone number, `accounts-phone` provides an easy access for [twilio's API](https://www.twilio.com/), for more information see [accounts-phone's repo](https://github.com/okland/accounts-phone).

We will now apply the settings file we've just created so it can actually take effect:

{{{diff_step 7.4}}}

We also need to make sure we have the necessary declaration files for the package we've just added, so the compiler can recognize the new API:

    $ npm install --save-dev @types/meteor-accounts-phone

And we will reference from the `tsconfig` like so:

{{{diff_step 7.6}}}

## Using Meteor's Accounts System

Now, we will use the `Meteor`'s accounts system in the client. Our first use case would be delaying our app's bootstrap phase, until `Meteor`'s accounts system has done it's initialization.

`Meteor`'s accounts API exposes a method called `loggingIn` which indicates if the authentication flow is done, which we gonna use before bootstraping our application, to make sure we provide the client with the necessary views which are right to his current state:

{{{diff_step 7.7}}}

To make things easier, we're going to organize all authentication related functions into a single service which we're gonna call `PhoneService`:

{{{diff_step 7.8}}}

And we gonna require it in the app's `NgModule` so it can be recognized:

{{{diff_step 7.9}}}

The `PhoneService` is not only packed with whatever functionality we need, but it also wraps async callbacks with promises, which has several advantages:

- A promise is chainable, and provides an easy way to manage an async flow.
- A promise is wrapped with `zone`, which means the view will be updated automatically once the callback has been invoked.
- A promise can interface with an `Observable`.

Just so the `TypeScript` compiler will know how to digest it, we shall also specify the `accounts-phone` types in the client `tsconfig.json` as well:

{{{diff_step 7.10}}}

## UI

For authentication purposes, we gonna create the following flow in our app:

- login - The initial page in the authentication flow where the user fills up his phone number.
- verification - Verify a user's phone number by an SMS authentication.
- profile - Ask a user to pickup its name. Afterwards he will be promoted to the tabs page.

Let's start by creating the `LoginComponent`. In this component we will request an SMS verification right after a phone number has been entered:

{{{diff_step 7.11}}}

In short, once we press the login button, the `login` method is called and shows an alert dialog to confirm the action (See [reference](http://ionicframework.com/docs/v2/components/#alert)). If an error has occurred, the `handlerError` method is called and shows an alert dialog with the received error. If everything went as expected the `handleLogin` method is invoked, which will call the `login` method in the `PhoneService`.

Hopefully that the component's logic is clear now, let's move to the template:

{{{diff_step 7.12}}}

And add some style into it:

{{{diff_step 7.13}}}

And as usual, newly created components should be imported in the app's module:

{{{diff_step 7.14}}}

We will also need to identify if the user is logged in or not once the app is launched; If so - the user will be promoted directly to the `ChatsPage`, and if not, he will have to go through the `LoginPage` first:

{{{diff_step 7.15}}}

Let's proceed and implement the verification page. We will start by creating its component, called `VerificationPage`. Logic is pretty much the same as in the `LoginComponent`:

{{{diff_step 7.16}}}

{{{diff_step 7.17}}}

{{{diff_step 7.18}}}

And add it to the `NgModule`:

{{{diff_step 7.19}}}

Now we can make sure that anytime we login, we will be promoted to the `VerificationPage` right after:

{{{diff_step 7.20}}}

The last step in our authentication pattern is setting our profile. We will create a `Profile` interface so the compiler can recognize profile-data structures:

{{{diff_step 7.21}}}

As you can probably notice we also defined a constant for the default profile picture. We will need to make this resource available for use before proceeding. The referenced `svg` file can be copied directly from the `ionicons` NodeJS module using the following command:

    src/assets$ cp ../../node_modules/ionicons/dist/svg/ios-contact.svg default-profile-pic.svg

Now we can safely proceed to implementing the `ProfileComponent`:

{{{diff_step 7.23}}}

{{{diff_step 7.24}}}

{{{diff_step 7.25}}}

Let's redirect users who passed the verification stage to the newly created `ProfileComponent` like so:

{{{diff_step 7.26}}}

We will also need to import the `ProfileComponent` in the app's `NgModule` so it can be recognized:

{{{diff_step 7.27}}}

The core logic behind this component actually lies within the invocation of the `updateProfile`, a Meteor method implemented in our API which looks like so:

{{{diff_step 7.28}}}

## Adjusting the Messaging System

Now that our authentication flow is complete, we will need to edit the messages, so each user can be identified by each message sent. We will add a restriction in the `addMessage` method to see if a user is logged in, and we will bind its ID to the created message:

{{{diff_step 7.29}}}

This requires us to update the `Message` model as well so `TypeScript` will recognize the changes:

{{{diff_step 7.30}}}

Now we can determine if a message is ours or not in the `MessagePage` thanks to the `senderId` field we've just added:

{{{diff_step 7.31}}}

## Chat Options Menu

Now we're going to add the abilities to log-out and edit our profile as well, which are going to be presented to us using a popover. Let's show a [popover](http://ionicframework.com/docs/v2/components/#popovers) any time we press on the options icon in the top right corner of the chats view.

A popover, just like a page in our app, consists of a component, view, and style:

{{{diff_step 7.32}}}

{{{diff_step 7.33}}}

{{{diff_step 7.34}}}

It requires us to import it in the `NgModule` as well:

{{{diff_step 7.35}}}

Now we will implement the method in the `ChatsPage` which will initialize the `ChatsOptionsComponent` using a popover controller:

{{{diff_step 7.36}}}

The method is invoked thanks to the following binding in the chats view:

{{{diff_step 7.37}}}

As for now, once you click on the options icon in the chats view, the popover should appear in the middle of the screen. To fix it, we gonna add the extend our app's main stylesheet, since it can be potentially used as a component not just in the `ChatsPage`, but also in other pages as well:

{{{diff_step 7.38}}}
