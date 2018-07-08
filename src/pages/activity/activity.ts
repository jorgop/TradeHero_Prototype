import { Component } from '@angular/core';
import {LoadingController, NavController, App, AlertController, ToastController} from 'ionic-angular';
import {ActivityService} from "../../services/activity.service";
import {Storage} from "@ionic/storage";
import {ViewChild} from "@angular/core";
import {Navbar} from "ionic-angular";
import {RestProvider} from "../../providers/rest/rest";
import {HistoryPage} from "../history/history";
import {HomePage} from "../home/home";
import {ScanPage} from "../scan/scan";
import {ProfilePage} from "../profile/profile";
import {ContactPage} from "../contact/contact";
import {LoginPage} from "../login/login";
import {ImpressumPage} from "../impressum/impressum";


@Component({
    selector: 'page-activity',
    templateUrl: 'activity.html'
})
export class ActivityPage {
    activity: {date: string, ticketID:string,ticketStatus: string, iconName: String, cssClass: String}[] = [];
    aggregate: {countClosed: number, countAll: number, countOpen: number, countDenied: number, sumAll: number, sumOpen: number, sumClosed: number, sumDenied: number}[] = [];
    // Erstes Segment default wählen
    status = "all";

    @ViewChild(Navbar) navBar: Navbar;
    constructor(public navCtrl: NavController,
                private toastCtrl: ToastController,
                public alertCtrl: AlertController,
                public app: App,
                private activityService: ActivityService,
                private storage: Storage,
                public restProvider: RestProvider,
                public loadingController: LoadingController) {
    }

    ionViewDidLoad() {
        this.navBar.backButtonClick = (e:UIEvent)=>{
            this.navCtrl.push(HomePage);
        }
    }
    /**
     * Navigate to HistoryPage
     * @param id TicketID from activity
     */
    goToHistoryPage(id){
        this.navCtrl.push(HistoryPage,{ticketID:id});
    }

    /**
     * Cell function on enter the page
     */
    ionViewWillEnter(){
        this.aggregate = [];
        this.activity = this.activityService.getActivity();
        this.updateLocalStorageAndPrepareData();
        this.status = "all";
    }

    setStatus(param){
        this.activity = [];
        this.aggregate = [];
        this.updateLocalStorageAndPrepareData();
        this.status = param;
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
            this.restProvider.getActivityData(identity['userID']).then((result) => {
                //set activities to Storage
                this.storage.set('strActivities',JSON.stringify(result));

                //get refreshed activities from storage
                this.storage.get('strActivities').then((val) => {
                    let activity = <any>{};
                    activity = JSON.parse(val);
                    this.pushDataIntoList(activity);
                });
            }, (err) => {

                //get activities from storage if rest failed - no internet connection
                this.storage.get('strActivities').then((val) => {
                    let activity = <any>{};
                    activity = JSON.parse(val);
                    this.pushDataIntoList(activity);
                });
            });

            //get Aggregation data from REST - set to soratge and push to view
            this.restProvider.getAggregationData(identity['userID']).then((result) => {
              //set activities to Storage
              this.storage.set('strAggregation',JSON.stringify(result));

              //get refreshed aggregation data from storage
              this.storage.get('strAggregation').then((val) => {
                let aggregationData = <any>{};
                aggregationData = JSON.parse(val);
                this.pushDataIntoView(aggregationData);
              });
            }, (err) => {

              //get aggregation data from storage if rest failed - no internet connection
              this.storage.get('strAggregation').then((val) => {
                let aggregationData = <any>{};
                aggregationData = JSON.parse(val);
                this.pushDataIntoView(aggregationData);
              });
            });
        });
    }

  /**
   * Push data into view
   * @param data
   */
  pushDataIntoView(data){
      var countClosed = data["countClosed"];
      var countAll = data["countAll"];
      var countOpen = data["countOpen"];
      var countDenied = data["countDenied"];
      var sumDenied = data["sumDenied"]
      var sumClosed = data["sumClosed"];
      var sumAll = data["sumAll"];
      var sumOpen = data["sumOpen"];
    this.aggregate.push({
        countClosed: countClosed,
        countAll: countAll,
        countOpen: countOpen,
        countDenied: countDenied,
        sumAll: sumAll,
        sumOpen: sumOpen,
        sumClosed: sumClosed,
        sumDenied: sumDenied});
  }

  /**
   * Get activites from the activityList an push the items into the list
   * @param data
   */
  pushDataIntoList(data){
        //loop through the activityList

        for (let i in data.activityList) {
            let currentObject = data.activityList[i];

            //get values from a current activity
            Object.keys(currentObject).forEach(key => {

                var name = currentObject["ticketID"];
                var date = currentObject["createDate"];
                var status = currentObject["ticketStatus"];
                var iconName = "";
                var statusText = "";
                var cssClass = "";

                if (status == 0) {
                    statusText = "Offen";
                    iconName = "ios-disc";
                    cssClass = "actOpen";
                } else if (status == 1) {
                    statusText = "Bezahlt";
                    iconName = "ios-checkmark-circle";
                    cssClass = "actPaid";
                } else if (status == 2) {
                    statusText = "Abgelehnt";
                    iconName = "ios-close-circle";
                    cssClass = "actDenied";
                }

                // Add activity to list

                // Add Value to segment all
                if (key == "ticketID" && this.status == "all") {
                    this.activity.push({
                        date: date.toString(),
                        ticketID: name.toString(),
                        ticketStatus: statusText,
                        iconName: iconName,
                        cssClass: cssClass
                    });
                }
                // Add value to segment offen
                if (key == "ticketID" && this.status == "open" && statusText == "Offen") {
                    this.activity.push({
                        date: date.toString(),
                        ticketID: name.toString(),
                        ticketStatus: statusText,
                        iconName: iconName,
                        cssClass: cssClass
                    });
                }
                // Add Value to segment paid
                if (key == "ticketID"&& this.status == "paid" && statusText == "Bezahlt") {
                    this.activity.push({
                        date: date.toString(),
                        ticketID: name.toString(),
                        ticketStatus: statusText,
                        iconName: iconName,
                        cssClass: cssClass
                    });
                }
                // Add Value to segment denied
                if (key == "ticketID" && this.status == "denied" && statusText == "Abgelehnt") {
                    this.activity.push({
                        date: date.toString(),
                        ticketID: name.toString(),
                        ticketStatus: statusText,
                        iconName: iconName,
                        cssClass: cssClass
                    });
                }
            });
        }
    }

    goToScan(){
        this.navCtrl.push(ScanPage);
    }
    goToProfile(){
        this.navCtrl.push(ProfilePage);
    }
    goToContact(){
        this.navCtrl.push(ContactPage);
    }
    goToActivity(){
        this.navCtrl.push(ActivityPage);
    }
    goToHome(){
        this.navCtrl.push(HomePage);
    }
    goToImpressum(){
        this.navCtrl.push(ImpressumPage);
    }



    actRefresh(refresher) {
        console.log('Begin async operation', refresher);
        this.activity = [];
        this.aggregate = [];
        this.updateLocalStorageAndPrepareData();
        console.log('Async operation has ended');
        refresher.complete();

    }

    /**
     * Logout Funktion: logout() startet einen Confirm Alert. Bei Bestätigung des Logouts wird die Funktion performLogout() ausgeführt.
     * Im Anschluß erscheint ein Toast zur Bestätigung des erfolgreichen Logouts, nachdem der Storage geleert wurde.
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
