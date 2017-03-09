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
    console.log("Hey it's from eventPage with id:");
    console.log(this.key);
    this.event = Events.findOne({_id: this.key});  
    
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
    MeteorObservable.call('updateEvent', this.event).subscribe({
      next: () => {
        this.navCtrl.pop();
      },
      error: (e: Error) => {
        this.handleError(e);
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
