import { Meteor } from 'meteor/meteor';
import { Chats } from './collections/chats';
import { Messages } from './collections/messages';
import * as moment from 'moment';
import { MessageType, Picture } from './models';
import { Accounts } from 'meteor/accounts-base';
import { Users } from './collections/users';

Meteor.startup(() => {
  if (Meteor.settings) {
    Object.assign(Accounts._options, Meteor.settings['accounts-phone']);
    SMS.twilio = Meteor.settings['twilio'];
  }

  if (Users.collection.find().count() > 0) {
    return;
  }

  let picture = importPictureFromUrl({
    name: 'man1.jpg',
    url: 'https://randomuser.me/api/portraits/men/1.jpg'
  });

  Accounts.createUserWithPhone({
    phone: '+972540000001',
    profile: {
      name: 'Ethan Gonzalez',
      pictureId: picture._id,
      description: 'like swim and ropejumping'
    }
  });

  picture = importPictureFromUrl({
    name: 'lego1.jpg',
    url: 'https://randomuser.me/api/portraits/lego/1.jpg'
  });

  Accounts.createUserWithPhone({
    phone: '+972540000002',
    profile: {
      name: 'Bryan Wallace',
      pictureId: picture._id,
      description: 'like go for a walk'
    }
  });

  picture = importPictureFromUrl({
    name: 'woman1.jpg',
    url: 'https://randomuser.me/api/portraits/women/1.jpg'
  });

  Accounts.createUserWithPhone({
    phone: '+972540000003',
    profile: {
      name: 'Avery Stewart',
      pictureId: picture._id,
      description: 'Noooo! Nooo!'
    }
  });

  picture = importPictureFromUrl({
    name: 'woman2.jpg',
    url: 'https://randomuser.me/api/portraits/women/2.jpg'
  });

  Accounts.createUserWithPhone({
    phone: '+972540000004',
    profile: {
      name: 'Katie Peterson',
      pictureId: picture._id,
      description: 'like dance with the devil'
    }
  });

  picture = importPictureFromUrl({
    name: 'man2.jpg',
    url: 'https://randomuser.me/api/portraits/men/2.jpg'
  });

  Accounts.createUserWithPhone({
    phone: '+972540000005',
    profile: {
      name: 'Ray Edwards',
      description: 'i listen AC/DC, Breaking Benjamin and other rock bands!',
      pictureId: picture._id
    }
  });
});

function importPictureFromUrl(options: { name: string, url: string }): Picture {
  const description = { name: options.name };

  return Meteor.call('ufsImportURL', options.url, description, 'pictures');
}
