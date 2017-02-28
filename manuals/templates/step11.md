In this step we will add the ability to send the current location in [Google Maps](https://www.google.com/maps/).

{{{diff_step 11.1}}}

## Geo Location

To get the devices location (aka `geo-location`) we will install a `Cordova` plug-in called `cordova-plugin-geolocation` which will provide us with these abilities:

## Angular 2 Google Maps

Since the location is going to be presented with `Google Maps`, we will install a package which will help up interact with it in `Angular 2`:

    $ npm install --save angular2-google-maps

Before you import the installed package to the app's `NgModule` be sure to generate an API key. An API key is a code passed in by computer programs calling an API to identify the calling program, its developer, or its user to the Web site. To generate an API key go to [Google Maps API documentation page](https://developers.google.com/maps/documentation/javascript/get-api-key) and follow the instructions. **Each app should have it's own API key**, as for now we can just use an API key we generated for the sake of this tutorial, but once you are ready for production, **replace the API key in the script below**:

{{{diff_step 11.3}}}

## Attachments Menu

Before we proceed any further, we will add a new message type to our schema, so we can differentiate between a text message and a location message:

{{{diff_step 11.4}}}

We want the user to be able to send a location message through an attachments menu in the `MessagesPage`, so let's implement the initial `MessagesAttachmentsComponent`, and as we go through, we will start filling it up:

{{{diff_step 11.5}}}

{{{diff_step 11.6}}}

{{{diff_step 11.7}}}

{{{diff_step 11.8}}}

We will add a generic style-sheet for the attachments menu since it can also use us in the future:

{{{diff_step 11.9}}}

Now we will add a handler in the `MessagesPage` which will open the newly created menu, and we will bind it to the view:

{{{diff_step 11.10}}}

{{{diff_step 11.11}}}

## Sending Location

A location is a composition of longitude, latitude and an altitude, or in short: `long, lat, alt`. Let's define a new `Location` model which will represent the mentioned schema:

{{{diff_step 11.12}}}

Up next, would be implementing the actual component which will handle geo-location sharing:

{{{diff_step 11.13}}}

Basically, what this component does is refreshing the current geo-location at a specific refresh rate. Note that in order to fetch the geo-location we use `Geolocation's` API, but behind the scene it uses ``cordova-plugin-geolocation`. The `sendLocation` method dismisses the view and returns the calculated geo-location. Now let's added the component's corresponding view:

{{{diff_step 11.14}}}

The `sebm-google-map` is the component which represents the map itself, and we provide it with `lat`, `lng` and `zoom`, so the map can be focused on the current geo-location. If you'll notice, we also used the `sebm-google-map-marker` component with the same data-models, so the marker will be shown right in the center of the map.

Now we will add some `CSS` to make sure the map is visible:

{{{diff_step 11.15}}}

And we will import the component:

{{{diff_step 11.16}}}

The component is ready. The only thing left to do would be revealing it. So we will add the appropriate handler in the `MessagesAttachmentsComponent`:

{{{diff_step 11.17}}}

And we will bind it to its view:

{{{diff_step 11.18}}}

Now we will implement a new method in the `MessagesPage`, called `sendLocationMessage`, which will create a string representation of the current geo-location and send it to the server:

{{{diff_step 11.19}}}

This requires us to update the `addMessage` method in the server so it can support location typed messages:

{{{diff_step 11.20}}}

## Viewing Location Messages

The infrastructure is ready, but we can't yet see the message, therefore, we will need to add support for location messages in the `MessagesPage` view:

{{{diff_step 11.21}}}

These additions looks pretty similar to the `LocationMessage` since they are based on the same core components.

We will now add a method which can parse a string representation of the location into an actual `JSON`:

{{{diff_step 11.22}}}

And we will make some final adjustments for the view so the map can be presented properly:

{{{diff_step 11.23}}}
