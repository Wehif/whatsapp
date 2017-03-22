import { Component, OnInit } from '@angular/core';
import { Events, Comments } from 'api/collections';
import { Event } from 'api/models';
import { NavController, PopoverController, ModalController, AlertController } from 'ionic-angular';
import { MeteorObservable } from 'meteor-rxjs';
import { EventPage } from './event';
import { Observable } from 'rxjs';
import { NewEventComponent } from './new-event';
import { _ } from 'meteor/underscore';

@Component({
  templateUrl: 'events.html'
})
export class EventsPage implements OnInit {
  events;
  creatorId: string;

  constructor(
    private navCtrl: NavController,
    private popoverCtrl: PopoverController,
    private modalCtrl: ModalController,
    private alertCtrl: AlertController) {
    this.creatorId = Meteor.userId();
  }

  addEvent(): void {
    const modal = this.modalCtrl.create(NewEventComponent);
    modal.present();
  }

  ngOnInit() {
    MeteorObservable.subscribe('events').subscribe(() => {
      MeteorObservable.autorun().subscribe(() => {
        this.events = this.findEvents();
      });
    });
  }

  findEvents(): Observable<Event[]> {
    // Find events and transform them
    let todayDate = new Date().toISOString();
    return Events.find({ dateEnd: { $gte: todayDate}}, {sort: { dateStart: 1}}).map(events => { events.forEach(event => {
       event.countSubscribers = _.size(event.subscribers);
       event.countOfComments = 0;
       //MeteorObservable.subscribe('countEventComments').subscribe(() => {
       //  MeteorObservable.autorun().subscribe(() => {
       //    let sad = Comments.find({docId: event._id}).count();
       //    console.log(sad);
       //  });
       //});
     });

     return events;
   });
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
