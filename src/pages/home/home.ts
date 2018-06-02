import { Component } from '@angular/core';
import {NavController} from "ionic-angular";
import {ActivityPage} from "../activity/activity";
import {ContactPage} from "../contact/contact";

@Component({
    selector: 'page-home',
    templateUrl: 'home.html'
})
export class HomePage {

    constructor(
        public navCtrl: NavController) {
    }

        goToActivity(){
            this.navCtrl.push(ActivityPage);

    }
        goToContact(){
            this.navCtrl.push(ContactPage)
        }

}
