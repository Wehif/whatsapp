import { Chats } from './collections/chats';
import { Messages } from './collections/messages';
import { Events } from './collections/events';
import { MessageType, Profile, Event } from './models';
import { check, Match } from 'meteor/check';

const nonEmptyString = Match.Where((str) => {
  check(str, String);
  return str.length > 0;
});

Meteor.methods({
  addChat(receiverId: string): void {
    if (!this.userId) {
      throw new Meteor.Error('unauthorized',
        'User must be logged-in to create a new chat');
    }

    check(receiverId, nonEmptyString);

    if (receiverId === this.userId) {
      throw new Meteor.Error('illegal-receiver',
        'Receiver must be different than the current logged in user');
    }

    const chatExists = !!Chats.collection.find({
      memberIds: { $all: [this.userId, receiverId] }
    }).count();

    if (chatExists) {
      throw new Meteor.Error('chat-exists',
        'Chat already exists');
    }

    const chat = {
      memberIds: [this.userId, receiverId]
    };

    Chats.insert(chat);
  },
  removeChat(chatId: string): void {
    if (!this.userId) {
      throw new Meteor.Error('unauthorized',
        'User must be logged-in to remove chat');
    }

    check(chatId, nonEmptyString);

    const chatExists = !!Chats.collection.find(chatId).count();

    if (!chatExists) {
      throw new Meteor.Error('chat-not-exists',
        'Chat doesn\'t exist');
    }

    Chats.remove(chatId);
  },
  updateProfile(profile: Profile): void {
    if (!this.userId) throw new Meteor.Error('unauthorized',
      'User must be logged-in to create a new chat');

    check(profile, {
      name: nonEmptyString,
      pictureId: Match.Maybe(nonEmptyString),
      description: Match.Maybe(nonEmptyString)
    });

    Meteor.users.update(this.userId, {
      $set: {profile}
    });
  },
  addMessage(type: MessageType, chatId: string, content: string) {
    if (!this.userId) throw new Meteor.Error('unauthorized',
      'User must be logged-in to create a new chat');

    check(type, Match.OneOf(String, [ MessageType.TEXT, MessageType.LOCATION ]));
    check(chatId, nonEmptyString);
    check(content, nonEmptyString);

    const chatExists = !!Chats.collection.find(chatId).count();

    if (!chatExists) {
      throw new Meteor.Error('chat-not-exists',
        'Chat doesn\'t exist');
    }

    return {
      messageId: Messages.collection.insert({
        chatId: chatId,
        senderId: this.userId,
        content: content,
        createdAt: new Date(),
        type: type
      })
    };
  },
  countMessages(): number {
    return Messages.collection.find().count();
  },
  addEvent(event: Event): void {
    if (!this.userId) {
      throw new Meteor.Error('unauthorized',
        'User must be logged-in to create a new event');
    }

    check(event.creatorId, nonEmptyString);
    check(event.name, nonEmptyString);

    if (event.creatorId === this.userId) {
       Events.insert(event);
    }
  },
  updateEvent(event: Event): void {
    if (!this.userId) throw new Meteor.Error('unauthorized',
        'User must be logged-in to update event');

    check(event.name, nonEmptyString);

    if (event.creatorId === this.userId) {
      Events.update({_id : event._id},{ $set: {name : event.name, description: event.description, pictureId: event.pictureId, picture: event.picture}});
    }
  }
});
