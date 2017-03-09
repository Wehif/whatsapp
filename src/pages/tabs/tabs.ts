import { Component, OnInit, ViewChild } from '@angular/core';
import { NavController, Events, Tabs } from 'ionic-angular';

import { TinderPage} from '../tinder/tinder';
import { ChatsPage} from '../chats/chats';
import { EventsPage} from '../events/events';
import { ChatroomsPage} from '../chatrooms/chatrooms';

@Component({
    templateUrl: 'tabs.html'
})
export class TabsPage implements OnInit {

    public tinderPage: any;
    public chatsPage: any;
    public eventsPage: any;
    public chatroomsPage: any;

    constructor() {
        // this tells the tabs component which Pages
        // should be each tab's root Page
        this.tinderPage = TinderPage;
        this.chatsPage = ChatsPage;
        this.eventsPage = EventsPage;
        this.chatroomsPage = ChatroomsPage;
    }

    ngOnInit() {
        //
    }
}
