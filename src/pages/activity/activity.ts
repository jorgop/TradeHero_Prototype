import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { NewActivityPage } from "../new-activity/new-activity";
import {ActivityService} from "../../services/activity.service";

@Component({
    selector: 'page-activity',
    templateUrl: 'activity.html'
})
export class ActivityPage {
    activity: {title: string}[] = [];


    constructor(
        public navCtrl: NavController,
        private activityService: ActivityService) {

    }

    ionViewWillEnter(){
        this.activity = this.activityService.getActivity();
        let myjson = {
            "acticityList": [
                {
                    "ticketID": 1001,
                    "userID": 1,
                    "IBAN": "DE123123123123123123123",
                    "dateCreate": "2018-06-02",
                    "street": "Am Arzt Weg",
                    "houseNumber": "34",
                    "PLZ": "12345",
                    "place": "Frankfurt",
                    "accountName": "Praxis Super",
                    "bankName": "Deutsche Bank",
                    "refund": 450.23,
                    "imgFile": "0x2334",
                    "history": [
                        {
                            "ticketID": 1001,
                            "stateID": 1,
                            "sateDate": "2018-06-01",
                            "stateText": "Rechung wird gepüft",
                            "status": "1"
                        },
                        {
                            "ticketID": 1001,
                            "stateID": 2,
                            "sateDate": "2018-06-01",
                            "stateText": "Rechung wird bearbeitet",
                            "status": "1"
                        },
                        {
                            "ticketID": 1001,
                            "stateID": 3,
                            "sateDate": "2018-06-02",
                            "stateText": "Rechung wird überwiesen",
                            "status": "0"
                        }
                    ]
                },
                {
                    "ticketID": 1002,
                    "userID": 1,
                    "IBAN": "DE123123122342342355",
                    "dateCreate": "2018-06-02",
                    "street": "Am Graben",
                    "houseNumber": "322",
                    "PLZ": "12345",
                    "place": "Frankfurt",
                    "accountName": "Praxis Schlecht",
                    "bankName": "Frnakfurter Volksbank",
                    "refund": 50.23,
                    "imgFile": "0x2334",
                    "history": [
                        {
                            "ticketID": 1002,
                            "stateID": 1,
                            "sateDate": "2018-06-01",
                            "stateText": "Rechung wird gepüft",
                            "status": "1"
                        },
                        {
                            "ticketID": 1002,
                            "stateID": 2,
                            "sateDate": "2018-06-01",
                            "stateText": "Rechung wird bearbeitet",
                            "status": "0"
                        }
                    ]
                }
            ]
        };
        console.log(myjson);
        var test1 = myjson.acticityList[0].bankName;
        var test2 = myjson.acticityList[1].bankName;
        console.log(test1, test2);
        for(let i in myjson.acticityList){
            let currentObject = myjson.acticityList[i];
            Object.keys(currentObject).forEach(key =>{
                let iban = currentObject["IBAN"];
                if (key == "IBAN"){
                    console.log(iban);
                }
            });
        }
    }

    goToAddActivity(){
        this.navCtrl.push(NewActivityPage);
    }

}
