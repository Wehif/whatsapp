import { Component, OnInit } from '@angular/core';
import { Events, Users, Pictures, Comments } from 'api/collections';
import { User, Event, Comment } from 'api/models';
import { AlertController, NavController, NavParams, ModalController } from 'ionic-angular';
import { Observable, BehaviorSubject } from 'rxjs';
import { PictureService } from '../../services/picture';
import { EditEventComponent } from './edit-event';
import { MeteorObservable } from 'meteor-rxjs';
import { _ } from 'meteor/underscore';
import { ShowProfilePage } from '../profile/showprofile';

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
  comments;
  newCommentText: string;
  newComment: Comment;
  subscribed: boolean;

  constructor(
    private alertCtrl: AlertController,
    private pictureService: PictureService,
    private navCtrl: NavController,
    private modalCtrl: ModalController,
    private navParams: NavParams
  ) {
    this.key = "";
    this.newCommentText = "";
  }

  ngOnInit(): void {
    this.profileId = Meteor.userId();
    this.key = this.navParams.get('eventKey');
    this.newCommentText = "";
    this.newComment = {
      creatorId: '',
      text: '',
      createdAt:'',
      docId: ''
    }
    this.event='';
    

    MeteorObservable.subscribe('event', this.key).subscribe(() => {
      MeteorObservable.autorun().subscribe(() => {
        this.event = this.findEvent();
      });
    });
    
    //MeteorObservable.subscribe('event', this.key).subscribe(() => { 
    //  this.event = Events.findOne({_id: this.key});
    //});


    MeteorObservable.subscribe('eventComments', this.key).subscribe(() => {
      MeteorObservable.autorun().subscribe(() => {
        this.comments = this.findComments();
      });
    });
  }

  //findEvent(): Event {
  // Find event and transform them
  //  let currEvent = Events.find({_id: this.key}).map(events => {
  //    events.forEach(event => {
  //      event.creatorName = '';
  //      event.creatorAvatar = '';

  //      const creator = Users.findOne(event.creatorId);

  //      if (creator) {
  //        event.creatorName = creator.profile.name;
  //        event.creatorAvatar = Pictures.getPictureUrl(creator.profile.pictureId);
  //      }
  //    });
  //    return events;
  //  });
  //  console.log("лахей, сюда смотри!");
  //  console.log(currEvent);
  //  return currEvent[1];
  //}

  findEvent(): Event {
  // Find event and transform them
    let currEvent = Events.findOne({_id: this.key})
        currEvent.creatorName = '';
        currEvent.creatorAvatar = '';

        const creator = Users.findOne(currEvent.creatorId);

        if (creator) {
          currEvent.creatorName = creator.profile.name;
          currEvent.creatorAvatar = Pictures.getPictureUrl(creator.profile.pictureId);
        }
      
    this.subscribed = _.include(currEvent.subscribers, this.profileId);
    return currEvent;
  }

  findComments(): Observable<Comment[]>{
  // Find comments and transform them
    return Comments.find({docId: this.key}).map(comments => {
      comments.forEach(comment => {
        comment.username = '';
        comment.avatar = '';

        const creator = Users.findOne(comment.creatorId);

        if (creator) {
          comment.username = creator.profile.name;
          comment.avatar = Pictures.getPictureUrl(creator.profile.pictureId);
        }

      });

      return comments;
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

  getPic(pictureId): string {
    return Pictures.getPictureUrl(pictureId);
  }

  editEvent(): void {
    this.navCtrl.push(EditEventComponent, { eventKey: this.event._id});
  }
 
  addNewComment(): void {
    this.newComment.creatorId = Meteor.userId();
    this.newComment.text = this.newCommentText;
    this.newComment.createdAt = new Date().toISOString();
    this.newComment.docId = this.event._id;
    MeteorObservable.call('addComment', this.newComment).subscribe({
          next: () => {
            //this.viewCtrl.dismiss();
          },
          error: (e: Error) => {
            //this.viewCtrl.dismiss().then(() => {
              this.handleError(e);
            //});
          }
    });
    this.newCommentText="";
  }

  removeComment(commentId: string): void {
    let userId = Meteor.userId();
    MeteorObservable.call('deleteComment', commentId, userId).subscribe({
          next: () => {
            //this.viewCtrl.dismiss();
          },
          error: (e: Error) => {
            //this.viewCtrl.dismiss().then(() => {
              this.handleError(e);
            //});
          }
    });
  }
  
  subscribeUser(): void {
     MeteorObservable.call('subscribeEvent', this.event._id).subscribe();
     this.subscribed = true;
  }

  unsubscribeUser(): void {
     MeteorObservable.call('unsubscribeEvent', this.event._id).subscribe();
     this.subscribed = false;
  }

 ifSubcribe(): void {
   this.subscribed = _.include(this.event.subscribers, this.profileId);
 }

 showCreatorProfile(): void {
    this.navCtrl.push(ShowProfilePage, { profileKey : this.event.creatorId});
 }
}
