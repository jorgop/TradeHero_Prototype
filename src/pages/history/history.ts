import { Component } from '@angular/core';
import {NavController} from "ionic-angular";
import {NavParams} from "ionic-angular";
import {HistoryService} from "../../services/history.service";
import {ActivityService} from "../../services/activity.service";
import {Storage} from "@ionic/storage";
import {RestProvider} from "../../providers/rest/rest";

@Component({
    selector: 'page-history',
    templateUrl: 'history.html'
})
export class HistoryPage {

    ticketID : any;
    history: {head:string,body:string}[] = [];

    constructor(
        public navCtrl: NavController,
        public navParams: NavParams,
        private historyService: HistoryService,
        private storage: Storage,
        public restProvider: RestProvider) {

        this.ticketID = this.navParams.get('ticketID');
        console.log("ticket: " + this.ticketID);
    }

  ionViewWillEnter(){
    this.history = this.historyService.getCard();
    this.updateLocalStorageAndPrepareData();
  }

  /**
   * Update local storage if the REST-Service can be reached, prepare data into JSON
   */
  updateLocalStorageAndPrepareData(){
    //get user ID from storage
    this.storage.get('identity').then((val) => {
      let identity = <any>{};
      identity = JSON.parse(val);

      //get activities from REST - set to soratge and push to list
      this.restProvider.getTicketData(this.ticketID).then((result) => {
        //set activities to Storage
        this.storage.set(this.ticketID,JSON.stringify(result));

        //get refreshed activities from storage
        this.storage.get(this.ticketID).then((val) => {
          let history = <any>{};
          history = JSON.parse(val);
          this.addCards(history);
        });
      }, (err) => {

        //get activities from storage if rest failed - no internet connection
        this.storage.get(this.ticketID).then((val) => {
          let history = <any>{};
          history = JSON.parse(val);
          this.addCards(history);
        });
      });
    });
  }

  addCards(data) {

    //loop through the activityList
    for (let i in data.activityList) {
      let currentObject = data.activityList[i];

      if (currentObject['ticketID'] == this.ticketID){
        this.history.push({head: 'Title',body: currentObject.imgFile});
      }


      /*
      //get values from a current activity
      Object.keys(currentObject).forEach(key => {
        var historyCurrentObject = currentObject;
        var currentTicketID = currentObject["ticketID"]

        /**
        var name = currentObject["ticketID"];
        var date = currentObject["createDate"];
        var status = currentObject["ticketStatus"];
        var statusText = "";


        if (status == 0) {
          statusText = "Offen";
        } else if (status == 1) {
          statusText = "Abgeschlossen";
        } else {
          statusText = "Abgelehnt";
        }


        // Add activity to list
        if (key == this.ticketID) {
          this.history.push({ticketID: currentTicketID.toString()});
          console.log("myObj",historyCurrentObject);


        }
      });
      */
    }
  }
}
