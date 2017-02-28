Our next step is about adding the ability to create new chats. We have the `ChatsPage` and the authentication system, but we need to hook them up some how. Let's define the initial `User` schema which will be used to retrieve its relevant information in our application:

{{{diff_step 8.1}}}

`Meteor` comes with a built-in users collection, defined as `Meteor.users`, but since we're using `Observables` vastly, we will wrap our collection with one:

{{{diff_step 8.2}}}

For accessibility, we're gonna export the collection from the `index` file as well:

{{{diff_step 8.3}}}

## Chats Creation

We will be using `Ionic`'s modal dialog to show the chat creation view. The first thing we're gonna do would be implementing the component itself, along with its view and stylesheet:

{{{diff_step 8.4}}}

{{{diff_step 8.5}}}

{{{diff_step 8.6}}}

The dialog should contain a list of all the users whose chat does not exist yet. Once we click on one of these users we should be demoted to the chats view with the new chat we've just created.

The dialog should be revealed whenever we click on one of the options in the options pop-over, therefore, we will implement the necessary handler:

{{{diff_step 8.7}}}

And bind it to the `click` event:

{{{diff_step 8.8}}}

We will import the newly created component in the app's `NgModule` as well, so it can be recognized properly:

{{{diff_step 8.9}}}

We're also required to implement the appropriate `Meteor` method which will be the actually handler for feeding our data-base with newly created chats:

{{{diff_step 8.10}}}

As you can see, a chat is inserted with an additional `memberIds` field. Whenever we have such a change we should update the model's schema accordingly, in this case we're talking about adding the `memberIds` field, like so:

{{{diff_step 8.11}}}

Thanks to our new-chat dialog, we can create chats dynamically with no need in initial fabrication. Let's replace the chats fabrication with users fabrication in the Meteor server:

{{{diff_step 8.12}}}

Since we've changed the data fabrication method, the chat's title and picture are not hard-coded anymore, therefore, any additional data should be fetched in the components themselves:

{{{diff_step 8.13}}}

Now we want our changes to take effect. We will reset the database so next time we run our `Meteor` server the users will be fabricated. To reset the database, first make sure the `Meteor` server is stopped , and then type the following command:

    api$ meteor reset

Now, as soon as you start the server, new users should be fabricated and inserted into the database:

    $ npm run api
