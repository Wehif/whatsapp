## Lazy-Loading

In this step, we will implement a lazy-loading mechanism in the `MessagesPage`. Lazy loading means that only the necessary data will be loaded once we're promoted to the corresponding view, and it will keep loading, but gradually. In the `MessagesPage` case, we will only be provided with several messages once we enter the view, enough messages to fill all of it, and as we scroll up, we will provided with more messages. This way we can have a smooth experience, without the cost of fetching the entire messages collection. We will start by limiting our `messages` subscription into 30 documents:

{{{diff_step 10.1}}}

As we said, we will be fetching more and more messages gradually, so we will need to have a counter in the component which will tell us the number of the batch we would like to fetch in our next scroll:

{{{diff_step 10.2}}}

By now, whether you noticed or not, we have some sort of a limitation which we have to solve. Let's say we've fetched all the messages available for the current chat, and we keep scrolling up, the component will keep attempting to fetch more messages, but it doesn't know that it reached the limit. Because of that, we will need to know the total number of messages so we will know when to stop the lazy-loading mechanism. To solve this issue, we will begin with implementing a method which will retrieve the number of total messages for a provided chat:

{{{diff_step 10.3}}}

Now, whenever we fetch a new messages-batch we will check if we reached the total messages limit, and if so, we will stop listening to the scroll event:

{{{diff_step 10.4}}}

## Filter

Now we're gonna implement the a search-bar, in the `NewChatComponent`.

Let's start by implementing the logic using `RxJS`. We will use a `BehaviorSubject` which will store the search pattern entered in the search bar, and we will be able to detect changes in its value using the `Observable` API; So whenever the search pattern is being changed, we will update the users list by re-subscribing to the `users` subscription:

{{{diff_step 10.5}}}

Note how we used the `debounce` method to prevent subscription spamming. Let's add the template for the search-bar in the `NewChat` view, and bind it to the corresponding data-models and methods in the component:

{{{diff_step 10.6}}}

Now we will modify the `users` subscription to accept the search-pattern, which will be used as a filter for the result-set;

{{{diff_step 10.7}}}
