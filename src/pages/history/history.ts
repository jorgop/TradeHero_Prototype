import { Component } from '@angular/core';
import {AlertController, LoadingController, NavController, PopoverController, ToastController} from "ionic-angular";
import {NavParams} from "ionic-angular";
import {HistoryService} from "../../services/history.service";
import {ActivityService} from "../../services/activity.service";
import {Storage} from "@ionic/storage";
import {RestProvider} from "../../providers/rest/rest";
import { ImageViewerController } from 'ionic-img-viewer';
import {LoginPage} from "../login/login";

@Component({
    selector: 'page-history',
    templateUrl: 'history.html'
})
export class HistoryPage {

    private ticketID: any;
    history: { head: string, body: string, cardClass: string }[] = [];
    historyHeader: { submitDate: string, endDate: String, refund: number, imgFile: String, invoiceID: String }[] = [];

    private historyLoading: any;

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
        console.log("ticket: " + this.ticketID);

        //loading for sending data
        this.historyLoading = this.loadingController.create({
            content: 'Verlauf wird geladen'
        });

        this.imageViewerCtrl = imageViewerCtrl;

    }

    ionViewWillEnter() {
        this.history = this.historyService.getCard();
        this.updateLocalStorageAndPrepareData(true);
    }

    goToAbout() {

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
                            this.sentToast("Scan failed");
                        });
                    }
                    ;
                });
            });
        });
    }


    addCards(data) {
        //loop through the activityList
        for (let i in data.activityList) {
            let currentObject = data.activityList[i];
            //console.log(currentObject);
            if (currentObject['ticketID'] == this.ticketID) {
                console.log(data.activityList[i]);
                for (let j in currentObject['history']) {
                    let currentHistory = currentObject['history'][j];
                    var statusText;
                    var statusClass;
                    var historyClass;
                    var subDate;
                    var endDate;
                    var imgFile;
                    var refund;
                    var invID;

                    /*Card-Header*/
                    subDate = currentObject['startDate'];
                    endDate = currentObject['endDate'];
                    imgFile = currentObject['imgFile'];
                    refund = currentObject['refund'];
                    invID = currentObject['invoiceID'];

                    /*Card-Body*/
                    /*if(currentHistory['stateID'] == 3 && currentHistory['stateStatus'] == "1"){
                        endDate = currentHistory['endDate'];
                    }else if(currentHistory['stateStatus'] == "2"){
                        endDate = currentHistory['endDate'];
                    }else if(currentHistory['stateStatus'] == "0"){
                        endDate = currentHistory['endDate'];
                    }*/

                    if (currentHistory['stateStatus'] == 0) {
                        statusText = "Offen";
                        statusClass = "cl-open";
                        historyClass = "card-open";
                    } else {
                        statusText = "Abgeschlossen";
                        statusClass = "cl-closed";
                        historyClass = "card-closed";
                    }
                    ;
                    this.history.push({
                        head: 'Status: ' + '<b>' + statusText + '</b>',
                        body: '<div class=' + statusClass + '>' + currentHistory['stateText'] + '</div>',
                        cardClass: historyClass
                    });
                }
                ;
            }
            ;

        }
        this.historyHeader.push({
            submitDate: subDate.toString(),
            endDate: endDate.toString(),
            refund: refund,
            imgFile: imgFile,
            invoiceID: invID
        });
    }

    /*
    showPhoto(){
      this.photoViewer.show(this.historyHeader['imgFile']);
    }
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
    performLogout() {
        this.navCtrl.setRoot(LoginPage);
        this.navCtrl.popToRoot();
        this.storage.clear();
        let logoutConf = this.toastCtrl.create({
            message: 'Sie wurden erfolgreich ausgeloggt',
            duration: 2000,
            position: 'top',
            showCloseButton: true,
            closeButtonText: 'X'
        });
        logoutConf.onDidDismiss(() => {
            console.log('Dismissed toast');
        });
        logoutConf.present();
    }

}
