import { Component, OnInit } from '@angular/core';
import { Events } from 'api/collections';
import { Event } from 'api/models';
import { NavController, PopoverController, ModalController, AlertController } from 'ionic-angular';
import { MeteorObservable } from 'meteor-rxjs';
import { Observable } from 'rxjs';
import { NewEventComponent } from './new-event';

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
    return Events.find();
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
