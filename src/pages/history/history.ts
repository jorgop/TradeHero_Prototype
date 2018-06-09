import { Component } from '@angular/core';
import {NavController} from "ionic-angular";
import {NavParams} from "ionic-angular";

@Component({
    selector: 'page-history',
    templateUrl: 'history.html'
})
export class HistoryPage {

    ticketID : any;

    constructor(
        public navCtrl: NavController,
        public navParams: NavParams) {

        this.ticketID = this.navParams.get('ticketID');
        console.log("ticket: " + this.ticketID);
    }
}
