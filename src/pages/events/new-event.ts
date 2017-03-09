import { Component, OnInit } from '@angular/core';
import { Pictures } from 'api/collections';
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
      picture:''}
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
