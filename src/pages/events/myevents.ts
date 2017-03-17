import { Component, OnInit } from '@angular/core';
import { Events } from 'api/collections';
import { Event } from 'api/models';
import { NavController, PopoverController, ModalController, AlertController } from 'ionic-angular';
import { MeteorObservable } from 'meteor-rxjs';
import { EventPage } from './event';
import { Observable } from 'rxjs';
import { NewEventComponent } from './new-event';

@Component({
  templateUrl: 'myevents.html'
})
export class MyEventsPage implements OnInit {
  myEvents;
  myEventsPrev;
  userId: string;
  myE: string = "current";

  constructor(
    private navCtrl: NavController,
    private popoverCtrl: PopoverController,
    private modalCtrl: ModalController,
    private alertCtrl: AlertController) {
    this.userId = Meteor.userId();
  }

  addEvent(): void {
    const modal = this.modalCtrl.create(NewEventComponent);
    modal.present();
  }

  ngOnInit() {
    MeteorObservable.subscribe('myEvents').subscribe(() => {
      MeteorObservable.autorun().subscribe(() => {
        this.myEvents = this.findMyEvents();
      });
    });

    MeteorObservable.subscribe('myEventsPrev').subscribe(() => {
      MeteorObservable.autorun().subscribe(() => {
        this.myEventsPrev = this.findMyEventsPrev();
      });
    });
  }

  findMyEvents(): Observable<Event[]> {
    // Find events and transform them
    let todayDate = new Date().toISOString();
    return Events.find({ dateEnd: { $gte: todayDate}, subscribers: this.userId}, {sort: { dateStart: 1}});
  }

  findMyEventsPrev(): Observable<Event[]> {
    // Find events and transform them
    let todayDate = new Date().toISOString();
    return Events.find({ dateEnd: { $lt: todayDate}, subscribers: this.userId}, {sort: { dateStart: -1}});
  }

  showEvent(id : string): void {
    this.navCtrl.push(EventPage, { eventKey : id});
  }

  handleError(e: Error): void {
    console.error(e);

    const alert = this.alertCtrl.create({
      buttons: ['OK'],
      message: e.message,
      title: 'Oops!'
    });

    alert.present();
  }
}
