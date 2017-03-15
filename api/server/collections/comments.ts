import { MongoObservable } from 'meteor-rxjs';
import { Comment } from '../models';

export const Comments = new MongoObservable.Collection<Comment>('comments');
