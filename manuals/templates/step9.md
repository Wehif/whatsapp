In this step we gonna take care of the app's security and encapsulation, since we don't want the users to do whatever they want, and we don't want them to be able to see content which is irrelevant for them.

We gonna start by removing a `Meteor` package named `insecure`. This package provides the client with the ability to run collection mutation methods. This is a behavior we are not interested in since removing data and creating data should be done in the server and only after certain validations. Meteor includes this package by default only for development purposes and it should be removed once our app is ready for production. As said, we will remove this package by typing the following command:

    api$ meteor remove insecure

## Secure Mutations

Since we enabled restrictions to run certain operations on data-collections directly from the client, we will need to define a method on the server which will handle each of these. By calling these methods, we will be able to manipulate the data the way we want, but not directly. The first method we're going to take care of would be the `removeChat` method, which will handle, obviously, chat removals by given ID:

{{{diff_step 9.2}}}

We will carefully replace the removal method invocation in the `ChatsPage` with the method we've just defined:

{{{diff_step 9.3}}}

In the `MessagesPage` we have options icon presented as three periods at the right side of the navigation bar. We will now implement this option menu which should pop-over once clicked. We will start by implementing its corresponding component called `MessagesOptionsComponent`, along with its view-template, style-sheet, and necessary importations:

{{{diff_step 9.4}}}

{{{diff_step 9.5}}}

{{{diff_step 9.6}}}

{{{diff_step 9.7}}}

Now that the component is ready, we will implement the handler in the `MessagesPage` which will actually show it, using the `PopoverController`:

{{{diff_step 9.8}}}

And we will bind the handler for the view so any time we press on the `options` button the event will be trigger the handler:

{{{diff_step 9.9}}}

Right now all the chats are published to all the clients which is not very good for privacy, and it's inefficient since the entire data-base is being fetched automatically rather than fetching only the data which is necessary for the current view. This behavior occurs because of a `Meteor` package, which is installed by default for development purposes, called `autopublish`. To get rid of the auto-publishing behavior we will need to get rid of the `autopublish` package as well:

    api$ meteor remove autopublish

This requires us to explicitly define our publications. We will start with the `users` publication which will be used in the `NewChatComponent` to fetch all the users who we can potentially chat with:

{{{diff_step 9.11}}}

The second publication we're going to implement would be the `messages` publication which will be used in the `MessagesPage`:

{{{diff_step 9.12}}}

As you see, all our publications so far are only focused on fetching data from a single collection. We will now add the [publish-composite](https://atmospherejs.com/reywood/publish-composite) package which will help us implement joined collection publications:

    api$ meteor add reywood:publish-composite

We will install the package's declarations as well so the compiler can recognize the extensions made in `Meteor`'s API:

    $ npm install --save-dev @types/meteor-publish-composite

And we will import the declarations by adding the following field in the `tsconfig` file:

{{{diff_step 9.15}}}

Now we will implement our first composite-publication, called `chats`. Why exactly does the `chats` publication has to count on multiple collections? That's because we're relying on multiple collections when presenting the data in the `ChatsPage`:

- **ChatsCollection** - Used to retrieve the actual information for each chat.
- **MessagesCollection** - Used to retrieve the last message for the corresponding chat.
- **UsersCollection** - Used to retrieve the receiver's information for the corresponding chat.

To implement this composite publication we will use the `Meteor.publishComposite` method:

{{{diff_step 9.16}}}

The `chats` publication is made out of several nodes, which are structured according to the list above.

We finished with all the necessary publications for now, all is left to do is using them. The usages of these publications are called `subscriptions`, so whenever we subscribe to a publication, we will fetch the data exported by it, and then we can run queries of this data in our client, as we desire.

The first subscription we're going to make would be the `users` subscription in the `NewChatComponent`, so whenever we open the dialog a subscription should be made:

{{{diff_step 9.17}}}

The second subscription we're going to define would be the `chats` subscription in the `ChatsPage`, this way we will have the necessary data to work with when presenting the users we're chatting with:

{{{diff_step 9.18}}}

The `messages` publication is responsible for bringing all the relevant messages for a certain chat. Unlike the other two publications, this publication is actually parameterized and it requires us to pass a chat id during subscription. Let's subscribe to the `messages` publication in the `MessagesPage`, and pass the current active chat ID provided to us by the navigation parameters:

{{{diff_step 9.19}}}
