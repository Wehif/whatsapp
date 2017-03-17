import { Component, ViewChild } from '@angular/core';
import { Platform, MenuController, Alert, AlertController, Nav, ViewController } from 'ionic-angular';
import { StatusBar, Splashscreen } from 'ionic-native';
import { TabsPage } from '../pages/tabs/tabs';
import { PhoneService } from '../services/phone';
import { Meteor } from 'meteor/meteor';
import { LoginPage } from '../pages/login/login';
import { ProfilePage } from '../pages/profile/profile';
import { MyEventsPage } from '../pages/events/myevents';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild('content') nav: any;

  rootPage: any;

  constructor(
    platform: Platform, 
    public menu: MenuController,
    private alertCtrl: AlertController,
    private phoneService: PhoneService
   ) {
    this.rootPage = Meteor.user() ? TabsPage : LoginPage;

    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      if (platform.is('cordova')) {
        StatusBar.styleDefault();
        Splashscreen.hide();
      }
    });
  }
  
  editProfile(): void {
    this.menu.close();
    let viewCtrl: ViewController = this.nav.getActive();
    //viewCtrl.dismiss().then(() => {
      this.nav.push(ProfilePage);
    //});
  }

  goToMyEvents(): void {
    let viewCtrl: ViewController = this.nav.getActive();
    this.menu.close();
    this.nav.push(MyEventsPage);
  }

  logout(): void {
    let viewCtrl: ViewController = this.nav.getActive();
    this.menu.close();
    const alert = this.alertCtrl.create({
      title: 'Logout',
      message: 'Are you sure you would like to proceed?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Yes',
          handler: () => {
            this.handleLogout(alert);
            return false;
          }
        }
      ]
    });

    //viewCtrl.dismiss().then(() => {
      alert.present();
    //});
  }

  isUserLoggedIn(): boolean {
    let user = Meteor.user();
    return user !== null;
  }

  handleLogout(alert: Alert): void {
    alert.dismiss().then(() => {
      return this.phoneService.logout();
    })
    .then(() => {
      this.nav.setRoot(LoginPage, {}, {
        animate: true
      });
    })
    .catch((e) => {
      this.handleError(e);
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
