import { Component, OnInit } from '@angular/core';
import { Events, Users, Pictures } from 'api/collections';
import { User, Event } from 'api/models';
import { AlertController, NavController, NavParams } from 'ionic-angular';
import { Observable, BehaviorSubject } from 'rxjs';
import { PictureService } from '../../services/picture';
import { EventsPage } from "./events";

@Component({
  selector: 'event',
  templateUrl: 'event.html'
})
export class EventPage implements OnInit {
  searchPattern: BehaviorSubject<any>;
  creatorId: string;
  users: Observable<User[]>;
  event;
  picture: string;
  key: string;

  constructor(
    private alertCtrl: AlertController,
    private pictureService: PictureService,
    private navCtrl: NavController,
    private navParams: NavParams
  ) {
    this.key = "";
  }

  ngOnInit(): void {
    this.key = this.navParams.get('eventKey');
    console.log("Hey it's from eventPage with id:");
    console.log(this.key);
    this.event = Events.findOne({_id: this.key});
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

  getPic(pictureId): string {
    return Pictures.getPictureUrl(pictureId);
  }
}
