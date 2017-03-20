import { Component, OnInit } from '@angular/core';
import { Profile, User } from 'api/models';
import { Users, Pictures } from 'api/collections';
import { AlertController, NavController, NavParams } from 'ionic-angular';
import { MeteorObservable } from 'meteor-rxjs';
import { TabsPage } from '../tabs/tabs';
import { PictureService } from '../../services/picture';

@Component({
  selector: 'showprofile',
  templateUrl: 'showprofile.html'
})
export class ShowProfilePage implements OnInit {
  picture: string;
  profile: Profile;
  key: string;

  constructor(
    private alertCtrl: AlertController,
    private navCtrl: NavController,
    private pictureService: PictureService,
    private navParams: NavParams
  ) {
    this.key = "";
    }

  ngOnInit(): void {
    this.key = this.navParams.get('profileKey');
    this.profile = Users.findOne({_id: this.key}) || {
      name: '',
      description: ''
    };

    MeteorObservable.subscribe('user').subscribe(() => {
      this.picture = Pictures.getPictureUrl(this.profile.pictureId);
    });
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
