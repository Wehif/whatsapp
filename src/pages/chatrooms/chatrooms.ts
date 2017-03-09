import { Component, OnInit } from '@angular/core';
import { AlertController, NavController } from 'ionic-angular';
import { MeteorObservable } from 'meteor-rxjs';
import { PictureService } from '../../services/picture';
import { Pictures } from 'api/collections';

@Component({
  selector: 'chatrooms',
  templateUrl: 'chatrooms.html'
})
export class ChatroomsPage implements OnInit {
  //

  constructor(
    private alertCtrl: AlertController,
    private navCtrl: NavController,
    private pictureService: PictureService
  ) {}

  ngOnInit(): void {
    //
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
