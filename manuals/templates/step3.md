To help you get started with `RxJS`, we recommend you to read [this post](http://blog.angular-university.io/functional-reactive-programming-for-angular-2-developers-rxjs-and-observables/).

## TL;DR

`RxJS` is a library that allows us to easily create and manipulate streams of events and data. This makes complex asynchronous development much easier to handle and understand. `Angular 2` adopted `RxJS` as a dependency, and uses it to manage its stream of data and flow of actions.

## Quick Reference

In this tutorial, we will be using fundamental `RxJS` operators, as listed below:

- **map** - Transform values of the observable (into another observable). Common use cases are converting, parsing, adding new fields etc.

- **filter** - Filters values emitted by the observable, and continue the flow only with the values which passed the filter handler.

- **startWith** - Sets the initial value for the previous operation before proceeding.

- **flatMap** - Useful when we want to resolve a set of observables.

`RxJS` offers plenty of operators, which can ease the development process. A more detailed explanation can be found in the [RxJS book](http://xgrommx.github.io/rx-book/index.html).

## Meteor-RxJS

`Angular 2` uses [ngrx](https://github.com/ngrx) package, and supports `Observable` data sources (For example, using `ngFor` directive).

`meteor-rxjs` wraps `Meteor`'s basic functionality and exposes `RxJS` interfaces which can be used to manipulate reactive data sources; The `meteor-rxjs` package will be used vastly further in this tutorial, so as we go further, you'll probably get a better perception for it.

## More References

- [RxJS Book](http://xgrommx.github.io/rx-book/index.html)
- [Meteor-RxJS API Documentation](api/meteor-rxjs/latest/MeteorObservable)
- [RxJS API Documentation](http://reactivex.io/rxjs/)
- [meteor-rxjs @ GitHub](https://github.com/Urigo/meteor-rxjs)
