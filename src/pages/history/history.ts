import { Component } from '@angular/core';
import {LoadingController, NavController, ToastController} from "ionic-angular";
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

    private ticketID : any;
    history: {head:string,body:string,imgFile:string,cardClass: string}[] = [];

    private historyLoading : any;

    constructor(
        public navCtrl: NavController,
        public navParams: NavParams,
        private historyService: HistoryService,
        private storage: Storage,
        public restProvider: RestProvider,
        public loadingController: LoadingController,
        public toastCtrl: ToastController) {

        this.ticketID = this.navParams.get('ticketID');
        console.log("ticket: " + this.ticketID);

      //loading for sending data
      this.historyLoading = this.loadingController.create({
        content: 'Bild wird verarbeitet'
      });
    }

  ionViewWillEnter(){
    this.history = this.historyService.getCard();
    this.updateLocalStorageAndPrepareData();
  }

  /**
   * Update local storage if the REST-Service can be reached, prepare data into JSON
   */
  updateLocalStorageAndPrepareData(){

    this.historyLoading.present();

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

          this.historyLoading.dismiss().then(() => {
            console.log('History loaded');
          });
        });
      }, (err) => {

        //get activities from storage if rest failed - no internet connection
        this.storage.get(this.ticketID).then((val) => {
          let history = <any>{};
          history = JSON.parse(val);
          this.addCards(history);

          this.historyLoading.dismiss().then(() => {
            console.log('Verlauf konnte nicht geladen werden ;( ');
            this.sentToast("Scan failed");
          });
        });
      });
    });
  }

  addCards(data) {


    //loop through the activityList
    for (let i in data.activityList) {
      let currentObject = data.activityList[i];

      //console.log(currentObject);

      if (currentObject['ticketID'] == this.ticketID){

      for (let j in currentObject['history']) {



        let currentHistory = currentObject['history'][j];
          var statusText;
          var statusClass;
          var historyClass;
          if (currentHistory['stateStatus'] == 0){
            statusText = "Offen";
            statusClass = "cl-open";
            historyClass = "card-open";
          }else {
            statusText = "Abgeschlossen";
            statusClass = "cl-closed";
            historyClass = "card-closed";
          };
          this.history.push({head: 'Status: ' + '<b>' + statusText +'</b>',body: '<div class='+statusClass+'>' + currentHistory['stateText'] + '</div>', imgFile: currentObject.imgFile,cardClass: historyClass  });
        };
      };
    }
  }

  /**
   * View a toast message
   * @param message Toast Text
   */
  sentToast(message) {
    let toast = this.toastCtrl.create({
      message: message,
      duration: 3000,
      position: 'top'
    });
    toast.present();
  }
    hisRefresh(refresher) {
        console.log('Begin async operation', refresher);
        this.history = [];
        //TODO: refresh histroy items
        //this.updateLocalStorageAndPrepareData();

        console.log('Async operation has ended');
        refresher.complete();
    }
}
