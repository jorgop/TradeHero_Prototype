import { Component } from '@angular/core';
import {AlertController, LoadingController, NavController, PopoverController, ToastController} from "ionic-angular";
import {NavParams} from "ionic-angular";
import {HistoryService} from "../../services/history.service";
import {ActivityService} from "../../services/activity.service";
import {Storage} from "@ionic/storage";
import {RestProvider} from "../../providers/rest/rest";
import { ImageViewerController } from 'ionic-img-viewer';
import {ImpressumPage} from "../impressum/impressum";
import {LoginPage} from "../login/login";
import {count} from "rxjs/operators";

@Component({
    selector: 'page-history',
    templateUrl: 'history.html'
})
export class HistoryPage {

  /**
   *  Current ticket id
   */
  private ticketID: any;

    private history: { head: string, body: string, cardClass: string }[] = [];
    private historyHeader: { submitDate: string, endDate: String, refund: number, imgFile: String, invoiceID: String }[] = [];

  /**
   *  Object for the first ticket
   * @type {{head: string; body: string; status: string; status_color: string}}
   */
  private ticket1 =  {head: "",body: "", startDate: "", endDate: "", status: "", status_color: ""};
  /**
   *  Object for the second ticket
   * @type {{head: string; body: string; status: string; status_color: string}}
   */
  private ticket2 =  {head: "",body: "", startDate: "", endDate: "", status: "", status_color: ""};
  /**
   *  Object for the third ticket
   * @type {{head: string; body: string; status: string; status_color: string}}
   */
  private ticket3 =  {head: "",body: "", startDate: "", endDate: "", status: "", status_color: ""};
  /**
   *  Object for the loading animation
   */
  private historyLoading: any;

  /**
   * @constructor
   * @param {NavController} navCtrl Navigation Controller
   * @param {NavParams} navParams Navigation Paramter
   * @param {HistoryService} historyService History Service
   * @param {Storage} storage Local Storage
   * @param {RestProvider} restProvider Provider for the Rest-Service
   * @param {ImageViewerController} imageViewerCtrl Image viewer controller
   * @param {LoadingController} loadingController Controller for loading animations
   * @param {ToastController} toastCtrl Toast Message Controller
   * @param {AlertController} alertCtrl Alert Controller
   */
    constructor(
        public navCtrl: NavController,
        public navParams: NavParams,
        private historyService: HistoryService,
        private storage: Storage,
        public restProvider: RestProvider,
        private imageViewerCtrl: ImageViewerController,
        public loadingController: LoadingController,
        public toastCtrl: ToastController,
        public alertCtrl: AlertController
    ) {

        this.ticketID = this.navParams.get('ticketID');

        //loading for sending data
        this.historyLoading = this.loadingController.create({
            content: 'Verlauf wird geladen...'
        });

        this.imageViewerCtrl = imageViewerCtrl;

    }

  /**
   * Function will called if the page will be entered to update the local storage and prepare the data
   */
  ionViewWillEnter() {
        this.history = this.historyService.getCard();
        this.updateLocalStorageAndPrepareData(true);
    }

  /**
   * Navigate to ImpressumPage
   */
  goToImpressum() {
        this.navCtrl.push(ImpressumPage);
    }

    /**
     * Update local storage if the REST-Service can be reached, prepare data into JSON
     */
    updateLocalStorageAndPrepareData(loadRequired) {

        if (loadRequired == true) {
            this.historyLoading.present();
        }
        ;

        //get user ID from storage
        this.storage.get('identity').then((val) => {
          let identity = <any>{};
          identity = JSON.parse(val);

          try {

            //get activities from REST - set to soratge and push to list
            this.restProvider.getTicketData(this.ticketID).then((result) => {

              //set activities to Storage
              this.storage.set(this.ticketID, JSON.stringify(result));

              //get refreshed activities from storage
              this.storage.get(this.ticketID).then((val) => {
                let history = <any>{};
                history = JSON.parse(val);
                this.addCards(history);

                if (loadRequired == true) {
                  this.historyLoading.dismiss().then(() => {
                    console.log('History loaded');
                  });
                }
                ;
              });
            }, (err) => {

              //get activities from storage if rest failed - no internet connection
              this.storage.get(this.ticketID).then((val) => {
                let history = <any>{};
                history = JSON.parse(val);
                this.addCards(history);
                if (loadRequired == true) {
                  this.historyLoading.dismiss().then(() => {
                    console.log('Verlauf konnte nicht geladen werden ;( ');
                    //this.sentToast("Scan failed");
                  });
                }
                ;
              });
            });
        }catch (e) {
            //TODO: exception handling
            console.log("ID is null!")
          }
        });
    }

    /**
     * Loop through data from local storage to handle status cards in ticket
     * @param data
     */
    addCards(data) {

      var counter = 0;
        //loop through the activityList
        for (let i in data.activityList) {

            let currentObject = data.activityList[i];

            if (currentObject['ticketID'] == this.ticketID) {
                for (let j in currentObject['history']) {
                    let currentHistory = currentObject['history'][j];
                    var subDate;
                    var endDate;
                    var ticketStartDate;
                    var ticketEndDate;
                    var imgFile;
                    var refund;
                    var invID;

                    /*Card-Header*/
                    var subDateArray = currentObject['startDate'].split("-");
                    var endDateArray = currentObject['endDate'].split("-");
                    subDate = subDateArray[2] + "." + subDateArray[1]+ "." + subDateArray[0];
                    if(endDateArray[0] != 2018){
                        endDate = "noch offen";
                    }else{
                        endDate = endDateArray[2] + "." + endDateArray[1]+ "." + endDateArray[0];
                    }
                    imgFile = currentObject['imgFile'];
                    refund = currentObject['refund'];
                    if(currentObject['invoiceID'] == ""){
                        invID = "k.A."
                    }else{
                        invID = currentObject['invoiceID'];
                    }


                    counter += 1;

                    this.ticket1.status = "false";
                    this.ticket2.status = "false";
                    this.ticket2.status = "false";

                    var ticketStartDateArray = currentHistory['startDate'].split("-");
                    var ticketEndDateArray = currentHistory['endDate'].split("-");
                    ticketStartDate = ticketStartDateArray[2] + "." + ticketStartDateArray[1]+ "." + ticketStartDateArray[0];
                    ticketEndDate = ticketEndDateArray[2] + "." + ticketEndDateArray[1]+ "." + ticketEndDateArray[0];
                    if(ticketEndDateArray[0] != 2018){
                        ticketEndDate = "noch offen";
                    }else{
                        ticketEndDate = ticketEndDateArray[2] + "." + ticketEndDateArray[1]+ "." + ticketEndDateArray[0];
                    }

                    if (currentHistory['stateStatus'] == 0) {

                      switch (counter){
                        case 1:{
                          this.ticket1.head = "Offen";
                          this.ticket1.body = currentHistory['stateText'];
                          this.ticket1.startDate = ticketStartDate;
                          this.ticket1.endDate = ticketEndDate;
                          this.ticket1.status = "true";
                          this.ticket1.status_color = "ticket-color-waiting";
                          this.ticket2.status = "false";
                          this.ticket3.status = "false";
                          break;
                        }
                        case 2:{
                          this.ticket1.status = "true";
                          this.ticket2.head = "Offen";
                          this.ticket2.body = currentHistory['stateText'];
                          this.ticket2.startDate = ticketStartDate;
                          this.ticket2.endDate = ticketEndDate;
                          this.ticket2.status = "true";
                          this.ticket2.status_color = "ticket-color-waiting";
                          this.ticket3.status = "false";
                          break;
                        }
                        case 3:{
                          this.ticket1.status = "true";
                          this.ticket2.status = "true";
                          this.ticket3.head = "Offen";
                          this.ticket3.body = currentHistory['stateText'];
                          this.ticket3.startDate = ticketStartDate;
                          this.ticket3.endDate = ticketEndDate;
                          this.ticket3.status = "true";
                          this.ticket3.status_color = "ticket-color-waiting";
                          break;
                        }
                      }
                    } else if (currentHistory['stateStatus'] == 1) {

                      switch(counter){
                        case 1:{
                          this.ticket1.head = "Abgeschlossen";
                          this.ticket1.body = currentHistory['stateText'];
                          this.ticket1.startDate = ticketStartDate;
                          this.ticket1.endDate = ticketEndDate;
                          this.ticket1.status = "true";
                          this.ticket1.status_color = "ticket-color-finished";
                          this.ticket2.status = "false";
                          this.ticket3.status = "false";
                          break;
                        }
                        case 2:{
                          this.ticket1.status = "true";
                          this.ticket2.head = "Abgeschlossen";
                          this.ticket2.body = currentHistory['stateText'];
                          this.ticket2.startDate = ticketStartDate;
                          this.ticket2.endDate = ticketEndDate;
                          this.ticket2.status = "true";
                          this.ticket2.status_color = "ticket-color-finished";
                          this.ticket3.status = "false";
                          break;
                        }
                        case 3:{
                          this.ticket1.status = "true";
                          this.ticket2.status = "true";
                          this.ticket3.head = "Abgeschlossen";
                          this.ticket3.body = currentHistory['stateText'];
                          this.ticket3.startDate = ticketStartDate;
                          this.ticket3.endDate = ticketEndDate;
                          this.ticket3.status = "true";
                          this.ticket3.status_color = "ticket-color-finished";
                          break;
                        }
                      }
                    }else{

                      switch (counter){
                        case 1:{
                          this.ticket1.head = "Abgebrochen";
                          this.ticket1.body = currentHistory['stateText'];
                          this.ticket1.startDate = ticketStartDate;
                          this.ticket1.endDate = ticketEndDate;
                          this.ticket1.status = "true";
                          this.ticket1.status_color = "ticket-color-failed";
                          this.ticket2.status = "false";
                          this.ticket3.status = "false";
                          break;
                        }
                        case 2:{
                          this.ticket1.status = "true";
                          this.ticket2.head = "Abgebrochen";
                          this.ticket2.body = currentHistory['stateText'];
                          this.ticket2.startDate = ticketStartDate;
                          this.ticket2.endDate = ticketEndDate;
                          this.ticket2.status = "true";
                          this.ticket2.status_color = "ticket-color-failed";
                          this.ticket3.status = "false";
                          break;
                        }
                        case 3:{
                          this.ticket1.status = "true";
                          this.ticket2.status = "true";
                          this.ticket3.head = "Abgebrochen";
                          this.ticket3.body = currentHistory['stateText'];
                          this.ticket3.startDate = ticketStartDate;
                          this.ticket3.endDate = ticketEndDate;
                          this.ticket3.status = "true";
                          this.ticket3.status_color = "ticket-color-failed";
                          break;
                        }
                      }
                    };
                }
                ;
            }
            ;
        }
        this.historyHeader.push({
            submitDate: subDate,
            endDate: endDate,
            refund: refund,
            imgFile: imgFile,
            invoiceID: invID
        });
    }

    /**
     * Thumbnail if scanned image is enlarged to full screen
     * @param myImg
     */
    showPhoto(myImg) {
        const imageViewer = this.imageViewerCtrl.create(myImg);
        imageViewer.present(myImg);
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

    /**
     * History refresh by pull down
     * @param refresher
     */
    hisRefresh(refresher) {
        console.log('Begin async operation', refresher);
        this.history = [];
        this.historyHeader = [];
        this.updateLocalStorageAndPrepareData(false);
        console.log('Async operation has ended');
        refresher.complete();
    }

    /**
     * Ask for logout confirmation
     */
    logout() {
        const confirm = this.alertCtrl.create({
            title: 'Wollen Sie sich wirklich ausloggen?',
            buttons: [
                {
                    text: 'Abbrechen',
                    handler: () => {
                        console.log('Logout abgebrochen');
                    }
                },
                {
                    text: 'Ausloggen',
                    handler: () => {
                        console.log('Logout erfolgreich');
                        this.performLogout();
                    }
                }
            ]
        });
        confirm.present();
    }

    /**
     * Perform logout and clear the local storage
     */
    performLogout() {
        this.navCtrl.setRoot(LoginPage);
        this.navCtrl.popToRoot();
        this.storage.clear();
        let logoutConf = this.toastCtrl.create({
            message: 'Sie wurden erfolgreich ausgeloggt.',
            duration: 2000,
            position: 'top',
            showCloseButton: true,
            closeButtonText: 'x'
        });
        logoutConf.onDidDismiss(() => {
            console.log('Dismissed toast');
        });
        logoutConf.present();
    }
}
