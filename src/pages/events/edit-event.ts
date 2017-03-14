import { Component, OnInit } from '@angular/core';
import { Events, Pictures } from 'api/collections';
import { User, Event } from 'api/models';
import { AlertController, ViewController, NavParams, NavController } from 'ionic-angular';
import { MeteorObservable } from 'meteor-rxjs';
import { Observable, BehaviorSubject } from 'rxjs';
import { PictureService } from '../../services/picture';
import { EventPage } from "./event";

@Component({
  selector: 'edit-event',
  templateUrl: 'edit-event.html'
})
export class EditEventComponent implements OnInit {
  searchPattern: BehaviorSubject<any>;
  users: Observable<User[]>;
  event;
  picture: string;
  key: string;
  minDate: string;

  constructor(
    private alertCtrl: AlertController,
    private pictureService: PictureService,
    private viewCtrl: ViewController,
    private navCtrl: NavController,
    private navParams: NavParams
  ) {

  }

  ngOnInit(): void {
    this.key = this.navParams.get('eventKey');
    this.event = Events.findOne({_id: this.key});

    this.minDate = new Date(Date.now()).toISOString();
    
    this.picture = this.event.picture;
  }

  selectEventPicture(): void {
    this.pictureService.select().then((blob) => {
      this.uploadEventPicture(blob);
    })
      .catch((e) => {
        this.handleError(e);
      });
  }

  uploadEventPicture(blob: Blob): void {
    this.pictureService.upload(blob).then((picture) => {
      this.event.pictureId = picture._id;
      this.event.picture = picture.url;
    })
      .catch((e) => {
        this.handleError(e);
      });
  }

  editEvent(): void {
    
    if (this.event.dateStart && this.event.dateEnd) {
      if (this.event.dateEnd > this.event.dateStart) {
        MeteorObservable.call('updateEvent', this.event).subscribe({
          next: () => {
            this.navCtrl.pop();
          },
          error: (e: Error) => {
            this.handleError(e);
          }
        });
      }
      else {
        const alert = this.alertCtrl.create({
               title: 'Oops!',
               message: 'Вы указали неправильную дату окончания!',
               buttons: ['OK']
             });
        alert.present();
      }
    } 
    else { if (!this.event.dateStart && !this.event.dateEnd) {
             const alert = this.alertCtrl.create({
               title: 'Oops!',
               message: 'Вы не указали дату начала и дату окончания!',
               buttons: ['OK']
             });
            alert.present();
         }
      if (!this.event.dateStart && this.event.dateEnd) {
             const alert = this.alertCtrl.create({
               title: 'Oops!',
               message: 'Вы не указали дату начала!',
               buttons: ['OK']
             });
             alert.present();
      }
      if (this.event.dateStart && !this.event.dateEnd) {
             const alert = this.alertCtrl.create({
               title: 'Oops!',
               message: 'Вы не указали дату окончания!',
               buttons: ['OK']
             });
             alert.present();
      }
 
    }
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
