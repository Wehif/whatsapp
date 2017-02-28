import { MongoObservable } from 'meteor-rxjs';
import { Event } from '../models';

export const Events = new MongoObservable.Collection<Event>('events');
