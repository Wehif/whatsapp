import { Component, OnInit } from '@angular/core';
import { Chat, Profile, User } from 'api/models';
import { Chats, Users, Pictures } from 'api/collections';
import { AlertController, NavController, NavParams } from 'ionic-angular';
import { MeteorObservable } from 'meteor-rxjs';
import { TabsPage } from '../tabs/tabs';
import { PictureService } from '../../services/picture';
import { MessagesPage } from '../messages/messages';

@Component({
  selector: 'showprofile',
  templateUrl: 'showprofile.html'
})
export class ShowProfilePage implements OnInit {
  picture: string;
  profile;
  key: string;
  senderId: string;

  constructor(
    private alertCtrl: AlertController,
    private navCtrl: NavController,
    private pictureService: PictureService,
    private navParams: NavParams
  ) {
    this.key = "";
    this.senderId = Meteor.userId();
    }

  ngOnInit(): void {
    this.profile = {
      name: '',
      description: ''
    };
    this.key = this.navParams.get('profileKey');
																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																							
    MeteorObservable.subscribe('userprofile', this.key).subscribe(() => {
      MeteorObservable.autorun().subscribe(() => {
        this.profile = this.findProfile();
      });
    });

    MeteorObservable.subscribe('chats').subscribe(() => {
      MeteorObservable.autorun().subscribe(() => {
        Chats.find();
      });
    });
    
  }

  findProfile(): Profile {
    let userProfile = Users.findOne({_id: this.key}).profile;
    this.picture = Pictures.getPictureUrl(userProfile.pictureId);
    return userProfile
  }

  sendMessage(): void {
    let chat = Chats.findOne({ memberIds: {$all: [this.senderId, this.key] } });
    console.log(chat);
    console.log(this.senderId);
    console.log(this.key);
    if (!chat) {
      MeteorObservable.call('addChat', this.key).subscribe({
        next: () => {
        },
        error: (e: Error) => {
          this.handleError(e);
        }
      });
      chat = Chats.findOne({ memberIds: {$all: [this.senderId, this.key] } });
      console.log(chat);
    }


    if (this.profile) {
      chat.title = this.profile.name;
      chat.picture = this.picture;
    }
    
    this.navCtrl.push(MessagesPage, {chat});
  }

  handleError(e: Error): void {
    console.error(e);

    const alert = this.alertCtrl.create({
      title: 'Oops!',
      message: e.message,
      buttons: ['OK']
    });

    alert.present();
  }
}
