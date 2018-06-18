import { Component } from '@angular/core';
import {LoadingController, NavController} from 'ionic-angular';
import {ActivityService} from "../../services/activity.service";
import {Storage} from "@ionic/storage";
import {RestProvider} from "../../providers/rest/rest";
import {HistoryPage} from "../history/history";
import {HomePage} from "../home/home";

@Component({
    selector: 'page-activity',
    templateUrl: 'activity.html'
})
export class ActivityPage {
    activity: {date: string, ticketID:string,ticketStatus: string, iconName: String, cssClass: String}[] = [];
    // Erstes Segment default wählen
    status : string;

    constructor(public navCtrl: NavController,
                private activityService: ActivityService,
                private storage: Storage,
                public restProvider: RestProvider,
                public loadingController: LoadingController) {
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
        this.activity = this.activityService.getActivity();
        this.updateLocalStorageAndPrepareData();
        this.status = "all";
    }

    setStatus(param){
        this.activity=[];
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
        });
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

    goToHome(){
        this.navCtrl.popTo(HomePage);
    }

    actRefresh(refresher) {
        console.log('Begin async operation', refresher);
        this.activity=[];
        this.updateLocalStorageAndPrepareData();
        console.log('Async operation has ended');
        refresher.complete();

    }
}