import { Component } from '@angular/core';
import {LoadingController, NavController} from 'ionic-angular';
import { NewActivityPage } from "../new-activity/new-activity";
import {ActivityService} from "../../services/activity.service";
import {Storage} from "@ionic/storage";
import {RestProvider} from "../../providers/rest/rest";
import {HistoryPage} from "../history/history";

@Component({
    selector: 'page-activity',
    templateUrl: 'activity.html'
})
export class ActivityPage {
    activity: {date: string, ticketID:string,ticketStatus: string}[] = [];

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


          /* Jorgos Spielwiese - Daten die in einem item angezeigt werden sollen
          *
          *    Bitte nicht einfach die Beispiele blind kopieren sondern die Dokumentation anschauen und verstehen
          *    was genau gemacht werden muss und wie die Komponenten funktionieren!
          *
          *
          *  -  Prüfen relevanter abfragen wie status, offen, geschlossen, abgelehnt
          *
          *  -  Überlegen was hier bereits gemacht wird. Soll bereits hier die Farbe an Hand
          *     der stati übergeben werden: Mögliche Lösung innerHtml
          *
          *     Infos: https://stackoverflow.com/questions/44759693/render-html-content-in-ionic-v3
          *
          *      Beispiel: <div [innerHtml]={{activity.ticketStatus}}></div>
          *
          *                {{activity.ticketStatus}} wird dann aus dem backend übertragen und ist
          *                kein string sondern html code der dann angezeigt wird, du übergibst quasi html
          *                von typescript ins frontend und kann so sagen welche Farbe da stehen soll
          *
          *      Eine weitere Möglichkeit könnte sein über [innerHtml] in einem div eine klasse mitzugeben
          *      Beispielweise offen, in Bearbeitung, angelehnt über scss kann dann über die klasse die Farbe gesteuert
          *      werden, ggf. auch mal mit den Mädels reden wenn die sich damit beschäftigen was hier für sie
          *      einfacher ist
          *
          *
          *  -  Refresh der Seite mit Hilfe des Resfresher (beim pull down seite aktualisieren)
          *
          *     Infos: https://ionicframework.com/docs/api/components/refresher/Refresher/
          *
          *     Beispiel: 1. Refresher unter den content einbauen:
          *
          *               <ion-content>
          *               <ion-refresher (ionRefresh)="doRefresh($event)">
          *               <ion-refresher-content></ion-refresher-content>
          *               </ion-refresher>
          *               <h2>Meine Rechnungen</h2>
          *               ....
          *               ....
          *               ....
          *               </ion-list>
          *               </ion-content>
          *
          *               2. Funktion in tpescript anlegen
          *
          *               doRefresh(refresher) {
          *                  console.log('Begin async operation', refresher);
          *
          *                  Hier musst du die funktion aufrufen die die daten holt und in die liste schreibt
          *
          *                  setTimeout(() => {
          *                    console.log('Async operation has ended');
          *                    refresher.complete();
          *                  }, 2000);
          *                }
          *
          *               Vorsicht: vorher muss die Liste bei uns "activity" gelöscht werden - liste = []
          *                         sonst werden die items immer hinzugefügt und  sind doppelt in der liste
          *
          *               Weitere infos wie alle items aus der Liste gelöscht werden: https://stackoverflow.com/questions/40340166/how-to-clear-all-list-in-ionic2
          *
          *   -  Implementieren der Leiste (Segment) zum Wechseln zwischen Alle, offen, abgeschlossen, abgelehnt
          *
          *
          *      Infos zum Segment: https://ionicframework.com/docs/api/components/segment/Segment/
          *
          *      Filtern der Items: Hier haben wir 2 Möglichkeiten:
          *
          *      1. Die items werden über den Satus von dir gefiltert also wenn offen ausgewählt wurde dann fügst du
          *         nur items mit Status 1 für offen hinzu.
          *
          *      2. Der Server filtert die items und gibt dir nur noch die die du auch brauchst. (hier müsste der REST angepasst werden)
          *
          *   -  Es muss angezeigt werden wie viel Geld bereits ausgezahlt wurde und wie viel noch aussteht
          *      Idee: hier müssen wir wahrscheinlich eine REST-Abfrage bauen die bereits die summierten Zahlen zurück gibt, du kannst aber schon mal
          *      die Felder anlegen in HTML und wir machen uns dann gemeinsam Gedanken
          */



          var name = currentObject["ticketID"];
          var date = currentObject["createDate"];
          var status = currentObject["ticketStatus"];
          var statusText = "";

          if(status == 0){
            statusText = "Offen";
          }else if(status == 1){
            statusText = "Abgeschlossen";
          }else{
            statusText = "Abgelehnt";
          }

          // Add activity to list
          if (key == "ticketID") {
            this.activity.push({date:date.toString() ,ticketID: name.toString(), ticketStatus: statusText});
          }
        });
      }
    }


  //Navigate to NewActivityPage
    goToAddActivity(){
        this.navCtrl.push(NewActivityPage);
    }

}
