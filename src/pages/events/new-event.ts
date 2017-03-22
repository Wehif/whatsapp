import { Component, OnInit } from '@angular/core';
import { User, Event } from 'api/models';
import { AlertController, ViewController} from 'ionic-angular';
import { MeteorObservable } from 'meteor-rxjs';
import { Observable, BehaviorSubject } from 'rxjs';
import { PictureService } from '../../services/picture';

@Component({
  selector: 'new-event',
  templateUrl: 'new-event.html'
})
export class NewEventComponent implements OnInit {
  searchPattern: BehaviorSubject<any>;
  users: Observable<User[]>;
  event: Event;
  picture: string;
  minDate: string = new Date().toISOString();

  constructor(
    private alertCtrl: AlertController,
    private pictureService: PictureService,
    private viewCtrl: ViewController
  ) {
    this.searchPattern = new BehaviorSubject(undefined);
  }

  ngOnInit(): void {
    this.event = {
      name: '',
      description: '',
      picture:'',
      subscribers: [],
      iGoSubscribers: [],
      countSubscribers: 1,
      countIGoSubscribers: 1,
      countOfComments: 0
    }
   
   this.event.dateStart = new Date(Date.now()).toISOString();
   this.event.dateEnd = (new Date(Date.now() + 3*3600000)).toISOString();
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

  addEvent(event): void {
    this.event.creatorId = Meteor.userId();
    this.event.name = event.name;
    this.event.description = event.description;
    this.event.dateStart = event.dateStart;
    this.event.dateEnd = event.dateEnd;
    if (this.event.dateStart && this.event.dateEnd) {
      if (this.event.dateEnd > this.event.dateStart) {
        this.event.subscribers.push(this.event.creatorId);
        this.event.iGoSubscribers.push(this.event.creatorId);
        MeteorObservable.call('addEvent', this.event).subscribe({
          next: () => {
            this.viewCtrl.dismiss();
          },
          error: (e: Error) => {
            this.viewCtrl.dismiss().then(() => {
              this.handleError(e);
            });
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
