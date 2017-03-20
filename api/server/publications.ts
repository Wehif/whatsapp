import { User, Message, Chat, Picture, Comment, Event } from './models';
import { Users } from './collections/users';
import { Messages } from './collections/messages';
import { Chats } from './collections/chats';
import { Pictures } from './collections/pictures';
import { Events } from './collections/events';
import { Comments } from './collections/comments';

Meteor.publishComposite('users', function(
  pattern: string
): PublishCompositeConfig<User> {
  if (!this.userId) {
    return;
  }

  let selector = {};

  if (pattern) {
    selector = {
      'profile.name': { $regex: pattern, $options: 'i' }
    };
  }

  return {
    find: () => {
      return Users.collection.find(selector, {
        fields: { profile: 1 },
        limit: 15
      });
    },

    children: [
      <PublishCompositeConfig1<User, Picture>> {
        find: (user) => {
          return Pictures.collection.find(user.profile.pictureId, {
            fields: { url: 1 }
          });
        }
      }
    ]
  };
});

Meteor.publish('messages', function(
  chatId: string,
  messagesBatchCounter: number): Mongo.Cursor<Message> {
  if (!this.userId || !chatId) {
    return;
  }

  return Messages.collection.find({
    chatId
  }, {
    sort: { createdAt: -1 },
    limit: 30 * messagesBatchCounter
  });
});

Meteor.publishComposite('chats', function(): PublishCompositeConfig<Chat> {
  if (!this.userId) {
    return;
  }

  return {
    find: () => {
      return Chats.collection.find({ memberIds: this.userId });
    },

    children: [
      <PublishCompositeConfig1<Chat, Message>> {
        find: (chat) => {
          return Messages.collection.find({ chatId: chat._id }, {
            sort: { createdAt: -1 },
            limit: 1
          });
        }
      },
      <PublishCompositeConfig1<Chat, User>> {
        find: (chat) => {
          return Users.collection.find({
            _id: { $in: chat.memberIds }
          }, {
            fields: { profile: 1 }
          });
        },
        children: [
          <PublishCompositeConfig2<Chat, User, Picture>> {
            find: (user, chat) => {
              return Pictures.collection.find(user.profile.pictureId, {
                fields: { url: 1 }
              });
            }
          }
        ]
      }
    ]
  };
});

Meteor.publish('events', function() {
  if (!this.userId) {
    return;
  }
      return Events.collection.find();
});

Meteor.publish('myEvents', function() {
  if (!this.userId) {
    return;
  }
  let todayDate = new Date().toISOString();
      return Events.collection.find({ dateEnd: { $gte: todayDate}, subscribers: this.userId});
});

Meteor.publish('myEventsPrev', function() {
  if (!this.userId) {
    return;
  }
  let todayDate = new Date().toISOString();
      return Events.collection.find({ dateEnd: { $lt: todayDate}, subscribers: this.userId});
});

Meteor.publishComposite('eventComments', function(eventId:string): PublishCompositeConfig<Comment> {
  if (!this.userId) {
    return;
  }

  return {
    find: () => {
      return Comments.collection.find({ docId: eventId });
    },

    children: [
      <PublishCompositeConfig1<Comment, User>> {
        find: (comment) => {
          return Users.collection.find({
            _id: comment.creatorId
          }, {
            fields: { profile: 1 }
          });
        },
        children: [
          <PublishCompositeConfig2<Comment, User, Picture>> {
            find: (user, comment) => {
              return Pictures.collection.find(user.profile.pictureId, {
                fields: { url: 1 }
              });
            }
          }
        ]
      }
    ]
  };
});

Meteor.publishComposite('event', function(eventId:string): PublishCompositeConfig<Event> {
  if (!this.userId) {
    return;
  }

  return {
    find: () => {
      return Events.collection.find({ _id: eventId },{limit:1});
    },

    children: [
      <PublishCompositeConfig1<Event, User>> {
        find: (event) => {
          return Users.collection.find({
            _id: event.creatorId
          }, {
            fields: { profile: 1 }
          });
        },
        children: [
          <PublishCompositeConfig2<Event, User, Picture>> {
            find: (user, event) => {
              return Pictures.collection.find(user.profile.pictureId, {
                fields: { url: 1 }
              });
            }
          }
        ]
      }
    ]
  };
});

Meteor.publish('user', function () {
  if (!this.userId) {
    return;
  }

  const profile = Users.findOne(this.userId).profile || {};

  return Pictures.collection.find({
    _id: profile.pictureId
  });
});

Meteor.publishComposite('userprofile', function(profileId:string): PublishCompositeConfig<User> {
  if (!this.userId) {
    return;
  }
  return {
    find: () => {
      return Users.collection.find({ _id: profileId },{
        fields: { profile: 1 }
      });
    },

    children: [
      <PublishCompositeConfig1<User, Picture>> {
        find: (user) => {
          return Pictures.collection.find(user.profile.pictureId, {
            fields: { url: 1 }
          });
        }
      }
    ]
  };
});

