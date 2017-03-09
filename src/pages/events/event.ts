import { Component, OnInit } from '@angular/core';
import { Events, Users, Pictures } from 'api/collections';
import { User, Event } from 'api/models';
import { AlertController, NavController, NavParams, ModalController } from 'ionic-angular';
import { Observable, BehaviorSubject } from 'rxjs';
import { PictureService } from '../../services/picture';
import { EventsPage } from "./events";
import { EditEventComponent } from './edit-event';
import { MeteorObservable } from 'meteor-rxjs';

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
  profileId: string;

  constructor(
    private alertCtrl: AlertController,
    private pictureService: PictureService,
    private navCtrl: NavController,
    private modalCtrl: ModalController,
    private navParams: NavParams
  ) {
    this.key = "";
  }

  ngOnInit(): void {
    this.profileId = Meteor.userId();
    console.log(this.profileId);
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

  editEvent(): void {
    //const modal = this.modalCtrl.create(EditEventComponent, { eventKey: this.event._id});
    //this.navCtrl.present(EditEventComponent);
    //modal.present();
    this.navCtrl.push(EditEventComponent, { eventKey: this.event._id});
  }
}
